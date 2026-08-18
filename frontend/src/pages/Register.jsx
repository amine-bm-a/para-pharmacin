import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Phone, Mail, Lock, Eye, EyeOff, KeyRound, UserPlus, Loader2, ShieldCheck, CheckCircle2, ArrowLeft, Gift, Sun, Moon, Check } from 'lucide-react';

import logo from '../assets/logo.png';

function PasswordStrength({ password, isDark }) {
  if (!password) return null;
  const checks = [
    { label: '8 car.', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ff6b6b', '#ffd93d', '#0AA84F'];
  const barInactive = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const textInactive = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)';
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < score ? colors[score - 1] : barInactive, transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {checks.map(({ label, ok }) => (
          <span key={label} style={{ fontSize: '0.73rem', color: ok ? '#0AA84F' : textInactive, display: 'flex', alignItems: 'center', gap: '3px', transition: 'color 0.3s' }}>
            <CheckCircle2 size={10} style={{ opacity: ok ? 1 : 0.3 }} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const { register, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || location.state?.redirectTo || '/mon-compte';
  const redirectPath = redirect === 'checkout' ? '/checkout' : redirect === 'admin' ? '/' : redirect;
  const message = location.state?.message || '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', referral_code: searchParams.get('ref') || '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (user) navigate(redirectPath); }, [user, redirectPath, navigate]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (form.password.length < 8) return 'Le mot de passe doit avoir au moins 8 caractères.';
    if (!/[A-Z]/.test(form.password)) return 'Le mot de passe doit contenir au moins une majuscule.';
    if (!/[0-9]/.test(form.password)) return 'Le mot de passe doit contenir au moins un chiffre.';
    if (form.password !== form.confirm) return 'Les mots de passe ne correspondent pas.';
    if (!agreed) return 'Veuillez accepter les conditions d\'utilisation.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError('');
    const res = await register(form.name, form.email, form.phone, form.password, form.confirm, form.referral_code || null);
    setLoading(false);
    if (res.success) navigate(redirectPath);
    else setError(res.message);
  };

  // ── Theme-aware colors ──
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

  const fieldStyle = {
    width: '100%',
    padding: '13px 16px 13px 44px',
    background: inputBg,
    border: `1.5px solid ${inputBorder}`,
    borderRadius: '14px',
    color: textMain,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: textMuted,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: textFaint,
    pointerEvents: 'none',
    zIndex: 2,
  };

  return (
    <>
      <div className="register-container" style={{
        fontFamily: 'var(--font-body)',
        '--bg-gradient': bgGradient,
        '--card-bg': cardBg,
        '--card-border': cardBorder,
        '--card-shadow': cardShadow,
      }}>

        {/* ── Left Panel (Branding) ── */}
        <div className="register-left-panel">
          {/* Giant logo watermark */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <img src={logo} alt="" style={{ width: '600px', maxWidth: '80%', opacity: 0.05, filter: 'brightness(2) saturate(0)', userSelect: 'none' }} />
          </div>

          {/* Soft glow orbs */}
          <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(10,168,79,0.15)', filter:'blur(100px)', pointerEvents:'none', zIndex:0 }} />
          <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(199,166,91,0.1)', filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />

          {/* Branding text */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: 'white', marginBottom: '24px', lineHeight: 1.15, fontFamily: 'var(--font-title)' }}>
              Rejoignez la<br/> <span style={{ color: '#0AA84F' }}>communauté.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontWeight: 400 }}>
              Créez votre compte pour profiter de prix exclusifs, suivre vos commandes et recevoir des offres personnalisées.
            </p>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="register-right-panel">
          <div className="register-form-container">
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
<div className="register-mobile-logo" style={{ textAlign: 'center', marginBottom: '24px' }}>
  <Link to="/" style={{ display: 'inline-block' }}>
    <img src={logo} alt="Para Ben Moussa" style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: isDark ? 'brightness(1.1)' : 'none' }} />
  </Link>
</div>

{/* Title */}
<h2 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: textMain, textAlign: 'center', marginBottom: '6px' }}>
  Créer un compte
</h2>
<p style={{ color: textFaint, textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.5 }}>
  Inscription gratuite, livraison rapide 🇲🇦
