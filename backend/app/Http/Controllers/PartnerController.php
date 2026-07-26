<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::orderBy('position')->get();
        return response()->json(['success' => true, 'partners' => $partners]);
    }

    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $partners = Partner::orderBy('position')->get();
        return response()->json(['success' => true, 'partners' => $partners]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo_url' => 'required|string',
            'position' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $partner = Partner::create($validator->validated());

        return response()->json(['success' => true, 'message' => 'Partenaire ajouté avec succès.', 'partner' => $partner], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $partner = Partner::find($id);
        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partenaire non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo_url' => 'required|string',
            'position' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $partner->update($validator->validated());

        return response()->json(['success' => true, 'message' => 'Partenaire mis à jour avec succès.', 'partner' => $partner]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $partner = Partner::find($id);
        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partenaire non trouvé.'], 404);
        }

        $partner->delete();

        return response()->json(['success' => true, 'message' => 'Partenaire supprimé avec succès.']);
    }
}
