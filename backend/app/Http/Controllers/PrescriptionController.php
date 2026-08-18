<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrescriptionController extends Controller
{
    /**
     * Get prescription history for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Fetch direct and order-linked records from prescriptions table
        $prescriptions = Prescription::with(['order', 'product'])
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhereHas('order', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Format records for frontend consumption
        $formatted = $prescriptions->map(function ($p) {
            $statusLabel = match ($p->statut) {
                'approved', 'validated' => 'Validée',
                'rejected' => 'Rejetée',
                default => 'En attente',
            };

            $fileName = $p->file_name ?: basename($p->fichier);

            return [
                'id' => $p->id,
                'fileName' => $fileName,
                'fichier' => $p->fichier,
                'status' => $p->statut,
                'status_label' => $statusLabel,
                'date' => $p->created_at ? $p->created_at->format('d/m/Y H:i') : now()->format('d/m/Y'),
                'doctor' => 'Médecin Prescripteur',
                'comment' => $p->commentaire_pharmacien,
                'order_number' => $p->order ? $p->order->order_number : null,
                'product_name' => $p->product ? $p->product->name : null,
            ];
        });

        // 3. Fallback: Also include orders with prescription_path if not already present
        $ordersWithPresc = Order::where('user_id', $user->id)
            ->whereNotNull('prescription_path')
            ->whereNotIn('id', $prescriptions->pluck('order_id')->filter())
            ->get();

        foreach ($ordersWithPresc as $ord) {
            $statusLabel = match ($ord->prescription_status) {
                'approved', 'validated' => 'Validée',
                'rejected' => 'Rejetée',
                default => 'En attente',
            };

            $formatted->push([
                'id' => 'ORD-'.$ord->id,
                'fileName' => basename($ord->prescription_path),
                'fichier' => $ord->prescription_path,
                'status' => $ord->prescription_status ?: 'pending',
                'status_label' => $statusLabel,
                'date' => $ord->created_at ? $ord->created_at->format('d/m/Y H:i') : now()->format('d/m/Y'),
                'doctor' => 'Commande #'.$ord->order_number,
                'comment' => null,
                'order_number' => $ord->order_number,
                'product_name' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'prescriptions' => $formatted->values(),
        ]);
    }

    /**
     * Upload a new standalone prescription file.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prescription_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier invalide. Veuillez fournir une image ou un PDF de max 10 Mo.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $file = $request->file('prescription_file');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('prescriptions', 'local');

        $prescription = Prescription::create([
            'user_id' => $user->id,
            'fichier' => $path,
            'file_name' => $originalName,
            'statut' => 'pending',
            'date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre ordonnance a bien été soumise et est en cours d\'examen par nos pharmaciens.',
            'prescription' => [
                'id' => $prescription->id,
                'fileName' => $originalName,
                'fichier' => $path,
                'status' => 'pending',
                'status_label' => 'En attente',
                'date' => now()->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * Download or view uploaded prescription file securely.
     */
    public function download(Request $request, $id)
    {
        $user = $request->user();

        // Support string IDs like ORD-123
        if (str_starts_with($id, 'ORD-')) {
            $orderId = substr($id, 4);
            $order = Order::where('user_id', $user->id)->findOrFail($orderId);
            if (! $order->prescription_path || ! Storage::disk('local')->exists($order->prescription_path)) {
                return response()->json(['success' => false, 'message' => 'Fichier non trouvé.'], 404);
            }

            return Storage::disk('local')->response($order->prescription_path, basename($order->prescription_path));
        }

        $prescription = Prescription::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhereHas('order', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
        })->findOrFail($id);

        if (! Storage::disk('local')->exists($prescription->fichier)) {
            return response()->json(['success' => false, 'message' => 'Fichier non trouvé sur le serveur.'], 404);
        }

        $fileName = $prescription->file_name ?: basename($prescription->fichier);

        return Storage::disk('local')->response($prescription->fichier, $fileName);
    }
}
