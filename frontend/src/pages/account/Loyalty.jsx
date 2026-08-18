import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

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
    const link = referral.referral_link || `${window.location.origin}/register?ref=${referral.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!referral?.referral_code) return;
    const link = referral.referral_link || `${window.location.origin}/register?ref=${referral.referral_code}`;
    const text = encodeURIComponent(
      `🎁 Profite de mon code parrain ${referral.referral_code} sur Pharmacie Ben Moussa et bénéficie d'une réduction exclusive sur tes achats !\n👉 ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (error) return <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '40px' }}>{error}</p>;

  const tierInfo = data?.tier_info || {};
  const currentTier = tierInfo.current_tier || { name: 'Bronze 🥉', discount_percent: 0, bg: 'linear-gradient(135deg, #a77044, #cd7f32)', color: '#cd7f32' };
  const nextTier = tierInfo.next_tier;
  const allTiers = tierInfo.all_tiers || {};

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .loyalty-card { animation: fadeUp 0.4s ease both; }
        .tier-card-active { ring: 3px solid #2E7D5B; transform: translateY(-4px); }
      `}</style>

      {/* ── Dynamic Tier & Loyalty Header ── */}
      <div className="loyalty-card" style={{
        background: currentTier.bg || 'linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%)',
        borderRadius: '24px',
        padding: '36px',
        color: 'white',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px',
              fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              Niveau Actuel : {currentTier.name}
            </div>
            <h1 style={{ margin: '12px 0 4px', fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-1px' }}>
              {(data?.balance ?? 0).toLocaleString('fr-FR')}
              <span style={{ fontSize: '1.4rem', fontWeight: 500, marginLeft: '8px', opacity: 0.85 }}>pts</span>
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', opacity: 0.95 }}>
              ≈ <strong>{(data?.discount_value_mad ?? 0).toFixed(2)} MAD</strong> de remise en points + <strong>{currentTier.discount_percent}% de réduction automatique</strong> sur vos achats !
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.18)', borderRadius: '18px', padding: '16px 24px',
            backdropFilter: 'blur(10px)', textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block' }}>Réduction statut VIP</span>
            <span style={{ fontSize: '2rem', fontWeight: 900 }}>-{currentTier.discount_percent}%</span>
          </div>
        </div>

        {/* Progress bar to Next Tier */}
        {nextTier ? (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>
              <span>Progression vers {nextTier.name} ({nextTier.discount_percent}% de réduction)</span>
              <span>
                {tierInfo.pts_needed > 0 ? `${tierInfo.pts_needed} pts` : ''} 
                {tierInfo.pts_needed > 0 && tierInfo.ref_needed > 0 ? ' ou ' : ''}
                {tierInfo.ref_needed > 0 ? `${tierInfo.ref_needed} filleul(s)` : ''} restants
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', height: '12px' }}>
              <div style={{
                width: `${tierInfo.progress_percent || 0}%`,
                background: 'white',
                borderRadius: '99px',
                height: '12px',
                transition: 'width 0.6s ease',
                minWidth: '10px',
              }} />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '16px', fontSize: '0.9rem', opacity: 0.9 }}>
            👑 Félicitations ! Vous avez atteint le statut maximal **Diamant VIP** ({currentTier.discount_percent}% de réduction).
          </div>
        )}
      </div>

      {/* ── Showcase Tier Levels (Bronze -> Diamant) ── */}
      <div className="loyalty-card" style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)' }}>
            Niveaux de Fidélité & Avantages
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Cumulez des points par vos achats ou parrainez de nouveaux amis avec votre code pour débloquer jusqu'à <strong>12% de réduction automatique</strong> !
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px'
        }}>
          {Object.entries(allTiers).map(([key, tier]) => {
            const isCurrent = currentTier.key === key;
            return (
              <div
                key={key}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: isCurrent ? `2px solid ${tier.color}` : '1px solid var(--border-light)',
                  padding: '20px 16px',
                  boxShadow: isCurrent ? `0 6px 20px ${tier.color}33` : '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: isCurrent ? 'scale(1.02)' : 'none',
                }}
              >
                {isCurrent && (
                  <span style={{
                    position: 'absolute', top: '-10px', right: '12px',
                    background: tier.color, color: 'white', fontSize: '0.68rem',
                    fontWeight: 800, padding: '2px 8px', borderRadius: '99px'
                  }}>
                    ACTUEL
                  </span>
                )}
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: tier.color, marginBottom: '4px' }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', marginBottom: '8px' }}>
                  -{tier.discount_percent}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {tier.min_points === 0 ? 'Statut de départ' : `${tier.min_points} pts OU ${tier.min_referrals} filleuls`}
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} style={{ fontSize: '0.72rem', color: 'var(--text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ✓ {perk}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Referral Card ── */}
      {referral && (
        <div className="loyalty-card" style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎁 Parrainage & Progression Rapide
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Votre code de parrainage unique</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '2px dashed var(--primary)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontFamily: 'monospace',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '3px',
                  color: 'var(--primary)',
                  flex: 1,
                  textAlign: 'center',
                }}>
                  {referral.referral_code}
                </div>
                <button
                  onClick={copyCode}
                  style={{
                    padding: '12px 18px',
                    background: copied ? 'var(--primary)' : 'white',
                    color: copied ? 'white' : 'var(--primary)',
                    border: '2px solid var(--primary)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {copied ? '✓ Copié !' : '📋 Copier'}
                </button>
                <button
                  onClick={shareWhatsApp}
                  style={{
                    padding: '12px 18px',
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  📲 WhatsApp
                </button>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Partagez ce code à vos proches — ils obtiennent <strong>15 MAD de réduction</strong> sur leur 1ère commande, et vous débloquez <strong>200 points + l'accès immédiat au niveau supérieur</strong> !
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: 'Filleuls Actifs', value: referral.referrals_count, icon: '👥' },
                { label: 'Points Gagnés', value: referral.total_earned_pts + ' pts', icon: '⭐' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  textAlign: 'center',
                  minWidth: '120px',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '2px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrals list */}
          {referral.referrals?.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vos filleuls inscrits</p>
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
        borderRadius: '20px',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
            📋 Historique des transactions de points
          </h2>
        </div>

        {data?.transactions?.data?.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌟</div>
            <p style={{ margin: 0 }}>Vos transactions de points apparaîtront ici.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)' }}>
                    {['Date', 'Description', 'Type', 'Points', 'Solde'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Points' || h === 'Solde' ? 'right' : 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.8rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.transactions?.data?.map((tx, i) => {
                    const badge = typeBadge[tx.type] || typeBadge.earn;
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'white' : 'var(--bg-subtle)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text)', maxWidth: '280px' }}>
                          {tx.description}
                          {tx.order && (
                            <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontWeight: 500 }}>
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
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid var(--border-light)' }}>
                {Array.from({ length: data.transactions.last_page }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: p === page ? 'var(--primary)' : 'var(--border)',
                      background: p === page ? 'var(--primary)' : 'white',
                      color: p === page ? 'white' : 'var(--text)',
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
