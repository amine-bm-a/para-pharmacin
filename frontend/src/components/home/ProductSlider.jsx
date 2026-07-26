import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────
   Star rating renderer
───────────────────────────────────────── */
const Stars = ({ rating = 0 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: '#FFB800', fontSize: '1rem', letterSpacing: '1px' }}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i}>★</span>;
        if (i === full && half) return <span key={i} style={{ opacity: 0.6 }}>★</span>;
        return <span key={i} style={{ color: 'var(--border)', opacity: 0.5 }}>★</span>;
      })}
    </span>
  );
};

/* ─────────────────────────────────────────
   Single slide card
───────────────────────────────────────── */
const SlideCard = ({ product, isActive }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const discountPct = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Veuillez vous connecter ou créer un compte pour ajouter des produits au panier.');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const resolveImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const backendBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '420px',
        boxShadow: '0 24px 60px rgba(10,168,79,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        border: '1.5px solid var(--border-light)',
        transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        transform: isActive ? 'scale(1)' : 'scale(0.97)',
        opacity: isActive ? 1 : 0.6,
        position: 'relative',
      }}
    >
      {/* Left: Image Container with Fixed Height */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0f7f3 0%, #e8f4ed 100%)',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          width: '100%',
        }}
      >
        {discountPct > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '30px',
              fontSize: '0.78rem',
              fontWeight: 800,
              zIndex: 3,
              boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
              letterSpacing: '0.5px',
            }}
          >
            -{discountPct}%
          </span>
        )}

        <img
          src={resolveImageUrl(product.image_url)}
          alt={product.name}
          loading="lazy"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            padding: '32px',
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            display: 'block',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.07) rotate(1.5deg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80';
          }}
        />
      </Link>

      {/* Right: Info */}
      <div
        style={{
          padding: '36px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        {/* Marque */}
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            opacity: 0.85,
          }}
        >
          {product.brand || 'Pharmacie Ben Moussa'}
        </span>

        {/* Nom produit */}
        <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
              fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.25,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
          >
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Stars rating={product.average_rating || 0} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ({(product.average_rating || 0).toFixed(1)})
          </span>
        </div>

        {/* Prix */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          {product.discount_price ? (
            <>
              <span
                style={{
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  fontWeight: 900,
                  color: '#FF6B6B',
                  lineHeight: 1,
                }}
              >
                {parseFloat(product.discount_price).toFixed(2)} MAD
              </span>
              <span
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                  fontWeight: 600,
                  marginBottom: '2px',
                }}
              >
                {parseFloat(product.price).toFixed(2)} MAD
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                fontWeight: 900,
                color: 'var(--primary)',
                lineHeight: 1,
              }}
            >
              {parseFloat(product.price).toFixed(2)} MAD
            </span>
          )}
        </div>

        {/* Bouton Ajouter au panier */}
        {product.stock > 0 ? (
          <button
            onClick={handleAdd}
            style={{
              marginTop: '8px',
              padding: '14px 28px',
              borderRadius: '14px',
              border: 'none',
              background: added
                ? 'linear-gradient(135deg, #0AA84F, #0fa84f)'
                : 'linear-gradient(135deg, var(--primary), #1a8f5c)',
              color: '#fff',
              fontFamily: 'var(--font-title)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              alignSelf: 'flex-start',
              boxShadow: '0 6px 20px rgba(10,168,79,0.3)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              transform: added ? 'scale(0.97)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (!added) {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(10,168,79,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,168,79,0.3)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{added ? '✓' : '🛒'}</span>
            <span>{added ? 'Ajouté !' : 'Ajouter au panier'}</span>
          </button>
        ) : (
          <span
            style={{
              marginTop: '8px',
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '14px',
              background: 'rgba(255,107,107,0.1)',
              color: '#FF6B6B',
              fontWeight: 800,
              fontSize: '0.85rem',
              alignSelf: 'flex-start',
            }}
          >
            Rupture de stock
          </span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main ProductSlider component
───────────────────────────────────────── */
const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef(null);

  /* Fetch all products from the API (public route) */
  useEffect(() => {
    const load = async () => {
      const cached = localStorage.getItem('cached_products');
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
      }

      try {
        const res = await axios.get('/products');
        if (res.data.success) {
          const raw = res.data.products || res.data.data?.data || res.data.data || [];
          localStorage.setItem('cached_products', JSON.stringify(raw));
          setProducts(raw);
        }
      } catch (err) {
        console.error('ProductSlider: failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* Autoplay */
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000);
  }, [products.length]);

  useEffect(() => {
    if (products.length > 1) startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [products.length, startAutoplay]);

  const goTo = useCallback(
    (dir) => {
      if (isTransitioning || products.length === 0) return;
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);

      if (dir === 'next') {
        setCurrent((prev) => (prev + 1) % products.length);
      } else if (dir === 'prev') {
        setCurrent((prev) => (prev - 1 + products.length) % products.length);
      } else {
        setCurrent(dir); // numeric index
      }
      startAutoplay();
    },
    [isTransitioning, products.length, startAutoplay]
  );

  if (loading) {
    return (
      <section style={{ margin: '0 0 8px', padding: '0 28px' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '28px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            height: '420px',
            border: '1.5px solid var(--border-light)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            position: 'relative',
          }}
        >
          {/* Left Side: Pulsing Image Wrapper */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f7f3 0%, #e8f4ed 100%)',
              animation: 'pulse-glow 1.5s ease-in-out infinite',
              height: '100%',
            }}
          />
          
          {/* Right Side: Pulsing Text Fields */}
          <div
            style={{
              padding: '36px 36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '12px',
                borderRadius: '6px',
                background: 'var(--border)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '85%',
                height: '24px',
                borderRadius: '8px',
                background: 'var(--border-light)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '60%',
                height: '24px',
                borderRadius: '8px',
                background: 'var(--border-light)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    background: 'var(--border-light)',
                    animation: 'pulse-glow 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                width: '120px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--border-light)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '180px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--border-light)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
                marginTop: '10px',
              }}
            />
          </div>
        </div>
        <style>{`
          @keyframes pulse-glow {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      style={{ margin: '0 0 8px', position: 'relative', userSelect: 'none', padding: '0 28px' }}
      aria-label="Slider des produits"
    >
      {/* Main Slide */}
      <div style={{ position: 'relative' }}>
        <SlideCard product={products[current]} isActive={true} />

        {/* Arrow: Previous */}
        {products.length > 1 && (
          <button
            aria-label="Slide précédente"
            onClick={() => goTo('prev')}
            style={{
              position: 'absolute',
              left: '-28px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              background: 'var(--bg-card)',
              color: 'var(--primary)',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(10,168,79,0.2)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ‹
          </button>
        )}

        {/* Arrow: Next */}
        {products.length > 1 && (
          <button
            aria-label="Slide suivante"
            onClick={() => goTo('next')}
            style={{
              position: 'absolute',
              right: '-28px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              background: 'var(--bg-card)',
              color: 'var(--primary)',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(10,168,79,0.2)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ›
          </button>
        )}

        {/* Counter badge */}
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(0,0,0,0.45)',
            color: '#fff',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backdropFilter: 'blur(6px)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {current + 1} / {products.length}
        </div>
      </div>

      {/* Dots */}
      {products.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
          }}
          role="tablist"
          aria-label="Navigation slides"
        >
          {products.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? '28px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                border: 'none',
                background: i === current ? 'var(--primary)' : 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                padding: 0,
                boxShadow: i === current ? '0 2px 8px rgba(10,168,79,0.35)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSlider;
