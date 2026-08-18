import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Loader2, ArrowLeft, KeyRound, AlertCircle, Sun, Moon, Check } from 'lucide-react';

import logo from '../assets/logo.png';

export default function Login() {
  const { login, loginWith2fa, user, error: authError } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const isAdminLogin = redirect === 'admin';
  const getRoleRedirect = (u, reqRedirect) => {
    if (reqRedirect && reqRedirect !== '/' && reqRedirect !== 'admin' && reqRedirect !== 'pharmacien' && reqRedirect !== 'checkout') {
      return reqRedirect;
    }
    if (u?.role === 'admin') return '/admin';
    if (u?.role === 'pharmacien' || u?.role === 'employe') return '/pharmacien';
    return (reqRedirect && reqRedirect !== '/') ? reqRedirect : '/mon-compte';
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── 2FA state ──────────────────────────────────────────────────────────
  const [requires2fa, setRequires2fa] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [devCode, setDevCode] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (user) {
      navigate(getRoleRedirect(user, redirect));
    }
  }, [user, navigate, redirect]);

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
      navigate(getRoleRedirect(res.user || user, redirect));
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
    if (res?.success) navigate(getRoleRedirect(res.user || user, redirect));
    else setError(res?.message || 'Code invalide.');
  };

  const bgGradient = isDark 
    ? 'linear-gradient(135deg, #062a18 0%, #0f2a3a 45%, #17213C 100%)' 
    : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 45%, #e0e7ff 100%)';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)';
  const cardShadow = isDark ? '0 32px 80px rgba(0,0,0,0.45)' : '0 32px 80px rgba(0,0,0,0.1)';
  const textMain = isDark ? 'white' : '#1f2937';
  const textMuted = isDark ? 'rgba(255,255,255,0.72)' : '#4b5563';
  const textFaint = isDark ? 'rgba(255,255,255,0.62)' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  
  const onFocus = e => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.6)' : '#0AA84F'; e.target.style.boxShadow = isDark ? '0 0 0 3px rgba(255,255,255,0.08)' : '0 0 0 3px rgba(10,168,79,0.15)'; };
  const onBlur  = e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; };

  return (
    <>
      <div className="login-container" style={{
        fontFamily: 'var(--font-body)',
        '--bg-gradient': bgGradient,
        '--card-bg': cardBg,
        '--card-border': cardBorder,
        '--card-shadow': cardShadow,
      }}>

        {/* ── Left Panel (Branding / Illustration) ── */}
        <div className="login-left-panel">
          {/* Giant logo watermark */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <img src={logo} alt="" style={{ width: '600px', maxWidth: '80%', opacity: 0.05, filter: 'brightness(2) saturate(0)', userSelect: 'none' }} />
          </div>
          
          {/* Soft glow orbs */}
          <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'500px', height:'500px', borderRadius:'50%', background: isDark ? 'rgba(10,168,79,0.15)' : 'rgba(10,168,79,0.1)', filter:'blur(100px)', pointerEvents:'none', zIndex:0 }} />
          <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'400px', height:'400px', borderRadius:'50%', background: isDark ? 'rgba(199,166,91,0.1)' : 'rgba(59,130,246,0.08)', filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />

          {/* Typography */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: 'white', marginBottom: '24px', lineHeight: 1.15, fontFamily: 'var(--font-title)' }}>
              La santé et la beauté,<br/> <span style={{ color: '#0AA84F' }}>à portée de main.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontWeight: 400 }}>
              Connectez-vous pour accéder à vos commandes, gérer vos favoris, et profiter d'offres exclusives pensées pour vous.
            </p>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="login-right-panel">
          <div className="login-form-container">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              {/* Back link */}
              <Link
                to="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: textFaint, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0AA84F'}
                onMouseLeave={e => e.currentTarget.style.color = textFaint}
              >
                <ArrowLeft size={14} /> Retour
              </Link>
              
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
                  color: textMain,
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
                title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* Mobile Logo */}
            <div className="login-mobile-logo" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Link to="/" style={{ display: 'inline-block' }}>
                <img src={logo} alt="Para Ben Moussa" style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: isDark ? 'brightness(1.1)' : 'none' }} />
              </Link>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: textMain, textAlign: 'center', marginBottom: '6px' }}>
              {isAdminLogin ? 'Espace Administrateur' : 'Bon retour !'}
            </h2>
            <p style={{ color: textFaint, textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.5 }}>
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
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(10,168,79,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <KeyRound size={24} color="#0AA84F" />
                  </div>
                  <p style={{ color: textMuted, fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                    Code envoyé à <strong style={{ color: textMain }}>{otpEmail}</strong>.<br />
                    Valable 10 minutes.
                  </p>
                  {devCode && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(199,166,91,0.08)', border: '1px dashed rgba(199,166,91,0.3)', borderRadius: '10px', fontSize: '0.8rem', color: '#c7a65b', textAlign: 'left' }}>
                      Dev mode - Code OTP: <code style={{ fontSize: '1.1rem', letterSpacing: '4px', fontWeight: 700 }}>{devCode}</code>
                    </div>
                  )}
                </div>

                {/* 6 digit inputs */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
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
                        width: '44px', height: '52px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
                        background: inputBg, border: `2px solid ${digit ? '#0AA84F' : inputBorder}`,
                        borderRadius: '12px', color: textMain, outline: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-title)'
                      }}
                      onFocus={e => { e.target.style.borderColor = '#0AA84F'; e.target.style.boxShadow = '0 0 0 3px rgba(10,168,79,0.2)'; }}
                      onBlur={e => { e.target.style.borderColor = digit ? '#0AA84F' : inputBorder; e.target.style.boxShadow = 'none'; }}
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
                  style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: textFaint, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  ← Retour
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: textFaint, pointerEvents: 'none', zIndex: 2 }} />
                    <input
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="login-input"
                      style={{ width: '100%', padding: '13px 16px 13px 44px', background: inputBg, border: `1.5px solid ${inputBorder}`, borderRadius: '14px', color: textMain, fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Mot de passe</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: textFaint, pointerEvents: 'none', zIndex: 2 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="login-input"
                      style={{ width: '100%', padding: '13px 44px 13px 44px', background: inputBg, border: `1.5px solid ${inputBorder}`, borderRadius: '14px', color: textMain, fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textFaint, display: 'flex', zIndex: 2 }}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.83rem', color: textMuted, margin: 0 }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '6px', border: `1.5px solid ${remember ? '#0AA84F' : inputBorder}`,
                      background: remember ? '#0AA84F' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {remember && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ display: 'none' }} />
                    Se souvenir de moi
                  </label>
                  <Link to="/mot-de-passe-oublie" style={{ fontSize: '0.83rem', color: textMuted, fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#0AA84F'}
                    onMouseLeave={e => e.target.style.color = textMuted}
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
                    marginBottom: '24px',
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
                <p style={{ textAlign: 'center', fontSize: '0.88rem', color: textFaint, margin: 0 }}>
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
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .login-input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.32)'};
          font-weight: 400;
        }

        .login-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: var(--bg-gradient);
          overflow-y: auto;
        }
        
        .login-left-panel {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 8%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #062a18 0%, #0f2a3a 45%, #17213C 100%);
        }
        
        .login-right-panel {
          flex: 1;
          min-width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-left: 1px solid var(--card-border);
          box-shadow: -20px 0 80px rgba(0,0,0,0.15);
          padding: 40px;
          position: relative;
          z-index: 10;
        }
        
        .login-form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .login-mobile-logo {
          display: none;
        }

        @media (max-width: 900px) {
          .login-left-panel {
            display: none;
          }
          .login-right-panel {
            min-width: 100%;
            background: transparent;
            border-left: none;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            padding: 20px;
          }
          .login-form-container {
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1.5px solid var(--card-border);
            border-radius: 28px;
            padding: 40px 32px;
            box-shadow: var(--card-shadow);
          }
          .login-mobile-logo {
            display: block;
          }
        }

        @media (max-height: 750px) {
          .login-right-panel { padding-top: 20px; padding-bottom: 20px; }
          .login-form-container { padding: 24px 28px !important; }
        }
      `}</style>
    </>
  );
}
