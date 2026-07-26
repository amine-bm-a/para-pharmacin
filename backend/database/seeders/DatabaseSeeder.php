<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users
        User::create([
            'name' => 'Admin Pharmacie',
            'email' => 'admin@pharmacie-benmoussaabbes.ma',
            'phone' => '0522123456',
            'role' => 'admin',
            'password' => bcrypt('admin123'),
        ]);

        User::create([
            'name' => 'Ahmed El Amrani',
            'email' => 'client@example.com',
            'phone' => '0522123456',
            'role' => 'client',
            'password' => bcrypt('password123'),
        ]);

        User::create([
            'name' => 'Youssef Bennani',
            'email' => 'employe@example.com',
            'phone' => '0661987654',
            'role' => 'employe',
            'password' => bcrypt('employe123'),
        ]);

        // 2. Create Categories
        $categories = [
            [
                'name' => 'Médicaments',
                'slug' => 'medicaments',
                'description' => 'Médicaments avec ou sans ordonnance.',
                'image_url' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
            ],
            [
                'name' => 'Soins du visage',
                'slug' => 'soins-du-visage',
                'description' => 'Produits dermatologiques pour le visage.',
                'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80',
            ],
            [
                'name' => 'Soins du corps',
                'slug' => 'soins-du-corps',
                'description' => 'Hydratation, hygiène et soins corporels.',
                'image_url' => 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300&q=80',
            ],
            [
                'name' => 'Santé & Bien-être',
                'slug' => 'sante-bien-etre',
                'description' => 'Vitamines, compléments alimentaires et bien-être.',
                'image_url' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&q=80',
            ],
            [
                'name' => 'Bébé & Maman',
                'slug' => 'bebe-maman',
                'description' => 'Produits pédiatriques et de maternité.',
                'image_url' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
            ],
            [
                'name' => 'Hygiène',
                'slug' => 'hygiene',
                'description' => 'Produits d\'hygiène quotidienne.',
                'image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
            ],
            [
                'name' => 'Nature & Bio',
                'slug' => 'nature-bio',
                'description' => 'Produits naturels et biologiques.',
                'image_url' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&q=80',
            ],
            [
                'name' => 'Cheveux',
                'slug' => 'cheveux',
                'description' => 'Shampooings, masques et soins capillaires.',
                'image_url' => 'https://images.unsplash.com/photo-1527799863830-dc475b64c7cbd?w=300&q=80',
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = Category::create($cat);
        }

        // 2b. Create Brands
        $brandNames = ['Bioderma', 'La Roche-Posay', 'Avène', 'CeraVe', 'Vichy', 'Nuxe', 'A-Derma', 'Vitarock'];
        $brandModels = [];
        foreach ($brandNames as $brandName) {
            $brandModels[$brandName] = Brand::create([
                'name' => $brandName,
                'slug' => Str::slug($brandName).'-'.rand(100, 999),
                'description' => "Produits {$brandName} disponibles à la pharmacie.",
            ]);
        }

        // 3. Create Products
        $products = [
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'Bioderma Créaline H2O',
                'slug' => 'bioderma-crealine-h2o',
                'brand' => 'Bioderma',
                'description' => 'Solution micellaire nettoyante et démaquillante spécifique des peaux sensibles.',
                'ingredients' => 'Aqua/Water/Eau, PEG-6 Caprylic/Capric Glycerides, Fructooligosaccharides, Mannitol, Xylitol, Rhamnose, Cucumis Sativus (Cucumber) Fruit Extract, Propylene Glycol, Cetrimonium Bromide, Disodium EDTA.',
                'usage_instructions' => 'Matin et/ou soir – 7 jours sur 7. Imbibez un coton de Créaline H2O. Nettoyez et/ou démaquillez votre visage et vos yeux avec douceur.',
                'price' => 129.00,
                'discount_price' => 109.00,
                'stock' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'La Roche-Posay Effaclar Gel moussant',
                'slug' => 'la-roche-posay-effaclar-gel-moussant',
                'brand' => 'La Roche-Posay',
                'description' => 'Nettoie en douceur et purifie la peau. Élimine les impuretés et l\'excès de sébum sans agresser la peau.',
                'ingredients' => 'Aqua/Water, Sodium Laureth Sulfate, PEG-8, Coco-Betaine, Hexylene Glycol, Sodium Chloride, PEG-120 Methyl Glucose Dioleate, Zinc PCA, Sodium Hydroxide, Citric Acid, Sodium Benzoate, Phenoxyethanol, Parfum/Fragrance.',
                'usage_instructions' => 'Faire mousser dans la main avec un peu d\'eau et appliquer sur le visage en massant doucement. Rincer abondamment.',
                'price' => 149.00,
                'discount_price' => 129.00,
                'stock' => 35,
                'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'Avène Eau Thermale Spray',
                'slug' => 'avene-eau-thermale-spray',
                'brand' => 'Avène',
                'description' => 'Apaisante par nature, adoucissante et anti-irritante, l\'Eau Thermale d\'Avène est le soin essentiel de toutes les peaux sensibles.',
                'ingredients' => 'Avene Thermal Spring Water (Avene Aqua), Nitrogen gas.',
                'usage_instructions' => 'Pulvérisez une fine brume sur la peau. Laissez agir quelques instants avant de sécher délicatement.',
                'price' => 89.00,
                'stock' => 100,
                'image_url' => 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-corps']->id,
                'name' => 'Cerave Crème Hydratante',
                'slug' => 'cerave-creme-hydratante',
                'brand' => 'CeraVe',
                'description' => 'Nourrit, hydrate et restaure la barrière protectrice de la peau. Enrichie aux 3 céramides essentiels et acide hyaluronique.',
                'ingredients' => 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid.',
                'usage_instructions' => 'Appliquer aussi souvent que nécessaire sur le visage et le corps.',
                'price' => 177.00,
                'stock' => 45,
                'image_url' => 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'Vichy Minéral 89',
                'slug' => 'vichy-mineral-89',
                'brand' => 'Vichy',
                'description' => 'Booster quotidien fortifiant et repulpant à l\'acide hyaluronique et à l\'eau volcanique de Vichy.',
                'ingredients' => 'Aqua/Water, PEG/PPG/Polybutylene Glycol-8/5/3 Glycerin, Glycerin, Butylene Glycol, Methyl Gluceth-20, Carbomer, Sodium Hyaluronate, Phenoxyethanol, Caprylyl Glycol, Citric Acid.',
                'usage_instructions' => 'Appliquer 2 gouttes sur une peau propre, matin et soir, comme premier geste de votre routine.',
                'price' => 279.00,
                'discount_price' => 249.00,
                'stock' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-corps']->id,
                'name' => 'Nuxe Huile Prodigieuse',
                'slug' => 'nuxe-huile-prodigieuse',
                'brand' => 'Nuxe',
                'description' => 'Huile sèche multi-fonctions pour le visage, le corps et les cheveux. Nourrit, répare et sublime.',
                'ingredients' => 'Coco-Caprylate/Caprate, Macadamia Integrifolia Seed Oil, Dicaprylyl Ether, Caprylic/Capric Triglyceride, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Corylus Avellana (Hazel) Seed Oil, Camellia Oleifera Seed Oil, Parfum/Fragrance.',
                'usage_instructions' => 'S\'utilise toute l\'année sur le visage, le corps et les cheveux.',
                'price' => 180.00,
                'stock' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
                'is_featured' => true,
            ],
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'La Roche-Posay Toleriane Crème',
                'slug' => 'la-roche-posay-toleriane-creme',
                'brand' => 'La Roche-Posay',
                'description' => 'Soin apaisant protecteur pour les peaux intolérantes ou allergiques.',
                'ingredients' => 'Aqua, Isocetyl Stearate, Squalane, Butyrospermum Parkii Butter, Glycerin, Aluminum Starch Octenylsuccinate, Pentylene Glycol, PEG-100 Stearate, Glyceryl Stearate, Cetyl Alcohol, Sodium Hydroxide.',
                'usage_instructions' => 'Appliquer sur le visage et le cou matin et soir.',
                'price' => 169.00,
                'stock' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80',
                'is_featured' => false,
            ],
            [
                'category_id' => $categoryModels['soins-du-corps']->id,
                'name' => 'A-Derma Exomega Lait émolient',
                'slug' => 'a-derma-exomega-lait-emolient',
                'brand' => 'A-Derma',
                'description' => 'Lait émollient anti-grattage apaise immédiatement et contrôle les irritations liées à la sécheresse de la peau.',
                'ingredients' => 'Water, Glycerin, Caprylic/Capric Triglyceride, Glyceryl Stearate, Niacinamide, Peg-100 Stearate, 10-Hydroxydecenoic Acid, Avena Sativa (Oat) Leaf/Stem Extract, Benzoic Acid, Caprylyl Glycol.',
                'usage_instructions' => 'Appliquer 1 à 2 fois par jour sur les zones sèches du visage et du corps préalablement nettoyées.',
                'price' => 119.00,
                'stock' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
                'is_featured' => false,
            ],
            [
                'category_id' => $categoryModels['soins-du-visage']->id,
                'name' => 'Vichy Normaderm Soin',
                'slug' => 'vichy-normaderm-soin',
                'brand' => 'Vichy',
                'description' => 'Soin double-correction quotidien pour peaux à tendance acnéique. Purifie, corrige les imperfections et hydrate.',
                'ingredients' => 'Aqua / Water, Glycerin, Salicylic Acid, Isononyl Isononanoate, Butylene Glycol, Kaolin, Zinc Sulfate, Bifida Ferment Lysate, Sodium Hydroxide, Sodium Polyacrylate, Sodium Hyaluronate.',
                'usage_instructions' => 'Appliquer matin et soir sur le visage préalablement nettoyé, en évitant le contour des yeux.',
                'price' => 139.00,
                'stock' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
                'is_featured' => false,
            ],
            [
                'category_id' => $categoryModels['sante-bien-etre']->id,
                'name' => 'Vitamine C 1000mg Vitarock',
                'slug' => 'vitamine-c-1000mg-vitarock',
                'brand' => 'Vitarock',
                'description' => 'Complément alimentaire riche en Vitamine C pour booster l\'immunité et réduire la fatigue.',
                'ingredients' => 'Vitamine C (acide ascorbique), cellulose, stéarate de magnésium végétal, silice.',
                'usage_instructions' => 'Prendre 1 comprimé par jour avec un grand verre d\'eau, de préférence le matin.',
                'price' => 90.00,
                'discount_price' => 79.00,
                'stock' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
                'is_featured' => true,
            ],
        ];

        foreach ($products as $prod) {
            $prod['brand_id'] = $brandModels[$prod['brand']]->id ?? null;
            $createdProd = Product::create($prod);

            // 4. Create some reviews for each product
            Review::create([
                'product_id' => $createdProd->id,
                'user_id' => 2, // Ahmed El Amrani
                'rating' => 5,
                'comment' => 'Excellent produit, je le recommande vivement ! Très efficace et doux.',
            ]);

            Review::create([
                'product_id' => $createdProd->id,
                'user_id' => 2,
                'rating' => 4,
                'comment' => 'Très satisfait du résultat après 2 semaines d\'utilisation.',
            ]);
        }

        // 5. Create some Orders
        $order1 = Order::create([
            'user_id' => 2,
            'order_number' => 'CMD'.date('Ymd').'0001',
            'status' => 'completed',
            'total_amount' => 367.00,
            'shipping_address' => '123, Avenue Mohammed V',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
            'phone_number' => '0522123456',
            'payment_method' => 'delivery',
            'payment_status' => 'paid',
            'created_at' => now()->subDays(2),
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 1, // Bioderma Créaline H2O
            'quantity' => 1,
            'price' => 129.00,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 2, // La Roche-Posay Effaclar
            'quantity' => 1,
            'price' => 149.00,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 3, // Avène Eau Thermale
            'quantity' => 1,
            'price' => 89.00,
        ]);

        $order2 = Order::create([
            'user_id' => 2,
            'order_number' => 'CMD'.date('Ymd').'0002',
            'status' => 'pending',
            'total_amount' => 298.00,
            'shipping_address' => '456, Boulevard Zerktouni',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20100',
            'phone_number' => '0661234567',
            'payment_method' => 'delivery',
            'payment_status' => 'pending',
            'created_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => 2, // La Roche-Posay Effaclar
            'quantity' => 2,
            'price' => 149.00,
        ]);

        // 6. Create a demo promotion
        Promotion::create([
            'title' => 'Soldes Soins du Visage',
            'description' => 'Profitez de -20% sur toute la catégorie Soins du visage.',
            'category_id' => $categoryModels['soins-du-visage']->id,
            'discount_percent' => 20,
            'starts_at' => now()->subDays(3),
            'ends_at' => now()->addDays(10),
            'is_active' => true,
        ]);

        // 7. Create a demo banner
        Banner::create([
            'title' => 'Bienvenue chez Pharmacie Ben Moussa Abbes',
            'subtitle' => 'Votre pharmacie en ligne de confiance',
            'image_url' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
            'link_url' => '/products',
            'position' => 0,
            'is_active' => true,
        ]);
    }
}
