import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Lock, Eye, EyeOff, KeyRound, UserPlus, Loader2, ShieldCheck, CheckCircle2, ArrowLeft, Gift } from 'lucide-react';

import logo from '../assets/logo.png';

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '8 car.', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ff6b6b', '#ffd93d', '#0AA84F'];
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {checks.map(({ label, ok }) => (
          <span key={label} style={{ fontSize: '0.73rem', color: ok ? '#0AA84F' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '3px', transition: 'color 0.3s' }}>
            <CheckCircle2 size={10} style={{ opacity: ok ? 1 : 0.3 }} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const { register, user } = useAuth();
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

  const onFocus = e => { e.target.style.borderColor = 'rgba(255,255,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.08)'; };
  const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none'; };

  const fieldStyle = {
    width: '100%',
    padding: '13px 16px 13px 44px',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: '14px',
    color: 'white',
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '7px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.35)',
    pointerEvents: 'none',
    zIndex: 2,
  };

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
        background: 'linear-gradient(135deg, #062a18 0%, #0f2a3a 45%, #17213C 100%)',
        padding: '24px 16px',
      }}>

        {/* Logo watermark */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
          <img src={logo} alt="" aria-hidden="true" style={{ width: '520px', maxWidth: '75vw', opacity: 0.06, filter: 'brightness(2) saturate(0)', userSelect: 'none' }} />
        </div>

        {/* Glow orbs */}
        <div style={{ position:'absolute', top:'-80px', right:'-60px', width:'340px', height:'340px', borderRadius:'50%', background:'rgba(10,168,79,0.15)', filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(199,166,91,0.1)', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />

        {/* Glass card */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: '28px',
          padding: '40px 38px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        }}>

          {/* Back link */}
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0AA84F'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={logo} alt="Para Ben Moussa" style={{ height: '58px', width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }} />
            </Link>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '1.55rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'white', textAlign: 'center', marginBottom: '4px' }}>
            Créer un compte
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontSize: '0.88rem', marginBottom: '26px', lineHeight: 1.5 }}>
            Inscription gratuite, livraison rapide 🇲🇦
          </p>

          {/* Alerts */}
          {message && (
            <div style={{ marginBottom: '16px', padding: '11px 14px', borderRadius: '12px', background: 'rgba(10,168,79,0.15)', border: '1px solid rgba(10,168,79,0.25)', color: '#6ee7a8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={15} /> {message}
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '16px', padding: '11px 14px', borderRadius: '12px', background: 'rgba(220,53,69,0.12)', border: '1px solid rgba(220,53,69,0.25)', color: '#ff8080', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Nom</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={iconStyle} />
                  <input type="text" required placeholder="Votre nom" value={form.name} onChange={set('name')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={iconStyle} />
                  <input type="tel" placeholder="06XXXXXXXX" value={form.phone} onChange={set('phone')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input type="email" required placeholder="exemple@email.com" value={form.email} onChange={set('email')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 caractères" value={form.password} onChange={set('password')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', zIndex: 2 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={15} style={iconStyle} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Répétez votre mot de passe"
                  value={form.confirm}
                  onChange={set('confirm')}
                  style={{
                    ...fieldStyle,
                    borderColor: form.confirm
                      ? form.confirm === form.password ? 'rgba(10,168,79,0.6)' : 'rgba(220,53,69,0.5)'
                      : 'rgba(255,255,255,0.15)'
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', zIndex: 2 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Referral code (optional) */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Code de parrainage <span style={{ opacity: 0.5, fontWeight: 400, textTransform: 'none' }}>(facultatif)</span></label>
              <div style={{ position: 'relative' }}>
                <Gift size={15} style={iconStyle} />
                <input
                  type="text"
                  placeholder="Ex : ABCD1234"
                  value={form.referral_code}
                  onChange={set('referral_code')}
                  maxLength={8}
                  style={{ ...fieldStyle, textTransform: 'uppercase' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                Entrez le code d'un ami et obtenez <strong style={{ color: '#6ee7a8' }}>15 MAD de réduction</strong> sur votre 1ère commande.
              </p>
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer', marginBottom: '20px' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: '#0AA84F', cursor: 'pointer', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                J'accepte les{' '}
                <Link to="/cgv" style={{ color: '#0AA84F', fontWeight: 600 }}>CGV</Link>
                {' '}et la{' '}
                <Link to="/politique-confidentialite" style={{ color: '#0AA84F', fontWeight: 600 }}>politique de confidentialité</Link>
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
                marginBottom: '20px',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,168,79,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(10,168,79,0.4)'; }}
            >
              {loading
                ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Création du compte...</>
                : <><UserPlus size={18} /> Créer mon compte</>}
            </button>
          </form>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <p style={{ textAlign: 'center', fontSize: '0.87rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
