import React, { useState, useEffect, useRef } from 'react';
import { Truck, ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

/* ── CountUp hook ── */
function useCountUp(target, duration = 2000, decimals = 0, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, decimals, start]);
  return count;
}

const STATS = [
  {
    Icon: MessageCircle,
    value: 5000,
    suffix: '+',
    label: 'Clients satisfaits',
    desc: 'Nous font confiance chaque année',
    color: '#0AA84F',
    lightBg: 'linear-gradient(135deg, #ebfff4, #d1fae5)',
    darkBg: 'linear-gradient(135deg, rgba(10,168,79,0.15), rgba(10,168,79,0.05))',
  },
  {
    Icon: ShieldCheck,
    value: 100,
    suffix: '%',
    label: 'Produits Authentiques',
    desc: 'Garantis originaux & certifiés',
    color: '#3B82F6',
    lightBg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    darkBg: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
  },
  {
    Icon: Truck,
    value: 1,
    suffix: 'J',
    label: 'Livraison Express',
    desc: 'Le même jour sur Marrakech',
    color: '#F59E0B',
    lightBg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    darkBg: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
  },
  {
    Icon: Clock,
    value: 24,
    suffix: '/7',
    label: 'Conseil Pharmacien',
    desc: 'Disponible à toute heure',
    color: '#8B5CF6',
    lightBg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    darkBg: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
  },
];

function StatCard({ stat, index, startCount, isDark }) {
  const count = useCountUp(stat.value, 1800 + index * 200, 0, startCount);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 220px',
        background: isDark ? stat.darkBg : stat.lightBg,
        borderRadius: '20px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden',
        border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.8)'}`,
        boxShadow: hovered
          ? `0 20px 50px ${stat.color}28, 0 8px 24px rgba(0,0,0,0.08)`
          : '0 4px 16px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'default',
        animationDelay: `${index * 0.12}s`,
      }}
    >
      {/* Decorative top-right circle */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `${stat.color}14`,
        transition: 'transform 0.4s ease',
        transform: hovered ? 'scale(1.5)' : 'scale(1)',
      }} />

      {/* Icon circle */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: `${stat.color}18`,
        border: `2px solid ${stat.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1) rotate(0)',
        boxShadow: hovered ? `0 8px 20px ${stat.color}30` : 'none',
        zIndex: 1,
      }}>
        <stat.Icon size={26} color={stat.color} strokeWidth={2} />
      </div>

      {/* CountUp number */}
      <div style={{ zIndex: 1 }}>
        <div style={{
          fontSize: '2.6rem',
          fontWeight: 900,
          lineHeight: 1,
          color: stat.color,
          fontFamily: 'var(--font-title)',
          letterSpacing: '-1px',
        }}>
          {count.toLocaleString('fr-FR')}{stat.suffix}
        </div>
      </div>

      {/* Label */}
      <div style={{ zIndex: 1 }}>
        <div style={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--text)',
          marginBottom: '4px',
          fontFamily: 'var(--font-title)',
        }}>
          {stat.label}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}>
          {stat.desc}
        </div>
      </div>

      {/* Gradient border shimmer on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '20px',
          border: `2px solid ${stat.color}40`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

const TrustBar = () => {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef(null);

  // Trigger count animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStartCount(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect dark mode via data-theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <section ref={sectionRef} style={{ padding: '20px 0 60px' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {STATS.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} startCount={startCount} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
