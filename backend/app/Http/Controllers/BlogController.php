<?php

namespace App\Http\Controllers;

use App\Models\BlogArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogArticle::whereNotNull('published_at')
            ->orderBy('published_at', 'desc');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('paginate')) {
            $perPage = min(50, max(1, (int) $request->get('per_page', 12)));
            $articles = $query->paginate($perPage);

            return response()->json(['success' => true, 'articles' => $articles->items(), 'pagination' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ]]);
        }

        $limit = min(100, max(1, (int) $request->get('limit', 50)));
        $articles = $query->limit($limit)->get();

        return response()->json(['success' => true, 'articles' => $articles]);
    }

    public function show($slug)
    {
        $article = BlogArticle::where('slug', $slug)->first();
        if (! $article) {
            return response()->json(['success' => false, 'message' => 'Article non trouvé.'], 404);
        }

        return response()->json(['success' => true, 'article' => $article]);
    }

    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $articles = BlogArticle::orderBy('created_at', 'desc')->get();

        return response()->json(['success' => true, 'articles' => $articles]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'read_time' => 'nullable|integer|min:1',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['title']).'-'.time();
        $data['published_at'] = $request->get('is_published', false) ? now() : null;

        $article = BlogArticle::create($data);

        return response()->json(['success' => true, 'message' => 'Article créé avec succès.', 'article' => $article], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $article = BlogArticle::find($id);
        if (! $article) {
            return response()->json(['success' => false, 'message' => 'Article non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'read_time' => 'nullable|integer|min:1',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['title']).'-'.$article->id;

        if ($request->get('is_published', false)) {
            $data['published_at'] = $article->published_at ?? now();
        } else {
            $data['published_at'] = null;
        }

        $article->update($data);

        return response()->json(['success' => true, 'message' => 'Article mis à jour avec succès.', 'article' => $article]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $article = BlogArticle::find($id);
        if (! $article) {
            return response()->json(['success' => false, 'message' => 'Article non trouvé.'], 404);
        }

        $article->delete();

        return response()->json(['success' => true, 'message' => 'Article supprimé avec succès.']);
    }
}
