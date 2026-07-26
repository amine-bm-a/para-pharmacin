<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $reviews = Review::with(['product:id,name,image_url', 'user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'reviews' => $reviews]);
    }

    public function approve(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Avis non trouvé.'], 404);
        }

        $review->update(['status' => 'approved']);

        return response()->json(['success' => true, 'message' => 'Avis approuvé avec succès.', 'review' => $review]);
    }

    public function reject(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Avis non trouvé.'], 404);
        }

        $review->update(['status' => 'rejected']);

        return response()->json(['success' => true, 'message' => 'Avis rejeté avec succès.', 'review' => $review]);
    }

    public function reply(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Avis non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'admin_reply' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $review->update(['admin_reply' => $request->admin_reply]);

        return response()->json(['success' => true, 'message' => 'Réponse ajoutée avec succès.', 'review' => $review]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Avis non trouvé.'], 404);
        }

        $review->delete();

        return response()->json(['success' => true, 'message' => 'Avis supprimé avec succès.']);
    }
}
