import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Lock, ShieldAlert } from 'lucide-react';
import heroProducts from '../../assets/hero-products.jpg';

const HeroCarousel = () => {
  return (
    <section className="hero-section reveal">
      {/* Decorative Blob */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Left Column: Text & CTAs */}
      <div className="hero-content-col" style={{ flex: '1', position: 'relative', zIndex: 2, maxWidth: '580px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px var(--space-sm)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-sm)',
        }}>
          ✨ Votre bien-être, notre priorité
        </div>

        <h1 style={{
          fontWeight: 'var(--fw-extrabold)',
          lineHeight: 'var(--lh-heading)',
          color: 'var(--text)',
          fontFamily: 'var(--font-title)',
          marginBottom: 'var(--space-sm)',
        }}>
          Bienvenue chez{' '}
          <span style={{ color: 'var(--primary)', textShadow: '0 2px 10px var(--primary-glow)' }}>
            Parapharmacie Ben Moussa
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: 'var(--lh-body)',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-lg)',
          maxWidth: '500px',
          fontWeight: 'var(--fw-regular)',
        }}>
          Des soins de qualité sélectionnés avec soin pour votre santé, votre beauté et votre bien-être au quotidien.
        </p>

        {/* Action Buttons */}
        <div
          className="hero-cta-row"
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            alignItems: 'center',
            marginBottom: 'var(--space-lg)',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--primary)',
              color: '#FFFFFF',
              padding: '15px 26px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--fw-bold)',
              fontSize: 'var(--fs-sm)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-hover)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            }}
          >
            <ShoppingBag size={18} />
            Découvrir nos produits
          </Link>

          <Link
            to="/promotions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              padding: '13px 26px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--fw-bold)',
              fontSize: 'var(--fs-sm)',
              textDecoration: 'none',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.background = 'var(--primary-light)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            Voir les offres
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust Badges */}
        <div
          className="hero-trust-row"
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            alignItems: 'center',
            flexWrap: 'wrap',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          {[
            { icon: <ShieldCheck size={15} color="var(--primary)" />, label: 'Produits authentiques' },
            { icon: <Truck size={15} color="var(--primary)" />, label: 'Livraison 24h' },
            { icon: <Lock size={15} color="var(--primary)" />, label: 'Paiement sécurisé' },
            { icon: <ShieldAlert size={15} color="var(--primary)" />, label: 'Conseils experts' },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--primary-transparent)',
                border: '1px solid var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Cosmetics Image */}
      <div className="hero-image-col" style={{ flex: '1.4', position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <img
          src={heroProducts}
          alt="Parapharmacie Cosmetic Products"
          loading="eager"
          style={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '480px',
            objectFit: 'contain',
            borderRadius: 'var(--radius-md)',
            transition: 'transform 0.5s ease-out',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.025) translateY(-5px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
