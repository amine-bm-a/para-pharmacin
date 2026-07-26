import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  // Target: Next Sunday at 23:59:59
  const getNextSunday = () => {
    const now = new Date();
    const resultDate = new Date();
    resultDate.setDate(now.getDate() + (7 - now.getDay()) % 7);
    resultDate.setHours(23, 59, 59, 999);
    return resultDate;
  };

  const [targetDate, setTargetDate] = useState(getNextSunday());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        // Reset to next Sunday if elapsed
        setTargetDate(getNextSunday());
      }
      setTimeLeft(newTimeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // run immediately

    return () => clearInterval(timer);
  }, [targetDate]);

  const padZero = (num) => String(num).padStart(2, '0');

  const timerBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '10px 14px',
    minWidth: '70px',
    boxShadow: 'var(--shadow-sm)'
  };

  const numberStyle = {
    fontSize: '1.4rem',
    fontWeight: 700,
    fontFamily: 'var(--font-title)',
    color: '#FFD700', // Gold accent number
    lineHeight: 1.2
  };

  const labelStyle = {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 600,
    marginTop: '4px',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
      <div style={timerBoxStyle}>
        <span style={numberStyle}>{padZero(timeLeft.days)}</span>
        <span style={labelStyle}>Jours</span>
      </div>
      <div style={timerBoxStyle}>
        <span style={numberStyle}>{padZero(timeLeft.hours)}</span>
        <span style={labelStyle}>Heures</span>
      </div>
      <div style={timerBoxStyle}>
        <span style={numberStyle}>{padZero(timeLeft.minutes)}</span>
        <span style={labelStyle}>Min</span>
      </div>
      <div style={timerBoxStyle}>
        <span style={numberStyle}>{padZero(timeLeft.seconds)}</span>
        <span style={labelStyle}>Sec</span>
      </div>
    </div>
  );
};

const PromoBanners = () => {
  const showBanners = false;
  if (!showBanners) return null;

  return (
    <section className="py-section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 700, 
            fontSize: '0.88rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            background: 'var(--primary-light)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)'
          }}>
            Promotions
          </span>
          <h2 className="section-title" style={{ marginTop: '16px' }}>Offres Exceptionnelles</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Des remises exclusives et limitées sur vos marques préférées</p>
        </div>

        {/* Large Featured Banner with Countdown */}
        <div 
          className="promo-banner-main" 
          style={{ 
            marginBottom: '30px', 
            borderRadius: 'var(--radius-xl)', 
            overflow: 'hidden', 
            backgroundImage: 'url("https://images.unsplash.com/photo-1608248597481-496100c80836?w=1200&q=80")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            minHeight: '340px', 
            position: 'relative',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.01)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(23,33,60,0.85) 0%, rgba(23,33,60,0.4) 60%, transparent 100%)' }} />
          <div style={{ zIndex: 2, padding: '40px 60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '30px' }}>
            <div style={{ maxWidth: '500px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px',
                background: 'var(--danger)', 
                color: 'white', 
                padding: '6px 16px', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                marginBottom: '16px',
                letterSpacing: '0.5px'
              }}>
                ⚡ OFFRE FLASH
              </div>
              <h2 style={{ fontSize: '2.4rem', marginBottom: '8px', fontWeight: 800, fontFamily: 'var(--font-title)', lineHeight: 1.2 }}>
                Avène — Soins Thermaux & Hydratation
              </h2>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 20px', color: '#FFD700' }}>
                Jusqu'à -35% sur toute la gamme
              </h3>
              <button style={{ 
                background: 'white', 
                color: 'var(--secondary)', 
                fontWeight: 700,
                padding: '14px 32px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                Découvrir l'offre →
              </button>
            </div>

            {/* Countdown block */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', padding: '24px 30px', borderRadius: 'var(--radius-xl)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.9)' }}>
                Se termine dans :
              </span>
              <CountdownTimer />
            </div>
          </div>
        </div>

        {/* 2-Grid Banners */}
        <div className="grid-2" style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          <div className="promo-card-hover" style={{ 
            borderRadius: 'var(--radius-xl)', 
            overflow: 'hidden', 
            backgroundImage: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '260px', 
            display: 'flex', 
            alignItems: 'flex-end', 
            position: 'relative',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,33,60,0.85) 0%, rgba(23,33,60,0.2) 70%, transparent 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '30px', width: '100%' }}>
              <div style={{ 
                display: 'inline-block',
                background: 'var(--accent)', 
                color: 'white', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                🎁 CADEAU OFFERT
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 800, marginBottom: '6px', fontFamily: 'var(--font-title)' }}>
                Sélection Capillaire René Furterer
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0 }}>Un shampoing voyage offert pour tout achat de la gamme</p>
            </div>
          </div>

          <div className="promo-card-hover" style={{ 
            borderRadius: 'var(--radius-xl)', 
            overflow: 'hidden', 
            background: 'linear-gradient(135deg, #F0F4F8, #FFFFFF)',
            border: '1px solid var(--border)',
            height: '260px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '40px',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              position: 'absolute', 
              right: '-40px', 
              top: '-40px', 
              width: '180px', 
              height: '180px', 
              borderRadius: '50%', 
              background: 'var(--primary-light)',
              opacity: 0.5,
              zIndex: 0
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                display: 'inline-block',
                background: 'var(--primary)', 
                color: 'white', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '4px',
                marginBottom: '12px'
              }}>
                🎄 COFFRETS EXCLUSIFS
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--secondary)', marginBottom: '8px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                Rituels Beauté Eucerin
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, maxWidth: '300px', lineHeight: 1.5 }}>
                Bénéficiez de trousses d'exception contenant vos produits anti-âge favoris.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Grid Banners */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {[
            { image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80', brand: 'DUCRAY', desc: 'Soin des peaux à tendance acnéique', badge: '-20%', badgeColor: 'var(--danger)' },
            { image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80', brand: 'BIODERMA', desc: 'Hydratation intense peaux sensibles', badge: 'OFFRE', badgeColor: 'var(--primary)' },
            { image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', brand: 'KLORANE', desc: 'Gamme bébé au Calendula apaisant', badge: '-15%', badgeColor: 'var(--danger)' }
          ].map((item, idx) => (
            <div key={idx} className="promo-card-hover" style={{ 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden', 
              backgroundImage: `url("${item.image}")`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              height: '240px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              position: 'relative',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,33,60,0.85) 0%, rgba(23,33,60,0.1) 60%, transparent 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2, padding: '24px', width: '100%' }}>
                <div style={{ 
                  display: 'inline-block',
                  background: item.badgeColor, 
                  color: 'white', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  {item.badge}
                </div>
                <h4 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 800, marginBottom: '2px', fontFamily: 'var(--font-title)' }}>
                  {item.brand}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PromoBanners;
