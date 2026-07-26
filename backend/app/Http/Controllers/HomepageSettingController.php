<?php

namespace App\Http\Controllers;

use App\Models\HomepageSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HomepageSettingController extends Controller
{
    private function getDefaults($key)
    {
        $defaults = [
            'sections' => [
                ['id' => 'hero', 'name' => 'Bannière Héro', 'is_visible' => true],
                ['id' => 'categories', 'name' => 'Catégories circulaires', 'is_visible' => true],
                ['id' => 'promotions', 'name' => 'Promotions avec Compte à Rebours', 'is_visible' => true],
                ['id' => 'featured', 'name' => 'Produits Vedettes', 'is_visible' => true],
                ['id' => 'new_arrivals', 'name' => 'Nouvelles Arrivées', 'is_visible' => true],
                ['id' => 'best_sellers', 'name' => 'Meilleures Ventes', 'is_visible' => true],
                ['id' => 'brands', 'name' => 'Nos Marques Partenaires', 'is_visible' => true],
                ['id' => 'blog', 'name' => 'Conseils Beauté & Santé', 'is_visible' => true],
                ['id' => 'testimonials', 'name' => 'Témoignages clients', 'is_visible' => true],
                ['id' => 'newsletter', 'name' => 'Newsletter Premium', 'is_visible' => true],
            ],
            'theme' => [
                'primary_color' => '#0AA84F',
                'secondary_color' => '#17213C',
                'accent_color' => '#C7A65B',
                'font_family' => 'Poppins',
                'border_radius' => '20px',
            ],
            'contact' => [
                'store_name' => 'Pharmacie Ben Moussa',
                'email' => 'contact@parabenmoussa.ma',
                'phone' => '+212 524-423823',
                'address' => 'Marrakech, Maroc',
                'facebook' => 'https://facebook.com',
                'instagram' => 'https://instagram.com',
                'whatsapp' => 'https://whatsapp.com',
                'free_delivery_min' => '500',
            ],
        ];

        return $defaults[$key] ?? null;
    }

    public function getSetting($key)
    {
        $setting = HomepageSetting::where('key', $key)->first();
        if (! $setting) {
            return response()->json([
                'success' => true,
                'key' => $key,
                'value' => $this->getDefaults($key),
            ]);
        }

        return response()->json([
            'success' => true,
            'key' => $key,
            'value' => $setting->value,
        ]);
    }

    public function getAllSettings()
    {
        $keys = ['sections', 'theme', 'contact'];
        $settings = [];

        foreach ($keys as $key) {
            $setting = HomepageSetting::where('key', $key)->first();
            $settings[$key] = $setting ? $setting->value : $this->getDefaults($key);
        }

        return response()->json([
            'success' => true,
            'settings' => $settings,
        ]);
    }

    public function updateSetting(Request $request, $key)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'required', // Value structure checked contextually or accepts array/object
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $setting = HomepageSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $request->value]
        );

        return response()->json([
            'success' => true,
            'message' => 'Paramètre mis à jour avec succès.',
            'setting' => $setting,
        ]);
    }
}
