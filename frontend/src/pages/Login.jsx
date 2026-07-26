import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Loader2, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

import logo from '../assets/logo.png';

export default function Login() {
  const { login, loginWith2fa, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const isAdminLogin = redirect === 'admin';
  const redirectPath = isAdminLogin
    ? '/admin'
    : redirect === 'checkout'
      ? '/checkout'
      : redirect === 'pharmacien'
        ? '/pharmacien'
        : (!redirect || redirect === '/')
          ? '/mon-compte'
          : redirect;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── 2FA state ──────────────────────────────────────────────────────────
  const [requires2fa, setRequires2fa] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [devCode, setDevCode] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => { if (user) navigate(redirectPath); }, [user, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await login(email, password);
    setLoading(false);
    if (!res) return;
    if (res.requires_2fa) {
      setRequires2fa(true);
      setOtpEmail(res.email);
      if (res.dev_2fa_code) setDevCode(res.dev_2fa_code);
    } else if (res.success) {
      navigate(redirectPath);
    } else {
      setError(res.message);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otpCode];
    next[idx] = val;
    setOtpCode(next);
    if (val && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) otpRefs[idx - 1].current?.focus();
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length !== 6) { setError('Entrez le code à 6 chiffres.'); return; }
    setLoading(true); setError('');
    const res = await loginWith2fa(otpEmail, code);
    setLoading(false);
    if (res?.success) navigate(redirectPath);
    else setError(res?.message || 'Code invalide.');
  };

  const onFocus = e => { e.target.style.borderColor = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.08)'; };
  const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; };

  return (
    <>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        position: 'relative',
        overflow: 'hidden',
        /* Deep emerald → navy gradient background */
        background: 'linear-gradient(135deg, #062a18 0%, #0f2a3a 45%, #17213C 100%)',
      }}>

        {/* ── Giant logo watermark (background) ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            style={{
              width: '520px',
              maxWidth: '75vw',
              opacity: 0.06,
              filter: 'brightness(2) saturate(0)',
              userSelect: 'none',
            }}
          />
        </div>

        {/* ── Soft glow orbs ── */}
        <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'360px', height:'360px', borderRadius:'50%', background:'rgba(10,168,79,0.18)', filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(199,166,91,0.12)', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />

        {/* ── Glass card ── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          margin: '20px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: '28px',
          padding: '44px 40px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        }}>

          {/* Back link */}
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0AA84F'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={logo} alt="Para Ben Moussa" style={{ height: '60px', width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }} />
            </Link>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'white', textAlign: 'center', marginBottom: '6px' }}>
            {isAdminLogin ? 'Espace Administrateur' : 'Bon retour !'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '30px', lineHeight: 1.5 }}>
            {isAdminLogin ? 'Connectez-vous au tableau de bord' : 'Connectez-vous à votre compte'}
          </p>

          {/* Error */}
          {(error || authError) && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.3)', color: '#ff8080', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} /> {error || authError}
            </div>
          )}

          {/* ── 2FA OTP Step ── */}
          {requires2fa ? (
            <form onSubmit={handleVerify2fa}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(10,168,79,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <KeyRound size={24} color="#0AA84F" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  Code envoyé à <strong style={{ color: 'white' }}>{otpEmail}</strong>.<br />
                  Valable 10 minutes.
                </p>
                {devCode && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(199,166,91,0.08)', border: '1px dashed rgba(199,166,91,0.3)', borderRadius: '10px', fontSize: '0.8rem', color: '#c7a65b', textAlign: 'left' }}>
                    🛠️ <strong>Dev mode</strong> — Code OTP : <code style={{ fontSize: '1.1rem', letterSpacing: '4px', fontWeight: 700 }}>{devCode}</code>
                  </div>
                )}
              </div>

              {/* 6 digit inputs */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    style={{
                      width: '46px', height: '52px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
                      background: 'rgba(255,255,255,0.07)', border: `2px solid ${digit ? '#0AA84F' : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '12px', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-title)'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0AA84F'; e.target.style.boxShadow = '0 0 0 3px rgba(10,168,79,0.2)'; }}
                    onBlur={e => { e.target.style.borderColor = digit ? '#0AA84F' : 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.join('').length !== 6}
                style={{
                  width: '100%', padding: '15px', borderRadius: '14px',
                  background: (loading || otpCode.join('').length !== 6) ? 'rgba(10,168,79,0.3)' : 'linear-gradient(135deg, #0AA84F, #088C41)',
                  color: 'white', border: 'none',
                  cursor: (loading || otpCode.join('').length !== 6) ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-title)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 4px 24px rgba(10,168,79,0.3)', marginBottom: '16px'
                }}
              >
                {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Vérification...</> : <><ShieldCheck size={18} /> Vérifier le code</>}
              </button>
              <button type="button" onClick={() => { setRequires2fa(false); setOtpCode(['','','','','','']); setError(''); setDevCode(''); }}
                style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                ← Retour
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 2 }} />
                <input
                  type="email"
                  required
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '13px 16px 13px 44px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: 'white', fontSize: '0.93rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 2 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: 'white', fontSize: '0.93rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', zIndex: 2 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                <input type="checkbox" style={{ width: '15px', height: '15px', accentColor: '#0AA84F', cursor: 'pointer' }} />
                Se souvenir de moi
              </label>
              <Link to="/mot-de-passe-oublie" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#0AA84F'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '14px',
                background: loading ? 'rgba(10,168,79,0.3)' : 'linear-gradient(135deg, #0AA84F, #088C41)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
                fontFamily: 'var(--font-title)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(10,168,79,0.4)',
                marginBottom: '20px',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,168,79,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(10,168,79,0.4)'; }}
            >
              {loading
                ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Connexion...</>
                : <><LogIn size={18} /> Se connecter</>}
            </button>
          </form>
          )}

          {/* Sign up link & Return to shop link */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            {!isAdminLogin && (
              <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Pas de compte ?{' '}
                <Link to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  style={{ color: '#0AA84F', fontWeight: 700, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  Créer un compte
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
