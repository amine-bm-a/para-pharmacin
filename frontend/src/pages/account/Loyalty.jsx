import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const REDEEM_RATE = 100;
const REDEEM_MAD  = 5;

const typeBadge = {
  earn:     { label: 'Gagné',     color: '#22c55e', bg: '#f0fdf4' },
  spend:    { label: 'Dépensé',   color: '#ef4444', bg: '#fef2f2' },
  referral: { label: 'Parrainage', color: '#8b5cf6', bg: '#f5f3ff' },
  expire:   { label: 'Expiré',    color: '#94a3b8', bg: '#f1f5f9' },
  admin:    { label: 'Admin',     color: '#f59e0b', bg: '#fffbeb' },
};

export default function Loyalty() {
  const [data, setData]         = useState(null);
  const [referral, setReferral] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const [page, setPage]         = useState(1);

  const fetchData = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const [loyaltyRes, referralRes] = await Promise.all([
        axios.get(`/loyalty?page=${p}`),
        axios.get('/referral'),
      ]);
      setData(loyaltyRes.data);
      setReferral(referralRes.data);
    } catch {
      setError('Impossible de charger vos données de fidélité.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  const copyCode = () => {
    if (!referral?.referral_code) return;
    navigator.clipboard.writeText(referral.referral_link || referral.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (error) return <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '40px' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .loyalty-card { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* ── Header ── */}
      <div className="loyalty-card" style={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%)',
        borderRadius: '20px',
        padding: '36px',
        color: 'white',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(76,175,80,0.35)',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '60px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

        <p style={{ margin: '0 0 4px', fontSize: '0.9rem', opacity: 0.85 }}>Solde actuel</p>
        <h1 style={{ margin: '0 0 4px', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1px' }}>
          {(data?.balance ?? 0).toLocaleString('fr-FR')}
          <span style={{ fontSize: '1.4rem', fontWeight: 500, marginLeft: '8px', opacity: 0.85 }}>pts</span>
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: '1rem', opacity: 0.9 }}>
          ≈ <strong>{(data?.discount_value_mad ?? 0).toFixed(2)} MAD</strong> de réduction disponible
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.85, marginBottom: '6px' }}>
            <span>Progression vers la prochaine récompense</span>
            <span>{data?.points_to_next ?? REDEEM_RATE} pts restants</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', height: '10px' }}>
            <div style={{
              width: `${100 - (((data?.points_to_next ?? REDEEM_RATE) / REDEEM_RATE) * 100)}%`,
              background: 'white',
              borderRadius: '99px',
              height: '10px',
              transition: 'width 0.6s ease',
              minWidth: '6px',
            }} />
          </div>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.8rem', opacity: 0.75 }}>
          {REDEEM_RATE} points = {REDEEM_MAD} MAD de réduction
        </p>
      </div>

      {/* ── Referral Card ── */}
      {referral && (
        <div className="loyalty-card" style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          animationDelay: '0.1s',
        }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎁 Parrainage
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            {/* Code box */}
            <div style={{ flex: '1 1 280px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#6b7280' }}>Votre code de parrainage</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '2px dashed #4CAF50',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontFamily: 'monospace',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '4px',
                  color: '#15803d',
                  flex: 1,
                  textAlign: 'center',
                }}>
                  {referral.referral_code}
                </div>
                <button
                  onClick={copyCode}
                  style={{
                    padding: '12px 18px',
                    background: copied ? '#4CAF50' : 'white',
                    color: copied ? 'white' : '#4CAF50',
                    border: '2px solid #4CAF50',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? '✓ Copié !' : '📋 Copier'}
                </button>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                Partagez ce code à vos proches — ils obtiennent une réduction de <strong>15 MAD</strong> sur leur première commande, et vous gagnez <strong>200 points</strong> !
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Filleuls', value: referral.referrals_count, icon: '👥' },
                { label: 'Pts gagnés', value: referral.total_earned_pts + ' pts', icon: '⭐' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  textAlign: 'center',
                  minWidth: '110px',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1f2937' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrals list */}
          {referral.referrals?.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Vos filleuls</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {referral.referrals.map(r => (
                  <div key={r.id} style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '99px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    color: '#15803d',
                    fontWeight: 600,
                  }}>
                    {r.name} — {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Transaction History ── */}
      <div className="loyalty-card" style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        animationDelay: '0.2s',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
            📋 Historique des transactions
          </h2>
        </div>

        {data?.transactions?.data?.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌟</div>
            <p style={{ margin: 0 }}>Vos transactions de points apparaîtront ici.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Date', 'Description', 'Type', 'Points', 'Solde'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Points' || h === 'Solde' ? 'right' : 'left', fontWeight: 700, color: '#374151', fontSize: '0.8rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.transactions?.data?.map((tx, i) => {
                    const badge = typeBadge[tx.type] || typeBadge.earn;
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#374151', maxWidth: '280px' }}>
                          {tx.description}
                          {tx.order && (
                            <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: '#9ca3af' }}>
                              #{tx.order.order_number}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: badge.bg,
                            color: badge.color,
                            borderRadius: '99px',
                            padding: '3px 10px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: tx.points >= 0 ? '#22c55e' : '#ef4444' }}>
                          {tx.points >= 0 ? '+' : ''}{tx.points} pts
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#374151', fontWeight: 500 }}>
                          {tx.balance_after} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.transactions?.last_page > 1 && (
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid #f3f4f6' }}>
                {Array.from({ length: data.transactions.last_page }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: p === page ? '#4CAF50' : '#e5e7eb',
                      background: p === page ? '#4CAF50' : 'white',
                      color: p === page ? 'white' : '#374151',
                      fontWeight: p === page ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
