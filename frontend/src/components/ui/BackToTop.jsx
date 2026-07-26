import React, { useState, useEffect, useRef } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const createRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    Object.assign(wave.style, {
      width: `${size}px`, height: `${size}px`,
      left: `${x}px`, top: `${y}px`,
    });
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
  };

  const handleClick = (e) => {
    createRipple(e);
    setClicked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className="btn-ripple"
        title="Retour en haut"
        aria-label="Retour en haut de page"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0AA84F, #088C41)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(10,168,79,0.45)',
          transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          opacity: visible ? 1 : 0,
          transform: visible
            ? (clicked ? 'scale(0.9) translateY(0)' : 'scale(1) translateY(0)')
            : 'scale(0.6) translateY(20px)',
          pointerEvents: visible ? 'auto' : 'none',
          animation: visible ? 'pulseGlow 3s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(10,168,79,0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,168,79,0.45)';
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.3s ease',
            transform: clicked ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Progress ring around button when scrolled */}
      {visible && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '66px',
          height: '66px',
          borderRadius: '50%',
          border: '2px solid rgba(10,168,79,0.2)',
          pointerEvents: 'none',
          zIndex: 999,
          animation: 'pulseGlow 3s ease-in-out infinite',
          animationDelay: '0.5s',
        }} />
      )}
    </>
  );
}
