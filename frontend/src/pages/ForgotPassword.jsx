import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
        if (res.data.dev_reset_link) {
          setDevLink(res.data.dev_reset_link);
        }
      } else {
        setError(res.data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const onFocus = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-transparent)'; };
  const onBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        background: 'linear-gradient(145deg, #0D1B2A 0%, #17213C 50%, #0AA84F10 100%)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background blobs */}
        <div style={{ position:'absolute', top:'10%', left:'5%', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(10,168,79,0.1)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'5%', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(199,166,91,0.08)', filter:'blur(70px)', pointerEvents:'none' }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '50px 46px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)'
        }}>
          {/* Back link */}
          <Link
            to="/login"
            style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', textDecoration:'none', marginBottom:'32px', fontSize:'0.85rem', fontWeight:600, transition:'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={15} /> Retour à la connexion
          </Link>

          {/* Icon */}
          <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
            <KeyRound size={28} color="var(--primary)" />
          </div>

          <h2 style={{ fontSize:'1.85rem', fontWeight:700, fontFamily:'var(--font-title)', color:'var(--text)', marginBottom:'8px' }}>
            Mot de passe oublié
          </h2>
          <p style={{ color:'var(--text-muted)', fontSize:'0.94rem', lineHeight:1.6, marginBottom:'32px' }}>
            Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          {sent ? (
            <div style={{
              background: 'rgba(10,168,79,0.08)',
              border: '1.5px solid rgba(10,168,79,0.25)',
              borderRadius: '16px',
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'4px' }}>
                <CheckCircle2 size={28} color="var(--primary)" />
              </div>
              <h3 style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text)', margin:0, fontFamily:'var(--font-title)' }}>Email envoyé avec succès !</h3>
              <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.6, margin:0 }}>
                Vérifiez votre boîte de réception à <strong style={{ color:'var(--primary)' }}>{email}</strong>.<br />
                Le lien sera valable 60 minutes.
              </p>

              {/* Lien de dev (uniquement visible si APP_DEBUG=true) */}
              {devLink && (
                <div style={{
                  width: '100%',
                  background: 'rgba(199,166,91,0.08)',
                  border: '1px dashed rgba(199,166,91,0.4)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  marginTop: '8px',
                }}>
                  <p style={{ margin:'0 0 6px', fontSize:'0.75rem', fontWeight:700, color:'#b45309', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    🛠️ Mode développement — Lien de reset :
                  </p>
                  <a
                    href={devLink}
                    style={{ fontSize:'0.78rem', color:'var(--primary)', wordBreak:'break-all', textDecoration:'underline' }}
                  >
                    {devLink}
                  </a>
                  <p style={{ margin:'6px 0 0', fontSize:'0.72rem', color:'var(--text-light)' }}>
                    Ce lien n'est visible qu'en mode DEBUG. Configurez SMTP pour la production.
                  </p>
                </div>
              )}

              <Link to="/login" style={{ marginTop:'8px', display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--primary)', color:'white', padding:'12px 24px', borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', transition:'all 0.2s' }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'0.84rem', fontWeight:600, color:'var(--text)', marginBottom:'10px' }}>
                  Adresse Email
                </label>
                <div style={{ position:'relative' }}>
                  <Mail size={17} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-light)', pointerEvents:'none', zIndex:2 }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="exemple@email.com"
                    disabled={loading}
                    style={{ width:'100%', padding:'14px 16px 14px 48px', background:'var(--bg)', border:`1.5px solid ${error ? '#ef4444' : 'var(--border)'}`, borderRadius:'14px', color:'var(--text)', fontSize:'0.94rem', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'var(--font-body)', opacity: loading ? 0.7 : 1 }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                {/* Message d'erreur */}
                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'8px', color:'#ef4444', fontSize:'0.82rem', fontWeight:600 }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: loading ? 'rgba(10,168,79,0.6)' : 'linear-gradient(135deg, #0AA84F, #088C41)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.96rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(10,168,79,0.3)',
                  fontFamily: 'var(--font-title)'
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(10,168,79,0.4)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(10,168,79,0.3)'; }}
              >
                {loading ? <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> : <Send size={18} />}
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>
          )}

          {/* Return to homepage */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-light)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = 'var(--primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
            >
              <ArrowLeft size={14} /> Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
