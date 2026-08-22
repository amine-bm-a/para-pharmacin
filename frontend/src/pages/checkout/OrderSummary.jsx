import React from 'react';

const OrderSummary = React.memo(function OrderSummary({
  cartItems, loyaltyInfo, useLoyaltyPoints, setUseLoyaltyPoints,
  pointsToSpend, setPointsToSpend,
  subtotal, shipping, loyaltyDiscount, total,
  couponInput, setCouponInput,
  appliedCoupon, couponLoading, couponMsg, handleApplyCoupon, removeCoupon,
  loading, user, error, setError
}) {
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  return (
    <aside style={{ 
      background: 'white',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      height: 'fit-content',
      position: 'sticky',
      top: '24px'
    }}>
      <h3 style={{ 
        fontSize: '1.3rem',
        fontWeight: 800,
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid var(--border-light)',
        color: 'var(--text)'
      }}>Résumé de la commande</h3>
      
      {/* Items Listing */}
      <div style={{ 
        maxHeight: '200px', 
        overflowY: 'auto', 
        marginBottom: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        padding: '4px'
      }}>
        {cartItems.map((item) => (
          <div 
            key={item.product.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }} 
              />
              <div style={{ maxWidth: '140px' }}>
                <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '2px' }}>{item.product.name}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qté: {item.quantity}</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
              {((item.product.discount_price ? parseFloat(item.product.discount_price) : parseFloat(item.product.price)) * item.quantity).toFixed(2)} MAD
            </span>
          </div>
        ))}
      </div>

      {/* ── Loyalty Points ── */}
      {loyaltyInfo && loyaltyInfo.balance > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={useLoyaltyPoints}
              onChange={e => {
                setUseLoyaltyPoints(e.target.checked);
                if (!e.target.checked) setPointsToSpend(0);
                else setPointsToSpend(Math.min(loyaltyInfo.balance, Math.floor(loyaltyInfo.balance / 100) * 100));
              }}
              style={{ width: '17px', height: '17px', accentColor: '#22c55e', flexShrink: 0 }}
            />
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d' }}>
              ⭐ Utiliser mes points de fidélité
              <span style={{ display: 'block', fontWeight: 500, fontSize: '0.78rem', color: '#16a34a', marginTop: '1px' }}>
                Solde : {loyaltyInfo.balance} pts (= {loyaltyInfo.discount_value_mad.toFixed(2)} MAD max)
              </span>
            </span>
          </label>

          {useLoyaltyPoints && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#15803d', marginBottom: '6px' }}>
                <span>{pointsToSpend} pts utilisés</span>
                <span>-{(Math.floor(pointsToSpend / 100) * 5).toFixed(2)} MAD</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.floor(loyaltyInfo.balance / 100) * 100}
                step={100}
                value={pointsToSpend}
                onChange={e => setPointsToSpend(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#22c55e' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>0 pts</span>
                <span>{Math.floor(loyaltyInfo.balance / 100) * 100} pts</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Promo coupon ── */}
      <div style={{
        background: appliedCoupon ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'var(--bg-subtle)',
        border: appliedCoupon ? '1.5px solid #86efac' : '1.5px dashed var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px',
      }}>
        {appliedCoupon ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#15803d' }}>
                🎟️ Code « {appliedCoupon.code} » appliqué
              </span>
              <span style={{ display: 'block', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                Réduction : -{appliedCoupon.discount.toFixed(2)} MAD
              </span>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              style={{
                background: 'white', border: '1.5px solid #86efac', color: '#15803d',
                borderRadius: 'var(--radius-md)', padding: '8px 14px', fontWeight: 700,
                fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              Retirer
            </button>
          </div>
        ) : (
          <>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '8px' }}>
              🎟️ Code promo
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Ex : BIENVENUE10"
                disabled={couponLoading}
                style={{
                  flex: 1, minWidth: 0,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-light)',
                  background: 'white',
                  color: 'var(--text)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                style={{
                  background: couponLoading || !couponInput.trim() ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), #45a049)',
                  color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                  padding: '10px 16px', fontWeight: 700, fontSize: '0.82rem',
                  cursor: couponLoading || !couponInput.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {couponLoading ? '...' : 'Appliquer'}
              </button>
            </div>
          </>
        )}
        {couponMsg && (
          <div style={{
            marginTop: appliedCoupon ? '8px' : '10px',
            fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.4,
            color: couponMsg.startsWith('✅') ? '#15803d' : 'var(--danger)'
          }}>
            {couponMsg}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '16px',
        fontSize: '0.95rem'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Sous-total</span>
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{subtotal.toFixed(2)} MAD</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '16px',
        fontSize: '0.95rem'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Frais de livraison</span>
        <span style={{ 
          fontWeight: 700,
          color: shipping === 0 ? 'var(--primary)' : 'var(--text)',
          fontSize: '1rem'
        }}>
          {shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} MAD`}
        </span>
      </div>

      {loyaltyDiscount > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '0.95rem',
        }}>
          <span style={{ color: '#15803d', fontWeight: 600 }}>⭐ Réduction fidélité</span>
          <span style={{ fontWeight: 700, color: '#15803d', fontSize: '1rem' }}>-{loyaltyDiscount.toFixed(2)} MAD</span>
        </div>
      )}

      {couponDiscount > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '0.95rem',
        }}>
          <span style={{ color: '#15803d', fontWeight: 600 }}>🎟️ Code promo {appliedCoupon?.code}</span>
          <span style={{ fontWeight: 700, color: '#15803d', fontSize: '1rem' }}>-{couponDiscount.toFixed(2)} MAD</span>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        paddingTop: '20px',
        borderTop: '2px solid var(--border)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
        <span style={{ 
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--primary)'
        }}>{total.toFixed(2)} MAD</span>
      </div>

      <button
        type="submit"
        disabled={loading || !user}
        onClick={() => { if (error) setError(''); }}
        style={{ 
          width: '100%', 
          padding: '16px', 
          fontSize: '1.1rem',
          fontWeight: 700,
          borderRadius: 'var(--radius-md)',
          background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), #45a049)',
          border: 'none',
          cursor: loading || !user ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          if (!loading && user) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && user) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
            Traitement en cours...
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            💳 Payer et valider la commande
          </span>
        )}
      </button>

      {/* Error display near submit button */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 14px',
          background: 'var(--danger-light)',
          border: '1.5px solid rgba(220, 53, 69, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger)',
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          lineHeight: 1.4,
        }}>
          <span style={{ flexShrink: 0, fontSize: '1rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Payment Security */}
      <div style={{ 
        marginTop: '24px', 
        borderTop: '1px solid var(--border)', 
        paddingTop: '20px', 
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Paiement 100% sécurisé</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px', 
          fontSize: '1.8rem',
          opacity: 0.8
        }}>
          <span title="Visa">💳</span>
          <span title="Mastercard">💳</span>
          <span title="CMI">💳</span>
          <span title="PayPal">🅿️</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>VISA / Mastercard / CMI / PayPal</p>
      </div>
    </aside>
  );
});

export default OrderSummary;
