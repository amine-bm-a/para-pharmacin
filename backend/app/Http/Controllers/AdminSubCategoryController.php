<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminSubCategoryController extends Controller
{
    public function index()
    {
        $subs = SubCategory::with('category')->orderBy('name')->get();

        return response()->json(['success' => true, 'data' => $subs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:100',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $sub = SubCategory::create($validated);

        return response()->json(['success' => true, 'data' => $sub->load('category')], 201);
    }

    public function update(Request $request, $id)
    {
        $sub = SubCategory::findOrFail($id);
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:100',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $sub->update($validated);

        return response()->json(['success' => true, 'data' => $sub->load('category')]);
    }

    public function destroy($id)
    {
        SubCategory::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Sous-catégorie supprimée.']);
    }
}
