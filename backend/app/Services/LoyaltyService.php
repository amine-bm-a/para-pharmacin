<?php

namespace App\Services;

use App\Models\LoyaltyPoint;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * LoyaltyService — Manages all loyalty point transactions.
 *
 * Rates (configurable via config/loyalty.php or constants below):
 *   EARN_RATE  : 1 point earned per MAD spent (rounded down)
 *   REDEEM_RATE: 100 points = 5 MAD discount
 *   REFERRER_BONUS : 200 points awarded to referrer on filleul's 1st order
 *   REFEREE_DISCOUNT_MAD : 15 MAD auto-discount coupon credited to new referee
 */
class LoyaltyService
{
    const EARN_RATE = 1;    // points per MAD spent

    const REDEEM_RATE = 100;  // points per 5 MAD reduction

    const REDEEM_MAD = 5;    // MAD discount per REDEEM_RATE points

    const REFERRER_BONUS = 200;  // bonus points to referrer

    const REFEREE_DISCOUNT = 15;   // MAD discount for referee (encoded as points equiv)

    const POINTS_EXPIRY_DAYS = 365;  // points expire after 1 year

    // ─── Earn ────────────────────────────────────────────────────────────────────

    /**
     * Award loyalty points after a successfully completed order.
     * Called when order status changes to 'delivered'.
     */
    public static function earnPoints(User $user, Order $order): LoyaltyPoint
    {
        $points = (int) floor($order->total_amount * self::EARN_RATE);

        if ($points <= 0) {
            return new LoyaltyPoint; // no-op
        }

        return DB::transaction(function () use ($user, $order, $points) {
            $balanceBefore = $user->loyalty_points;
            $balanceAfter = $balanceBefore + $points;

            $user->update(['loyalty_points' => $balanceAfter]);

            return LoyaltyPoint::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'type' => 'earn',
                'points' => +$points,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => "Points gagnés pour la commande #{$order->order_number}",
                'expires_at' => now()->addDays(self::POINTS_EXPIRY_DAYS),
            ]);
        });
    }

    // ─── Spend ───────────────────────────────────────────────────────────────────

    /**
     * Deduct loyalty points to obtain a discount at checkout.
     * Returns the MAD discount amount.
     *
     * @throws \InvalidArgumentException
     */
    public static function spendPoints(User $user, int $pointsToSpend, Order $order): float
    {
        if ($pointsToSpend <= 0) {
            return 0.0;
        }

        if ($user->loyalty_points < $pointsToSpend) {
            throw new \InvalidArgumentException(
                "Solde insuffisant. Vous avez {$user->loyalty_points} points disponibles."
            );
        }

        // Points must be a multiple of REDEEM_RATE
        $pointsToSpend = (int) (floor($pointsToSpend / self::REDEEM_RATE) * self::REDEEM_RATE);

        if ($pointsToSpend === 0) {
            return 0.0;
        }

        $discountMad = ($pointsToSpend / self::REDEEM_RATE) * self::REDEEM_MAD;

        DB::transaction(function () use ($user, $order, $pointsToSpend, $discountMad) {
            $balanceBefore = $user->loyalty_points;
            $balanceAfter = $balanceBefore - $pointsToSpend;

            $user->update(['loyalty_points' => $balanceAfter]);

            LoyaltyPoint::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'type' => 'spend',
                'points' => -$pointsToSpend,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => "Réduction de {$discountMad} MAD utilisée sur la commande #{$order->order_number}",
                'expires_at' => null,
            ]);
        });

        return $discountMad;
    }

    // ─── Referral ────────────────────────────────────────────────────────────────

    /**
     * Apply the referral bonus when a referee places their first order:
     * - Referrer (parrain) receives REFERRER_BONUS points
     * - Referee (filleul) receives REFEREE_DISCOUNT MAD in points equivalent
     */
    public static function applyReferralBonus(User $referee, Order $refereeOrder): void
    {
        if ($referee->referral_bonus_granted || ! $referee->referred_by) {
            return;
        }

        $referrer = User::find($referee->referred_by);
        if (! $referrer) {
            return;
        }

        DB::transaction(function () use ($referee, $referrer, $refereeOrder) {
            // ── Referrer bonus ───────────────────────────────────────────────
            $refBefore = $referrer->loyalty_points;
            $refAfter = $refBefore + self::REFERRER_BONUS;
            $referrer->update(['loyalty_points' => $refAfter]);

            LoyaltyPoint::create([
                'user_id' => $referrer->id,
                'order_id' => $refereeOrder->id,
                'type' => 'referral',
                'points' => +self::REFERRER_BONUS,
                'balance_before' => $refBefore,
                'balance_after' => $refAfter,
                'description' => "Bonus parrainage : {$referee->name} a passé sa 1ère commande",
                'expires_at' => now()->addDays(self::POINTS_EXPIRY_DAYS),
            ]);

            // ── Referee discount (encoded as earned points = 15 MAD equiv = 300 pts) ──
            // 300 pts at REDEEM_RATE=100 pts/5 MAD = 15 MAD
            $refereePts = self::REFEREE_DISCOUNT * (self::REDEEM_RATE / self::REDEEM_MAD);
            $refeeBefore = $referee->loyalty_points;
            $refeeAfter = $refeeBefore + $refereePts;
            $referee->update([
                'loyalty_points' => $refeeAfter,
                'referral_bonus_granted' => true,
            ]);

            LoyaltyPoint::create([
                'user_id' => $referee->id,
                'order_id' => $refereeOrder->id,
                'type' => 'referral',
                'points' => +(int) $refereePts,
                'balance_before' => $refeeBefore,
                'balance_after' => $refeeAfter,
                'description' => 'Bonus bienvenue parrainage : '.(int) $refereePts.' pts offerts (= '.self::REFEREE_DISCOUNT.' MAD)',
                'expires_at' => now()->addDays(self::POINTS_EXPIRY_DAYS),
            ]);
        });
    }

    // ─── Info helpers ────────────────────────────────────────────────────────────

    /**
     * How much MAD discount the user can get with their current points.
     */
    public static function getDiscountValue(User $user): float
    {
        $redeemable = (int) floor($user->loyalty_points / self::REDEEM_RATE) * self::REDEEM_RATE;

        return ($redeemable / self::REDEEM_RATE) * self::REDEEM_MAD;
    }

    /**
     * How many points are needed to earn the next reward tier.
     */
    public static function getPointsToNextReward(User $user): int
    {
        $remainder = $user->loyalty_points % self::REDEEM_RATE;

        return $remainder === 0 ? self::REDEEM_RATE : (self::REDEEM_RATE - $remainder);
    }
}