</p>

            {/* Alerts */}
            {message && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(10,168,79,0.15)', border: '1px solid rgba(10,168,79,0.25)', color: '#6ee7a8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={15} /> {message}
              </div>
            )}
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(220,53,69,0.12)', border: '1px solid rgba(220,53,69,0.25)', color: '#ff8080', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={15} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={iconStyle} />
                    <input type="text" required placeholder="Votre nom" value={form.name} onChange={set('name')} className="register-input" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={iconStyle} />
                    <input type="tel" placeholder="06XXXXXXXX" value={form.phone} onChange={set('phone')} className="register-input" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={iconStyle} />
                  <input type="email" required placeholder="exemple@email.com" value={form.email} onChange={set('email')} className="register-input" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={iconStyle} />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 caractères" value={form.password} onChange={set('password')} className="register-input" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textFaint, display: 'flex', zIndex: 2 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} isDark={isDark} />
              </div>

              {/* Confirm */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={15} style={iconStyle} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Répétez votre mot de passe"
                    value={form.confirm}
                    onChange={set('confirm')}
                    className="register-input"
                    style={{
                      ...fieldStyle,
                      borderColor: form.confirm
                        ? form.confirm === form.password ? 'rgba(10,168,79,0.6)' : 'rgba(220,53,69,0.5)'
                        : inputBorder
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textFaint, display: 'flex', zIndex: 2 }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Referral code (optional) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Code de parrainage <span style={{ opacity: 0.5, fontWeight: 400, textTransform: 'none' }}>(facultatif)</span></label>
                <div style={{ position: 'relative' }}>
                  <Gift size={15} style={iconStyle} />
                  <input
                    type="text"
                    placeholder="Ex : ABCD1234"
                    value={form.referral_code}
                    onChange={set('referral_code')}
                    maxLength={8}
                    className="register-input"
                    style={{ ...fieldStyle, textTransform: 'uppercase' }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: textFaint }}>
                  Entrez le code d'un ami et obtenez <strong style={{ color: '#6ee7a8' }}>15 MAD de réduction</strong> sur votre 1ère commande.
                </p>
              </div>

              {/* Terms — Custom checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', marginBottom: '24px' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '6px', marginTop: '2px', flexShrink: 0,
                  border: `1.5px solid ${agreed ? '#0AA84F' : inputBorder}`,
                  background: agreed ? '#0AA84F' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {agreed && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ display: 'none' }} />
                <span style={{ fontSize: '0.8rem', color: textFaint, lineHeight: 1.55 }}>
                  J'accepte les{' '}
                  <Link to="/cgv" style={{ color: '#0AA84F', fontWeight: 600, textDecoration: 'none' }}>CGV</Link>
                  {' '}et la{' '}
                  <Link to="/politique-confidentialite" style={{ color: '#0AA84F', fontWeight: 600, textDecoration: 'none' }}>politique de confidentialité</Link>
                </span>
              </label>

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
                  ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Création du compte...</>
                  : <><UserPlus size={18} /> Créer mon compte</>}
              </button>
            </form>

            {/* Login link */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <p style={{ textAlign: 'center', fontSize: '0.88rem', color: textFaint, margin: 0 }}>
                Déjà inscrit ?{' '}
                <Link to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  style={{ color: '#0AA84F', fontWeight: 700, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  Se connecter
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .register-input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.32)'};
          font-weight: 400;
        }

        .register-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: var(--bg-gradient);
          overflow-y: auto;
        }

        .register-left-panel {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 8%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #062a18 0%, #0f2a3a 45%, #17213C 100%);
        }

        .register-right-panel {
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

        .register-form-container {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
        }

        .register-mobile-logo {
          display: none;
        }

        @media (max-width: 900px) {
          .register-left-panel {
            display: none;
          }
          .register-right-panel {
            min-width: 100%;
            background: transparent;
            border-left: none;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            padding: 20px;
          }
          .register-form-container {
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1.5px solid var(--card-border);
            border-radius: 28px;
            padding: 40px 32px;
            box-shadow: var(--card-shadow);
          }
          .register-mobile-logo {
            display: block;
          }
        }

        @media (max-height: 750px) {
          .register-right-panel { padding-top: 20px; padding-bottom: 20px; }
          .register-form-container { padding: 24px 28px !important; }
        }
      `}</style>
    </>
  );
}
