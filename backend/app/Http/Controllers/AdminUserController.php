<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminUserController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        return $request->user()->role === 'admin';
    }

    // List all users (clients, staff, admin) with order stats
    public function clients(Request $request)
    {
        if (! $this->ensureAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $currentUserId = $request->user()->id;

        $clients = User::withCount('orders')
            ->withSum('orders', 'total_amount')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($u) use ($currentUserId) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'phone' => $u->phone,
                    'role' => $u->role ?? 'client',
                    'is_current_user' => $u->id === $currentUserId,
                    'orders_count' => $u->orders_count ?? 0,
                    'total_spent' => $u->orders_sum_total_amount ?? 0,
                    'created_at' => $u->created_at ? $u->created_at->format('d/m/Y') : '',
                ];
            });

        return response()->json(['success' => true, 'clients' => $clients]);
    }

    // List staff/admin users
    public function staff(Request $request)
    {
        if (! $this->ensureAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $staff = User::whereIn('role', ['admin', 'pharmacien'])
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'phone', 'role', 'created_at']);

        return response()->json(['success' => true, 'staff' => $staff]);
    }

    public function storeStaff(Request $request)
    {
        if (! $this->ensureAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,pharmacien',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Administrateur ajouté avec succès.',
            'user' => $user,
        ], 201);
    }

    public function updateStaff(Request $request, $id)
    {
        if (! $this->ensureAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $user = User::whereIn('role', ['admin', 'pharmacien'])->find($id);
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'nullable|string|max:30',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:admin,pharmacien',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $updateData = [
            'name' => $request->name,
            'email' => strtolower($request->email),
            'phone' => $request->phone,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Membre du personnel mis à jour avec succès.',
            'user' => $user,
        ]);
    }

    public function deleteStaff(Request $request, $id)
    {
        if (! $this->ensureAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        if ((int) $id === (int) $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        $user = User::whereIn('role', ['admin', 'pharmacien'])->find($id);
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'Administrateur supprimé avec succès.']);
    }
}
