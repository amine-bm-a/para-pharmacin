import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Lock, ShieldAlert } from 'lucide-react';
import heroProducts from '../../assets/hero-products.jpg';

const HeroCarousel = () => {
  return (
    <section style={{
      margin: '0 0 40px',
      background: 'linear-gradient(135deg, #F3FAF5 0%, #FFFFFF 100%)',
      borderRadius: '32px',
      padding: '40px 60px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #E2EFE7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
      minHeight: '520px',
      boxShadow: '0 20px 48px rgba(10,168,79,0.03), 0 4px 12px rgba(0,0,0,0.01)'
    }}>
      {/* Decorative Blob */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(10,168,79,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Left Column: Text & CTAs */}
      <div style={{ flex: '1', position: 'relative', zIndex: 2, maxWidth: '580px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#EBF8F0',
          color: '#0AA84F',
          padding: '6px 16px',
          borderRadius: '100px',
          fontSize: '0.82rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          ✨ Votre bien-être, notre priorité
        </div>

        <h1 style={{
          fontSize: '3.4rem',
          fontWeight: '800',
          lineHeight: '1.15',
          color: '#17213C',
          fontFamily: 'var(--font-title)',
          marginBottom: '16px'
        }}>
          Bienvenue chez <span style={{ color: '#0AA84F', textShadow: '0 2px 10px rgba(10,168,79,0.05)' }}>Parapharmacie Ben Moussa</span>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.65',
          color: '#5D6A85',
          marginBottom: '32px',
          maxWidth: '500px'
        }}>
          Des soins de qualité sélectionnés avec soin pour votre santé, votre beauté et votre bien-être au quotidien.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
          <Link to="/products" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#0AA84F',
            color: '#FFFFFF',
            padding: '15px 26px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '0.96rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(10,168,79,0.2)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(10,168,79,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,168,79,0.2)'; }}
          >
            <ShoppingBag size={18} />
            Découvrir nos produits
          </Link>

          <Link to="/promotions" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            color: '#0AA84F',
            border: '2px solid #0AA84F',
            padding: '13px 26px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '0.96rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = '#EBF8F0'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#FFFFFF'; }}
          >
            Voir les offres
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: '1px solid #E7ECEF',
          paddingTop: '20px'
        }}>
          {[
            { icon: <ShieldCheck size={18} color="#0AA84F" />, label: 'Produits authentiques' },
            { icon: <Truck size={18} color="#0AA84F" />, label: 'Livraison rapide 24h' },
            { icon: <Lock size={18} color="#0AA84F" />, label: 'Paiement sécurisé' },
            { icon: <ShieldAlert size={18} color="#0AA84F" />, label: 'Conseils experts' }
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#5D6A85' }}>
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Cosmetics Image */}
      <div style={{ flex: '1.4', position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <img
          src={heroProducts}
          alt="Parapharmacie Cosmetic Products"
          style={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '520px',
            objectFit: 'contain',
            borderRadius: '24px',
            transition: 'transform 0.5s ease-out'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.025) translateY(-5px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
