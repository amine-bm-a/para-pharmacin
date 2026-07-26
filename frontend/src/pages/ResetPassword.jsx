import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect si params manquants
  useEffect(() => {
    if (!token || !email) {
      navigate('/mot-de-passe-oublie', { replace: true });
    }
  }, [token, email, navigate]);

  // Validation mot de passe
  const pwChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
  };
  const pwValid = Object.values(pwChecks).every(Boolean);

  const onFocus = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-transparent)'; };
  const onBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwValid) { setError('Le mot de passe ne respecte pas les critères.'); return; }
    if (password !== passwordConfirmation) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Token invalide ou expiré. Veuillez refaire une demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      background: 'linear-gradient(145deg, #0D1B2A 0%, #17213C 50%, #0AA84F10 100%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', top:'10%', left:'5%', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(10,168,79,0.1)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'5%', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(199,166,91,0.08)', filter:'blur(70px)', pointerEvents:'none' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        background: 'var(--bg-card)',
        borderRadius: '24px',
        padding: '50px 46px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
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
          Nouveau mot de passe
        </h2>
        <p style={{ color:'var(--text-muted)', fontSize:'0.94rem', lineHeight:1.6, marginBottom:'32px' }}>
          Choisissez un mot de passe sécurisé pour votre compte <strong style={{ color:'var(--primary)' }}>{email}</strong>.
        </p>

        {/* ── État succès ── */}
        {success ? (
          <div style={{
            background: 'rgba(10,168,79,0.08)',
            border: '1.5px solid rgba(10,168,79,0.25)',
            borderRadius: '16px', padding: '28px 24px',
            textAlign: 'center', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CheckCircle2 size={28} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text)', margin:0, fontFamily:'var(--font-title)' }}>
              Mot de passe réinitialisé !
            </h3>
            <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', lineHeight:1.6, margin:0 }}>
              Vous allez être redirigé vers la page de connexion dans quelques secondes…
            </p>
            <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--primary)', color:'white', padding:'12px 24px', borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>
              Se connecter maintenant
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Champ mot de passe */}
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontSize:'0.84rem', fontWeight:600, color:'var(--text)', marginBottom:'10px' }}>
                Nouveau mot de passe
              </label>
              <div style={{ position:'relative' }}>
                <Lock size={17} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-light)', pointerEvents:'none', zIndex:2 }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{ width:'100%', padding:'14px 48px 14px 48px', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'14px', color:'var(--text)', fontSize:'0.94rem', outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'var(--font-body)' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-light)', padding:0 }}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Critères de mot de passe */}
              {password.length > 0 && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginTop:'10px' }}>
                  {[
                    { ok: pwChecks.length, label: '8 caractères min.' },
                    { ok: pwChecks.upper, label: '1 majuscule' },
                    { ok: pwChecks.lower, label: '1 minuscule' },
                    { ok: pwChecks.digit, label: '1 chiffre' },
                  ].map(({ ok, label }) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.76rem', color: ok ? 'var(--primary)' : 'var(--text-muted)', fontWeight: ok ? 600 : 400 }}>
                      <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: ok ? 'var(--primary)' : 'var(--border)', flexShrink:0 }} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', fontSize:'0.84rem', fontWeight:600, color:'var(--text)', marginBottom:'10px' }}>
                Confirmer le mot de passe
              </label>
              <div style={{ position:'relative' }}>
                <Lock size={17} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'var(--text-light)', pointerEvents:'none', zIndex:2 }} />
                <input
                  type={showPwConfirm ? 'text' : 'password'}
                  required
                  value={passwordConfirmation}
                  onChange={e => { setPasswordConfirmation(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    width:'100%', padding:'14px 48px 14px 48px', background:'var(--bg)',
                    border: `1.5px solid ${passwordConfirmation && password !== passwordConfirmation ? '#ef4444' : 'var(--border)'}`,
                    borderRadius:'14px', color:'var(--text)', fontSize:'0.94rem',
                    outline:'none', transition:'all 0.2s', boxSizing:'border-box', fontFamily:'var(--font-body)',
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPwConfirm(v => !v)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-light)', padding:0 }}
                >
                  {showPwConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordConfirmation && password !== passwordConfirmation && (
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'6px', color:'#ef4444', fontSize:'0.8rem', fontWeight:600 }}>
                  <AlertCircle size={12} /> Les mots de passe ne correspondent pas
                </div>
              )}
            </div>

            {/* Erreur globale */}
            {error && (
              <div style={{
                display:'flex', alignItems:'flex-start', gap:'10px',
                background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                borderRadius:'12px', padding:'14px 16px', marginBottom:'20px',
              }}>
                <AlertCircle size={16} color='#ef4444' style={{ flexShrink:0, marginTop:'1px' }} />
                <span style={{ fontSize:'0.88rem', color:'#ef4444', lineHeight:1.5 }}>{error}</span>
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading || !pwValid}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: loading || !pwValid ? 'rgba(10,168,79,0.4)' : 'linear-gradient(135deg, #0AA84F, #088C41)',
                color: 'white', padding: '15px',
                borderRadius: '14px', fontWeight: 700, border: 'none',
                cursor: loading || !pwValid ? 'not-allowed' : 'pointer',
                fontSize: '0.96rem', transition: 'all 0.3s ease',
                boxShadow: !loading && pwValid ? '0 4px 20px rgba(10,168,79,0.3)' : 'none',
                fontFamily: 'var(--font-title)',
              }}
              onMouseEnter={e => { if (!loading && pwValid) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(10,168,79,0.4)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = pwValid ? '0 4px 20px rgba(10,168,79,0.3)' : 'none'; }}
            >
              {loading
                ? <><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> Réinitialisation…</>
                : <><CheckCircle2 size={18} /> Réinitialiser mon mot de passe</>
              }
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>
        )}
      </div>
    </div>
  );
}
