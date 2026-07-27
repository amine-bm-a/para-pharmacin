<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|regex:/^[\p{L}\s\-]+$/u',
            'email' => 'required|string|email:rfc,dns|max:255|unique:users',
            'phone' => 'nullable|string|max:20|regex:/^\+?[0-9\s\-]+$/',
            'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            'referral_code' => 'nullable|string|size:8|exists:users,referral_code',
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.',
            'referral_code.exists' => 'Ce code de parrainage est invalide.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Generate a unique 8-character referral code
        do {
            $newReferralCode = strtoupper(Str::random(8));
        } while (User::where('referral_code', $newReferralCode)->exists());

        // Resolve referrer if a referral code was provided
        $referredBy = null;
        if ($request->filled('referral_code')) {
            $referrer = User::where('referral_code', $request->referral_code)->first();
            $referredBy = $referrer?->id;
        }

        $user = User::create([
            'name' => strip_tags($request->name),
            'email' => strtolower($request->email),
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'referral_code' => $newReferralCode,
            'referred_by' => $referredBy,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Notify all admins and staff about the new client registration
        NotificationService::notifyAdminsAndStaff(
            '🆕 Nouveau client inscrit',
            "Le client **{$user->name}** ({$user->email}) vient de créer un compte.",
            'client',
            '/admin/clients'
        );

        return response()->json([
            'success' => true,
            'message' => 'Compte créé avec succès.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->userResource($user),
        ], 201);
    }

    public function login(Request $request)
    {
        // Rate limiting by IP + email
        $key = 'login:'.Str::lower($request->input('email', '')).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'success' => false,
                'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes.",
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 300); // Block for 5 minutes after 5 failures

            return response()->json(['success' => false, 'message' => 'Identifiants incorrects.'], 401);
        }

        // Check if account is active
        if ($user->is_banned ?? false) {
            return response()->json(['success' => false, 'message' => 'Votre compte a été suspendu.'], 403);
        }

        RateLimiter::clear($key);

        // Revoke old tokens to prevent session hijacking
        $user->tokens()->where('name', 'auth_token')->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        // ── 2FA pour les comptes admin ou clients ayant activé l'option ──────
        if ($user->role === 'admin' || $user->two_factor_enabled) {
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $expiry = config('app.two_factor_expiry_minutes', (int) env('TWO_FACTOR_EXPIRY_MINUTES', 10));
            $user->update([
                'two_factor_code' => $code,
                'two_factor_expires_at' => now()->addMinutes($expiry),
            ]);

            try {
                Mail::raw(
                    "Bonjour {$user->name},\n\nVotre code de vérification (2FA) est : {$code}\n\nIl expirera dans {$expiry} minutes.\n\n— Para Ben Moussa",
                    fn ($m) => $m->to($user->email)->subject('Code de vérification — Para Ben Moussa')
                );
            } catch (\Exception $e) {
                Log::warning('2FA mail failed: '.$e->getMessage());
            }

            $response = [
                'success' => true,
                'requires_2fa' => true,
                'message' => 'Un code de vérification a été envoyé à votre adresse email.',
                'email' => $user->email,
            ];

            if (config('app.debug')) {
                $response['dev_2fa_code'] = $code;
                $response['dev_note'] = 'Code visible uniquement en APP_DEBUG=true.';
            }

            return response()->json($response);
        }

        // ── Connexion normale (client / pharmacien) ──────────────────────────
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->userResource($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true, 'message' => 'Déconnexion réussie.']);
    }

    /**
     * Valider le code OTP envoyé par email (2FA admin).
     */
    public function verify2fa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ($user->role !== 'admin' && ! $user->two_factor_enabled)) {
            return response()->json(['success' => false, 'message' => 'Code invalide ou expiré.'], 401);
        }

        if (
            ! $user->two_factor_code ||
            ! hash_equals((string) $user->two_factor_code, (string) $request->code) ||
            ! $user->two_factor_expires_at ||
            now()->isAfter($user->two_factor_expires_at)
        ) {
            return response()->json(['success' => false, 'message' => 'Code invalide ou expiré.'], 401);
        }

        // Code valide — effacer et émettre le token
        $user->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
        ]);

        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->userResource($user),
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json(['success' => true, 'user' => $this->userResource($request->user())]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|regex:/^[\p{L}\s\-]+$/u',
            'email' => 'required|string|email:rfc|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'health_profile' => 'nullable|array',
            'two_factor_enabled' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user->update([
            'name' => strip_tags($request->name),
            'email' => strtolower($request->email),
            'phone' => $request->phone,
            'health_profile' => $request->health_profile,
            'two_factor_enabled' => $request->has('two_factor_enabled') ? (bool) $request->two_factor_enabled : $user->two_factor_enabled,
        ]);

        return response()->json(['success' => true, 'message' => 'Profil mis à jour.', 'user' => $this->userResource($user)]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
        ], [
            'new_password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        // Revoke all other tokens for security
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json(['success' => true, 'message' => 'Mot de passe modifié avec succès.']);
    }

    /**
     * Envoyer un lien de réinitialisation de mot de passe.
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        // Vérifier si l'email existe (sans révéler l'existence pour la sécurité)
        $user = User::where('email', strtolower($request->email))->first();

        if (! $user) {
            // Réponse générique pour éviter l'énumération d'emails
            return response()->json([
                'success' => true,
                'message' => 'Si cet email existe, vous recevrez un lien de réinitialisation.',
            ]);
        }

        // Générer un token unique
        $token = Str::random(64);

        // Stocker le token dans la table password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => strtolower($request->email)],
            [
                'email' => strtolower($request->email),
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Envoyer le mail (va dans les logs si MAIL_MAILER=log)
        $resetLink = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'))
            .'/reset-password?token='.$token
            .'&email='.urlencode(strtolower($request->email));

        try {
            Mail::raw(
                "Bonjour {$user->name},\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n{$resetLink}\n\nCe lien expire dans 60 minutes.\n\n— Para Ben Moussa",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Réinitialisation de votre mot de passe — Para Ben Moussa');
                }
            );
        } catch (\Exception $e) {
            Log::error('Mail reset failed: '.$e->getMessage());
        }

        $response = [
            'success' => true,
            'message' => 'Si cet email existe, vous recevrez un lien de réinitialisation.',
        ];

        // En mode développement, retourner le lien directement
        if (config('app.debug')) {
            $response['dev_reset_link'] = $resetLink;
            $response['dev_note'] = 'Ce champ est visible uniquement en mode DEBUG. Configurez SMTP pour la production.';
        }

        return response()->json($response);
    }

    /**
     * Réinitialiser le mot de passe avec le token.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
        ], [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors(), 'message' => $validator->errors()->first()], 422);
        }

        // Récupérer l'entrée de reset
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', strtolower($request->email))
            ->first();

        if (! $resetRecord) {
            return response()->json(['success' => false, 'message' => 'Token invalide ou expiré.'], 422);
        }

        // Vérifier le token
        if (! Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['success' => false, 'message' => 'Token invalide ou expiré.'], 422);
        }

        // Vérifier l'expiration (60 minutes)
        if (now()->diffInMinutes($resetRecord->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', strtolower($request->email))->delete();

            return response()->json(['success' => false, 'message' => 'Ce lien a expiré. Veuillez en demander un nouveau.'], 422);
        }

        // Mettre à jour le mot de passe
        $user = User::where('email', strtolower($request->email))->first();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);

        // Révoquer tous les tokens (déconnecter toutes les sessions)
        $user->tokens()->delete();

        // Supprimer le token de reset utilisé
        DB::table('password_reset_tokens')->where('email', strtolower($request->email))->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        ]);
    }

    public function exportData(Request $request)
    {
        $user = $request->user()->load([
            'orders.items.product',
            'loyaltyPoints',
            'subscriptions.items.product',
        ]);

        $data = [
            'personal_info' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'loyalty_balance' => $user->loyalty_points ?? 0,
                'health_profile' => $user->health_profile,
                'referral_code' => $user->referral_code,
                'created_at' => $user->created_at->toIso8601String(),
            ],
            'orders' => $user->orders->map(function ($order) {
                return [
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status,
                    'total_amount' => $order->total_amount,
                    'shipping_address' => $order->shipping_address,
                    'shipping_city' => $order->shipping_city,
                    'created_at' => $order->created_at->toIso8601String(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product?->name ?? 'Produit inconnu',
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                        ];
                    }),
                ];
            }),
            'loyalty_transactions' => $user->loyaltyPoints->map(function ($tx) {
                return [
                    'points' => $tx->points,
                    'type' => $tx->type,
                    'description' => $tx->description,
                    'created_at' => $tx->created_at->toIso8601String(),
                ];
            }),
            'subscriptions' => $user->subscriptions->map(function ($sub) {
                return [
                    'status' => $sub->status,
                    'frequency' => $sub->frequency,
                    'next_renewal_at' => $sub->next_renewal_at?->toIso8601String(),
                    'created_at' => $sub->created_at->toIso8601String(),
                    'items' => $sub->items->map(function ($item) {
                        return [
                            'product_name' => $item->product?->name ?? 'Produit inconnu',
                            'quantity' => $item->quantity,
                        ];
                    }),
                ];
            }),
        ];

        return response()->json($data)
            ->header('Content-Disposition', 'attachment; filename="data-export-'.$user->id.'.json"');
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->orders()->delete();
            $user->loyaltyPoints()->delete();
            $user->subscriptions()->delete();
            $user->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Votre compte a été supprimé avec succès.',
        ]);
    }

    private function userResource(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'loyalty_points' => $user->loyalty_points ?? 0,
            'health_profile' => $user->health_profile,
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ];
    }
}
