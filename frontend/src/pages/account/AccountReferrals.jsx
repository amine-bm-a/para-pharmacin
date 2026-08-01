import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Copy, Check, Share2, Users, Gift, Sparkles, Award } from 'lucide-react';

export default function AccountReferrals() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/referral');
        if (res.data.success) {
          setData(res.data);
        }
      } catch {
        setError('Impossible de charger vos informations de parrainage.');
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, []);

  const copyReferralLink = () => {
    if (!data?.referral_link && !data?.referral_code) return;
    const link = data.referral_link || `${window.location.origin}/register?ref=${data.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    if (!data?.referral_code) return;
    const link = data.referral_link || `${window.location.origin}/register?ref=${data.referral_code}`;
    const text = encodeURIComponent(
      `🎁 Utilise mon code parrain ${data.referral_code} sur Para Ben Moussa et bénéficie de 15 MAD de réduction sur ta 1ère commande !\n👉 ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #E8F5E9', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '30px' }}>{error}</p>;
  }

  const referralCode = data?.referral_code || 'PROMO2026';
  const referralLink = data?.referral_link || `${window.location.origin}/register?ref=${referralCode}`;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
        borderRadius: '24px',
        padding: '36px',
        color: 'white',
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(46, 125, 50, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
            <Sparkles size={16} /> Programme de Parrainage Officiel
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 10px 0' }}>Invitez vos proches, gagnez ensemble !</h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
            Offrez <strong>15 MAD de réduction</strong> à vos amis sur leur 1ère commande et recevez <strong>200 points de fidélité</strong> (= 10 MAD) directement sur votre compte dès leur premier achat.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Amis Parrainés</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)' }}>{data?.referrals_count || 0}</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#F3E5F5', color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <Gift size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Points Gagnés</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7B1FA2' }}>{data?.total_earned_pts || 0} pts</div>
          </div>
        </div>
      </div>

      {/* Link Generator & Copy Card */}
      <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>Votre code & lien de parrainage</h2>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '260px', background: 'var(--bg-subtle)', border: '2px dashed var(--primary)', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '1px' }}>{referralCode}</span>
            <span style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>Code unique</span>
          </div>

          <button
            onClick={copyReferralLink}
            style={{
              padding: '12px 24px',
              background: copied ? '#2E7D32' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copié !' : 'Copier le lien'}
          </button>

          <button
            onClick={shareWhatsApp}
            style={{
              padding: '12px 20px',
              background: '#25D366',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Share2 size={18} /> WhatsApp
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Lien complet : <code style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', wordBreak: 'break-all' }}>{referralLink}</code>
        </div>
      </div>

      {/* Referred Users List */}
      <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '20px' }}>Vos filleuls ({data?.referrals?.length || 0})</h2>

        {data?.referrals && data.referrals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.referrals.map((friend) => (
              <div key={friend.id} style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{friend.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Inscrit le {new Date(friend.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', background: '#E8F5E9', color: '#2E7D32', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>✓ Filleul actif</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
            <Users size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Vous n'avez pas encore parrainé d'amis. Partagez votre code ci-dessus pour commencer !</p>
          </div>
        )}
      </div>
    </div>
  );
}
