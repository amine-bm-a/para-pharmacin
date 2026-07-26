import React, { useState } from 'react';
import { Send, CheckCircle, Mail, Sparkles } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useNotification } from '../../context/NotificationContext';

export default function Newsletter() {
  const { t } = useLang();
  const notif = useNotification();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    if (notif) notif.success('Merci pour votre inscription à la newsletter !');
    setEmail('');
  };

  return (
    <section style={{
      position: 'relative',
      padding: '90px 20px',
      overflow: 'hidden',
      background: 'linear-gradient(-45deg, #064e2e, #0AA84F, #088C41, #15803d, #065f46)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 10s ease infinite',
    }}>
      {/* Large decorative circles */}
      {[
        { size: 400, top: '-150px', left: '-100px', opacity: 0.06 },
        { size: 300, bottom: '-120px', right: '-80px', opacity: 0.08 },
        { size: 150, top: '30%', right: '15%', opacity: 0.05 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${c.size}px`,
          height: `${c.size}px`,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          opacity: c.opacity,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Floating dots */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${5 + (i % 3) * 4}px`,
          height: `${5 + (i % 3) * 4}px`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          top: `${10 + i * 10}%`,
          left: `${5 + i * 12}%`,
          animation: `floatParticle ${3 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Glassmorphism card */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '52px 48px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '68px', height: '68px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            marginBottom: '24px',
          }}>
            <Mail size={30} color="#fff" />
          </div>

          {/* Pre-title */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '50px',
            padding: '5px 14px', marginBottom: '16px',
          }}>
            <Sparkles size={13} color="rgba(255,255,255,0.9)" />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Newsletter Exclusive
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '12px',
            lineHeight: 1.2,
            fontFamily: 'var(--font-title)',
            textShadow: '0 2px 16px rgba(0,0,0,0.2)',
          }}>
            {t('newsletter')}
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '36px',
            lineHeight: '1.6',
          }}>
            {t('newsletterText')}
          </p>

          {subscribed ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.15)',
              padding: '18px 32px', borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <CheckCircle size={24} color="#4ade80" />
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                Vous êtes inscrit avec succès !
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '480px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                background: focused ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
                borderRadius: '60px',
                padding: '6px 6px 6px 20px',
                boxShadow: focused
                  ? '0 0 0 3px rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.2)'
                  : '0 12px 40px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                alignItems: 'center',
              }}>
                <Mail size={18} color="#0AA84F" style={{ flexShrink: 0, marginRight: '8px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={t('yourEmail')}
                  required
                  style={{
                    flexGrow: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.98rem',
                    color: '#1f2937',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #0AA84F, #088C41)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '13px 26px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    boxShadow: '0 4px 16px rgba(10,168,79,0.4)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(10,168,79,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(10,168,79,0.4)'; }}
                >
                  <span>{t('subscribe')}</span>
                  <Send size={15} />
                </button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: '12px' }}>
                🔒 Pas de spam. Désinscription facile à tout moment.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
