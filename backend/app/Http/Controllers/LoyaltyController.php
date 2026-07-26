<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyPoint;
use App\Services\LoyaltyService;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * GET /loyalty
     * Returns current balance + full transaction history.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $transactions = LoyaltyPoint::forUser($user->id)
            ->with('order:id,order_number')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'balance' => $user->loyalty_points,
            'discount_value_mad' => LoyaltyService::getDiscountValue($user),
            'points_to_next' => LoyaltyService::getPointsToNextReward($user),
            'redeem_rate' => LoyaltyService::REDEEM_RATE,
            'redeem_mad' => LoyaltyService::REDEEM_MAD,
            'transactions' => $transactions,
        ]);
    }

    /**
     * GET /loyalty/info
     * Lightweight endpoint: balance + discount value only (for Checkout).
     */
    public function info(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'balance' => $user->loyalty_points,
            'discount_value_mad' => LoyaltyService::getDiscountValue($user),
            'points_to_next' => LoyaltyService::getPointsToNextReward($user),
            'redeem_rate' => LoyaltyService::REDEEM_RATE,
            'redeem_mad' => LoyaltyService::REDEEM_MAD,
        ]);
    }

    /**
     * GET /referral
     * Returns the user's referral code + list of referred users + total referral earnings.
     */
    public function referral(Request $request)
    {
        $user = $request->user()->load('referrals:id,name,referred_by,created_at');

        $referralEarnings = LoyaltyPoint::forUser($user->id)
            ->where('type', 'referral')
            ->where('points', '>', 0)
            ->sum('points');

        return response()->json([
            'success' => true,
            'referral_code' => $user->referral_code,
            'referral_link' => config('app.frontend_url').'/register?ref='.$user->referral_code,
            'referrals_count' => $user->referrals->count(),
            'referrals' => $user->referrals,
            'total_earned_pts' => (int) $referralEarnings,
        ]);
    }
}
