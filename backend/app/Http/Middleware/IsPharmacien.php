<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsPharmacien
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user || ! in_array($user->role, ['pharmacien', 'admin', 'employe'])) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Cette action est réservée aux pharmaciens ou administrateurs.',
            ], 403);
        }

        return $next($request);
    }
}
