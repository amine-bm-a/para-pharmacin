<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminBannerController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $banners = Banner::orderBy('position')->get();

        return response()->json(['success' => true, 'banners' => $banners]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $banner = Banner::create($validator->validated());

        return response()->json(['success' => true, 'message' => 'Bannière ajoutée avec succès.', 'banner' => $banner], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $banner = Banner::find($id);
        if (! $banner) {
            return response()->json(['success' => false, 'message' => 'Bannière non trouvée.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $banner->update($validator->validated());

        return response()->json(['success' => true, 'message' => 'Bannière mise à jour avec succès.', 'banner' => $banner]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $banner = Banner::find($id);
        if (! $banner) {
            return response()->json(['success' => false, 'message' => 'Bannière non trouvée.'], 404);
        }

        $banner->delete();

        return response()->json(['success' => true, 'message' => 'Bannière supprimée avec succès.']);
    }

    public function publicIndex()
    {
        $banners = Banner::where('is_active', true)->orderBy('position')->get();

        return response()->json(['success' => true, 'banners' => $banners]);
    }
}
