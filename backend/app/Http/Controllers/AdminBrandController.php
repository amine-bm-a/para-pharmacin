<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminBrandController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $brands = Brand::withCount('products')->orderBy('name')->get();

        return response()->json(['success' => true, 'brands' => $brands]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
            'logo_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.rand(100, 999),
            'logo_url' => $request->logo_url,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'message' => 'Marque ajoutée avec succès.', 'brand' => $brand], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $brand = Brand::find($id);
        if (! $brand) {
            return response()->json(['success' => false, 'message' => 'Marque non trouvée.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,'.$brand->id,
            'logo_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $brand->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.$brand->id,
            'logo_url' => $request->logo_url,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'message' => 'Marque mise à jour avec succès.', 'brand' => $brand]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $brand = Brand::find($id);
        if (! $brand) {
            return response()->json(['success' => false, 'message' => 'Marque non trouvée.'], 404);
        }

        $productsCount = Product::where('brand_id', $id)->count();
        if ($productsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer : {$productsCount} produit(s) appartiennent encore à cette marque.",
            ], 422);
        }

        $brand->delete();

        return response()->json(['success' => true, 'message' => 'Marque supprimée avec succès.']);
    }
}
