<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CacheKeyService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminStockController extends Controller
{
    // List all products with stock info, filterable by threshold
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $query = Product::with(['category', 'brand']);

        if ($request->filled('status')) {
            if ($request->status === 'low') {
                $query->where('stock', '>', 0)->where('stock', '<=', 10);
            } elseif ($request->status === 'out') {
                $query->where('stock', '=', 0);
            } elseif ($request->status === 'ok') {
                $query->where('stock', '>', 10);
            }
        }

        $products = $query->orderBy('stock', 'asc')->get(['id', 'name', 'image_url', 'category_id', 'brand_id', 'brand', 'stock', 'price']);

        return response()->json([
            'success' => true,
            'products' => $products,
            'summary' => [
                'total' => Product::count(),
                'low_stock' => Product::where('stock', '>', 0)->where('stock', '<=', 10)->count(),
                'out_of_stock' => Product::where('stock', '=', 0)->count(),
            ],
        ]);
    }

    // Quick stock adjustment from the Stocks page
    public function updateStock(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $product = Product::find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Produit non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $stockBefore = (int) $product->stock;
        $product->update(['stock' => $request->stock]);

        // Alert staff when a manual adjustment pushes the product into
        // low-stock territory.
        NotificationService::notifyLowStock($product, $stockBefore);

        CacheKeyService::bump('products');

        return response()->json(['success' => true, 'message' => 'Stock mis à jour avec succès.', 'product' => $product]);
    }

    // Scan a product barcode and return the matching product with its stock.
    // Falls back to a real-world lookup (Open Food Facts / Open Beauty Facts)
    // when the barcode is not in the local catalog.
    public function scanByBarcode(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'barcode' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $barcode = trim($request->barcode);

        // 1) Local catalog first
        $product = Product::with(['category', 'brand'])
            ->where('barcode', $barcode)
            ->first();

        if ($product) {
            // When the product has no price yet, try to backfill it (and the
            // missing brand/description) from the official AMMPS register so
            // the price really appears after the scan instead of 00.00 DH.
            $product = $this->backfillLocalProduct($product);

            // Each scan automatically adds +1 to the stock.
            $product->increment('stock', 1);
            $product->refresh();

            CacheKeyService::bump('products');

            return response()->json([
                'success' => true,
                'source' => 'local',
                'added_quantity' => 1,
                'product' => $this->serializeLocalProduct($product),
            ]);
        }

        // 2) Real-world lookup (Open Food Facts / Open Beauty Facts /
        //    Open Pet Food Facts / Open Products Facts)
        $external = $this->lookupExternalBarcode($barcode);
        if ($external) {
            // Auto-create the product in the local catalog so it immediately
            // appears in the products list, then add +1 to its stock.
            $product = $this->autoCreateProduct($barcode, $external);
            $product->increment('stock', 1);
            $product->refresh();

            CacheKeyService::bump('products');

            return response()->json([
                'success' => true,
                'source' => 'local',
                'auto_created' => true,
                'added_quantity' => 1,
                'product' => $this->serializeLocalProduct($product),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Produit introuvable : ni dans votre catalogue, ni dans les bases mondiales (les médicaments n\'y figurent généralement pas). Ajoutez-le manuellement avec son code-barres.',
        ], 404);
    }

    // All local fields, so the admin gets the maximum info about a product
    private function serializeLocalProduct(Product $product): array
    {
        $brand = is_object($product->brand) ? $product->brand->name : $product->brand;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'brand' => $brand,
            'brand_name' => $brand,
            'barcode' => $product->barcode,
            'price' => $product->price,
            'discount_price' => $product->discount_price,
            'stock' => $product->stock,
            'description' => $product->description,
            'ingredients' => $product->ingredients,
            'usage_instructions' => $product->usage_instructions,
            'image_url' => $product->image_url,
            'is_featured' => (bool) $product->is_featured,
            'requires_prescription' => (bool) $product->requires_prescription,
            'category' => $product->category?->name,
            'created_at' => $product->created_at?->toIso8601String(),
        ];
    }

    // Create a local product from the real-world data so that every scanned
    // barcode ends up in the catalog and can be stocked right away.
    // Price is set to 0.00 as a placeholder (world data has no local price).
    private function autoCreateProduct(string $barcode, array $data): Product
    {
        $name = $data['name'] ?? "Produit {$barcode}";
        $slug = Str::slug($name).'-'.rand(100, 999);
        while (Product::where('slug', $slug)->exists()) {
            $slug = Str::slug($name).'-'.rand(100, 999);
        }

        $description = null;
        if (! empty($data['generic_name'])) {
            $description = trim($data['generic_name']);
        }
        if (! empty($data['category'])) {
            $description = trim(($description ?? '')."\n\nCatégorie : ".$data['category']);
        }

        return Product::create([
            'category_id' => $this->resolveCategory($data['category'] ?? null)->id,
            'name' => $name,
            'slug' => $slug,
            'brand' => $data['brand'] ?? null,
            'description' => $description,
            'ingredients' => $data['ingredients'] ?? null,
            'usage_instructions' => $data['usage_instructions'] ?? null,
            'price' => 0.00,
            'stock' => 0,
            'barcode' => $barcode,
            'image_url' => $data['image_url'] ?? null,
            'is_featured' => false,
            'requires_prescription' => false,
        ]);
    }

    // Lookup a barcode across the free Open Facts databases (food, cosmetics /
    // parapharmacy, pet food, and general non-food products) so that any product
    // in the world can be found.
    private function lookupExternalBarcode(string $barcode): ?array
    {
        $cacheKey = "barcode_lookup:{$barcode}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $timeout = (int) config('services.openfoodfacts.timeout', 8);

        $databases = [
            'food' => config('services.openfoodfacts.base_url'),
            'beauty' => config('services.openfoodfacts.beauty_base_url'),
            'petfood' => config('services.openfoodfacts.petfood_base_url'),
            'products' => config('services.openfoodfacts.products_base_url'),
        ];

        $result = null;

        foreach ($databases as $dbKey => $baseUrl) {
            if ($baseUrl === null) {
                continue;
            }

            try {
                $response = Http::timeout($timeout)
                    ->acceptJson()
                    ->get(rtrim($baseUrl, '/')."/api/v2/product/{$barcode}.json");

                if (! $response->successful()) {
                    continue;
                }

                $data = $response->json();
                if (($data['status'] ?? 0) !== 1 || empty($data['product'])) {
                    continue;
                }

                $p = $data['product'];
                $result = [
                    'name' => $p['product_name'] ?? $p['generic_name'] ?? "Produit {$barcode}",
                    'generic_name' => $p['generic_name'] ?? null,
                    'brand' => $p['brands'] ?? null,
                    'barcode' => $data['code'] ?? $barcode,
                    'image_url' => $p['image_front_url'] ?? $p['image_url'] ?? null,
                    'quantity' => $p['quantity'] ?? null,
                    'category' => $p['categories'] ?? null,
                    'ingredients' => $p['ingredients_text'] ?? null,
                    'usage_instructions' => $p['how_to_use'] ?? $p['instructions'] ?? null,
                    'serving_size' => $p['serving_size'] ?? null,
                    'labels' => $p['labels_tags'] ?? [],
                    'nutrition_grades' => $p['nutrition_grades'] ?? null,
                    'packaging' => $p['packaging_text'] ?? null,
                    'nova_group' => isset($p['nova_group']) ? (int) $p['nova_group'] : null,
                    'ecoscore_grade' => $p['ecoscore_grade'] ?? null,
                    'producer' => $p['producer'] ?? $p['manufacturing_places'] ?? null,
                    'database' => $dbKey,
                    'product_url' => rtrim($baseUrl, '/')."/product/{$barcode}",
                ];
                break;
            } catch (\Exception $e) {
                Log::warning('Barcode external lookup failed.', [
                    'barcode' => $barcode,
                    'database' => $dbKey,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($result !== null) {
            Cache::put($cacheKey, $result, now()->addHours(24));
        }

        return $result;
    }

    // Search the official Moroccan medicines register (AMMPS) by name / DCI.
    // Used after a failed barcode scan to help identify a medicine, since the
    // AMMPS database has no barcode (EAN) data and no public API.
    public function ammpsSearch(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'search' => 'required|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $keyword = trim($request->search);
        $cacheKey = 'ammps_search:'.mb_strtolower($keyword);

        if (Cache::has($cacheKey)) {
            return response()->json(['success' => true, 'keyword' => $keyword, 'medicines' => Cache::get($cacheKey)]);
        }

        try {
            $medicines = $this->ammpsLookup($keyword);

            if (empty($medicines)) {
                return response()->json([
                    'success' => true,
                    'keyword' => $keyword,
                    'medicines' => [],
                    'message' => "Aucun médicament marocain trouvé pour « {$keyword} ».",
                ]);
            }

            Cache::put($cacheKey, $medicines, now()->addHours(1));

            return response()->json(['success' => true, 'keyword' => $keyword, 'medicines' => $medicines]);
        } catch (\Exception $e) {
            Log::warning('AMMPS search failed.', ['keyword' => $keyword, 'error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'Impossible de contacter le registre AMMPS.'], 502);
        }
    }

    // Shared AMMPS lookup used both by the search endpoint and the automatic
    // price backfill on scan. Throws when the register is unreachable so the
    // caller decides (HTTP 502 for the endpoint, silent ignore for backfill).
    private function ammpsLookup(string $keyword, ?int $timeout = null): array
    {
        $cacheKey = 'ammps_search:'.mb_strtolower($keyword);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $response = Http::timeout($timeout ?? (int) config('services.ammps.timeout', 15))
            ->withHeaders(['User-Agent' => config('services.ammps.user_agent')])
            ->get(rtrim(config('services.ammps.base_url'), '/').'/basesdedonnes/liste_marocaine_des_medicaments', [
                'search' => $keyword,
                'forme' => '',
                'statut' => '',
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('AMMPS HTTP '.$response->status());
        }

        $medicines = $this->parseAmmpsPage($response->body());

        if (! empty($medicines)) {
            Cache::put($cacheKey, $medicines, now()->addHours(1));
        }

        return $medicines;
    }

    // Fill a local product with the official AMMPS price (PPV), brand and
    // description when the scanned product has no price set yet.
    private function backfillLocalProduct(Product $product): Product
    {
        if ($product->price > 0 && $product->brand !== null && ! empty($product->description)) {
            return $product;
        }

        $name = trim($product->name);
        if ($name === '' || str_starts_with(mb_strtolower($name), 'produit ')) {
            return $product;
        }

        try {
            $best = null;
            // AMMPS matches on the name without the dosage, so try simpler and
            // simpler keywords (full name, name without dosage, first word).
            foreach ($this->ammpsKeywords($name) as $keyword) {
                $medicines = $this->ammpsLookup($keyword, 8);
                $best = $this->bestAmmpsMatch($medicines, $name);
                if ($best) {
                    break;
                }
            }

            if (! $best) {
                return $product;
            }

            $dirty = false;
            if ($product->price <= 0 && ! empty($best['ppv'])) {
                $product->price = $best['ppv'];
                $dirty = true;
            }
            if ($product->brand === null && ! empty($best['epi'])) {
                $product->brand = $best['epi'];
                $dirty = true;
            }
            if (empty($product->description)) {
                $parts = [];
                if (! empty($best['dci'])) {
                    $parts[] = 'Substance active : '.$best['dci'];
                }
                if (! empty($best['forme'])) {
                    $parts[] = 'Forme : '.$best['forme'];
                }
                if (! empty($best['presentation'])) {
                    $parts[] = 'Présentation : '.$best['presentation'];
                }
                if (! empty($best['classe'])) {
                    $parts[] = 'Classe thérapeutique : '.$best['classe'];
                }
                $product->description = implode("\n", $parts) ?: null;
                $dirty = true;
            }

            if ($dirty) {
                $product->save();
                $product->refresh();
            }
        } catch (\Exception $e) {
            Log::warning('AMMPS backfill failed.', ['product_id' => $product->id, 'error' => $e->getMessage()]);
        }

        return $product;
    }

    // Progressive search keywords for an AMMPS lookup: full name, then the
    // name without its dosage, then the first word.
    private function ammpsKeywords(string $name): array
    {
        $keywords = [trim($name)];

        $noDosage = trim(preg_replace('/\b\d+\s*([,.]\s*\d+)?\s*(MG|G|ML|UI|%|MCG)\b/iu', '', $name));
        if ($noDosage !== '' && mb_strtolower($noDosage) !== mb_strtolower($keywords[0])) {
            $keywords[] = $noDosage;
        }

        $first = trim(mb_strtolower(explode(' ', preg_replace('/\s+/u', ' ', $name))[0]));
        if ($first !== '' && ! in_array(mb_strtolower($noDosage), [$first, ''], true)) {
            $keywords[] = $first;
        }

        return array_values(array_unique($keywords));
    }

    // Pick the medicine that best matches a product name among AMMPS results.
    private function bestAmmpsMatch(array $medicines, string $name): ?array
    {
        if (empty($medicines)) {
            return null;
        }

        $normalize = fn (string $value): string => mb_strtolower(trim(preg_replace('/\s+/u', ' ', $value)));
        $norm = $normalize($name);

        foreach ($medicines as $medicine) {
            if ($normalize($medicine['name'] ?? '') === $norm) {
                return $medicine;
            }
        }

        foreach ($medicines as $medicine) {
            if (! empty($medicine['ppv'])) {
                return $medicine;
            }
        }

        return $medicines[0];
    }

    // Parse the AMMPS search results page (server-rendered HTML table) and
    // enrich every row with its detail modal (présentation, prix PPV, RX...).
    private function parseAmmpsPage(string $html): array
    {
        $medicines = [];

        if (! class_exists(\DOMDocument::class)) {
            return $medicines;
        }

        $dom = new \DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="UTF-8">'.$html);
        libxml_clear_errors();

        $xpath = new \DOMXPath($dom);
        $rows = $xpath->query("//table[@id='medicamentsTable']//tbody//tr");

        foreach ($rows as $row) {
            $tds = $xpath->query('./td', $row);
            if ($tds->length < 7) {
                continue;
            }

            $cells = [];
            foreach ($tds as $td) {
                $cells[] = trim(preg_replace('/\s+/u', ' ', $td->textContent));
            }

            $detail = [];
            if ($tds->length >= 8) {
                $links = $xpath->query('./td[8]//*[@data-bs-target or @href]', $row);
                foreach ($links as $link) {
                    $attr = $link->getAttribute('data-bs-target') ?: $link->getAttribute('href');
                    if (preg_match('/#medicamentModal(\d+)/', $attr, $m)) {
                        $detail = $this->parseAmmpsModal($xpath, $m[1]);
                        break;
                    }
                }
            }

            $medicines[] = array_merge([
                'name' => $cells[0],
                'dosage' => $cells[1] ?? null,
                'forme' => $cells[2] ?? null,
                'dci' => $cells[3] ?? null,
                'classe' => $cells[4] ?? null,
                'epi' => $cells[5] ?? null,
                'statut' => $cells[6] ?? null,
            ], $detail);
        }

        return $medicines;
    }

    // Parse the detail modal of a medicine (présentation, prix PPV/PH, RX...).
    private function parseAmmpsModal(\DOMXPath $xpath, string $id): array
    {
        $result = [];
        $node = $xpath->query("//*[@id='medicamentModal{$id}']")->item(0);
        if (! $node) {
            return $result;
        }

        $items = $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' ammps-modal-item ')]", $node);
        foreach ($items as $item) {
            $labelNode = $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' ammps-modal-label ')]", $item)->item(0);
            if (! $labelNode) {
                continue;
            }
            $valueNode = $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' ammps-modal-value ')]", $item)->item(0);
            $label = trim(preg_replace('/\s+/u', ' ', $labelNode->textContent));
            $value = $valueNode ? trim(preg_replace('/\s+/u', ' ', $valueNode->textContent)) : null;
            $result[$label] = $value;
        }

        $isRx = false;
        if (! empty($result['PP / GN'])) {
            $isRx = mb_strtoupper(trim($result['PP / GN'])) === 'RX';
        }

        $rcpUrl = null;
        $rcpNodes = $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' ammps-modal-item ') and .//*[contains(concat(' ', normalize-space(@class), ' '), ' ammps-modal-label ') and normalize-space(.)='Lien RCP / NAF']]//a[@href]", $node);
        if ($rcpNodes->length > 0) {
            $rcpUrl = $rcpNodes->item(0)->getAttribute('href');
        }

        return [
            'statut_amm' => $result['Statut AMM'] ?? null,
            'presentation' => $result['Présentation'] ?? null,
            'pp_gn' => $result['PP / GN'] ?? null,
            'is_rx' => $isRx,
            'ppv' => $this->parseAmmpsPrice($result['PPV'] ?? null),
            'ph' => $this->parseAmmpsPrice($result['PH'] ?? null),
            'tva' => $result['TVA'] ?? null,
            'rcp_url' => $rcpUrl,
        ];
    }

    // Normalize an AMMPS price like "10,70 DH" or "4.303.00 DH" into a float.
    private function parseAmmpsPrice(?string $raw): ?float
    {
        if ($raw === null || trim($raw) === '' || trim($raw) === '-') {
            return null;
        }

        $raw = strtoupper(trim($raw));
        if (preg_match('/^SANS/', $raw)) {
            return null;
        }

        $v = str_replace('DH', '', $raw);
        $v = str_replace(' ', '', $v);
        $v = str_replace(',', '.', $v);

        $parts = explode('.', $v);
        if (count($parts) > 2) {
            $dec = array_pop($parts);
            $v = implode('', $parts).'.'.$dec;
        }

        $float = (float) $v;

        return $float > 0 ? $float : null;
    }

    // Create a local product from a medicine picked in the AMMPS search so the
    // scanned barcode lands in the catalog with price (PPV), category, brand,
    // description and prescription flag, then add +1 to its stock.
    public function ammpsCreate(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'barcode' => 'nullable|string|max:255',
            'medicine' => 'required|array',
            'medicine.name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $barcode = trim((string) $request->input('barcode'));
        $medicine = $request->input('medicine');

        // Already in the catalog ? Just scan it (+1).
        $existing = $barcode !== '' ? Product::where('barcode', $barcode)->first() : null;
        if ($existing) {
            $existing->increment('stock', 1);
            $existing->refresh();
            CacheKeyService::bump('products');

            return response()->json([
                'success' => true,
                'source' => 'local',
                'added_quantity' => 1,
                'product' => $this->serializeLocalProduct($existing),
            ]);
        }

        $product = $this->createMedicineProduct($barcode, $medicine);
        $product->increment('stock', 1);
        $product->refresh();

        CacheKeyService::bump('products');

        return response()->json([
            'success' => true,
            'source' => 'local',
            'auto_created' => true,
            'added_quantity' => 1,
            'product' => $this->serializeLocalProduct($product),
        ]);
    }

    private function createMedicineProduct(string $barcode, array $medicine): Product
    {
        $name = trim(($medicine['name'] ?? 'Médicament').' '.($medicine['dosage'] ?? ''));
        $slug = Str::slug($name).'-'.rand(100, 999);
        while (Product::where('slug', $slug)->exists()) {
            $slug = Str::slug($name).'-'.rand(100, 999);
        }

        $parts = [];
        if (! empty($medicine['dci'])) {
            $parts[] = 'Substance active : '.$medicine['dci'];
        }
        if (! empty($medicine['forme'])) {
            $parts[] = 'Forme : '.$medicine['forme'];
        }
        if (! empty($medicine['presentation'])) {
            $parts[] = 'Présentation : '.$medicine['presentation'];
        }
        if (! empty($medicine['classe'])) {
            $parts[] = 'Classe thérapeutique : '.$medicine['classe'];
        }
        if (! empty($medicine['statut'])) {
            $parts[] = 'Statut : '.$medicine['statut'];
        }

        return Product::create([
            'category_id' => $this->resolveCategory($medicine['classe'] ?? null)->id,
            'name' => $name,
            'slug' => $slug,
            'brand' => $medicine['epi'] ?? null,
            'description' => implode("\n", $parts) ?: null,
            'ingredients' => $medicine['dci'] ?? null,
            'usage_instructions' => null,
            'price' => $medicine['ppv'] ?? 0.00,
            'stock' => 0,
            'barcode' => $barcode !== '' ? $barcode : null,
            'image_url' => null,
            'is_featured' => false,
            'requires_prescription' => ! empty($medicine['is_rx']),
        ]);
    }

    // Pick the best local category for a product hint (therapeutic class, Open
    // Facts category...), preferring a "Médicaments" category when it is a
    // medicine, and creating a generic one when none exists.
    private function resolveCategory(?string $hint): Category
    {
        $hintNorm = $hint !== null ? mb_strtolower(trim($hint)) : null;

        if ($hintNorm !== null && $hintNorm !== '') {
            $medCat = Category::whereRaw('LOWER(name) LIKE ?', ['%médicament%'])
                ->orWhereRaw('LOWER(slug) LIKE ?', ['%medicament%'])
                ->first();
            if ($medCat) {
                return $medCat;
            }

            $cat = Category::whereRaw('LOWER(name) = ?', [$hintNorm])
                ->orWhereRaw('LOWER(name) LIKE ?', ['%'.$hintNorm.'%'])
                ->first();
            if ($cat) {
                return $cat;
            }
        }

        $first = Category::first();
        if ($first) {
            return $first;
        }

        return Category::create([
            'name' => 'Médicaments',
            'slug' => 'medicaments-'.rand(100, 999),
            'description' => 'Médicaments ajoutés automatiquement.',
        ]);
    }

    // Add a quantity to the stock of a product (restocking)
    public function addStock(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $product = Product::with(['category', 'brand'])->find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Produit non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1|max:100000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $product->increment('stock', (int) $request->quantity);
        $product->refresh();

        CacheKeyService::bump('products');

        return response()->json([
            'success' => true,
            'message' => "Stock augmenté de {$request->quantity} unité(s).",
            'product' => $product,
        ]);
    }
}
