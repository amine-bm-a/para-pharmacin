import React, { useState, useCallback, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onWishlistToggle }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const [wishlistAnim, setWishlistAnim] = useState(false);
  const btnRef = useRef(null);

  const rating = product.average_rating || 0;
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const [isLiked, setIsLiked] = useState(() => {
    if (!user?.id) return false;
    try {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      return wishlist.some(item => item.id === product.id);
    } catch (e) {
      return false;
    }
  });

  /* ── Ripple helper ── */
  const createRipple = useCallback((e) => {
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
  }, []);

  const handleWishlistClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      alert('Veuillez vous connecter pour enregistrer vos favoris.');
      return;
    }
    setWishlistAnim(true);
    setTimeout(() => setWishlistAnim(false), 700);
    try {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      let updated;
      if (isLiked) {
        updated = wishlist.filter(item => item.id !== product.id);
      } else {
        updated = [...wishlist, product];
      }
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
      setIsLiked(!isLiked);
      if (onWishlistToggle) onWishlistToggle(product, !isLiked);
    } catch (err) {
      console.error(err);
    }
  }, [user, isLiked, product, onWishlistToggle]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Veuillez vous connecter ou créer un compte pour ajouter des produits au panier.');
      navigate('/login');
      return;
    }
    createRipple(e);
    addToCart(product, 1);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  }, [user, product, addToCart, navigate, createRipple]);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={{ color: '#FFB800' }}>★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i} style={{ color: '#FFB800' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: 'var(--border)' }}>★</span>);
      }
    }
    return stars;
  };

  const resolveImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    const backendBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api$/, '');
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: isHovered ? '2px solid var(--primary-glow)' : '2px solid var(--border-light)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: isHovered
          ? '0 20px 50px rgba(10,168,79,0.18), 0 8px 20px rgba(0,0,0,0.08)'
          : '0 4px 12px rgba(0,0,0,0.05)',
        transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Discount badge with pulse */}
      {product.discount_price && (
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 800,
            zIndex: 3,
            boxShadow: '0 4px 12px rgba(255,107,107,0.5)',
            letterSpacing: '0.5px',
            animation: 'badgePulse 2s ease-in-out infinite',
          }}
        >
          -{discountPercent}%
        </span>
      )}

      {/* Low stock badge */}
      {isLowStock && (
        <span
          style={{
            position: 'absolute',
            top: product.discount_price ? '48px' : '12px',
            left: '12px',
            background: 'linear-gradient(135deg, #FF9800, #F57C00)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.68rem',
            fontWeight: 700,
            zIndex: 3,
            boxShadow: '0 2px 8px rgba(255,152,0,0.4)',
          }}
        >
          🔥 Plus que {product.stock}!
        </span>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isLiked ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.95)',
          border: isLiked ? '2px solid rgba(255,107,107,0.4)' : '2px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          cursor: 'pointer',
          zIndex: 3,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: isHovered || isLiked ? 1 : 0,
          transform: `${isHovered || isLiked ? 'scale(1)' : 'scale(0.7) translateY(8px)'} ${wishlistAnim ? '' : ''}`,
          boxShadow: isHovered || isLiked ? '0 6px 20px rgba(0,0,0,0.15)' : 'none',
          animation: wishlistAnim ? 'heartBeat 0.7s ease' : 'none',
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>

      {/* Product image */}
      <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: 1,
            overflow: 'hidden',
            background: isHovered
              ? 'linear-gradient(135deg, #f0fff4, #e6f4ea)'
              : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '20px',
            transition: 'background 0.4s ease',
          }}
        >
          <img
            src={resolveImageUrl(product.image_url)}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80';
            }}
          />
          {/* Image overlay on hover */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(10,168,79,0.06) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }} />
        </div>
      </Link>

      {/* Product info */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          opacity: 0.85
        }}>
          {product.brand}
        </span>

        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.3,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.name}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{renderStars()}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ({rating})
          </span>
        </div>

        {/* Price + Add to cart */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            {product.discount_price ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FF6B6B', lineHeight: 1 }}>
                  {parseFloat(product.discount_price).toFixed(2)} MAD
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>
                  {parseFloat(product.price).toFixed(2)} MAD
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                {parseFloat(product.price).toFixed(2)} MAD
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <button
              ref={btnRef}
              onClick={handleAddToCart}
              className="btn-ripple"
              style={{
                background: addedFlash
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, var(--primary), #1a8f5c)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: addedFlash
                  ? '0 0 0 4px rgba(34,197,94,0.3), 0 6px 20px rgba(16,130,89,0.4)'
                  : '0 4px 12px rgba(16,130,89,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transform: addedFlash ? 'scale(1.08)' : 'scale(1)',
                animation: addedFlash ? 'pulseGlow 0.6s ease' : 'none',
              }}
            >
              <span>{addedFlash ? '✓' : '🛒'}</span>
              <span>{addedFlash ? 'Ajouté !' : 'Ajouter'}</span>
            </button>
          ) : (
            <span style={{
              color: '#FF6B6B',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '8px 12px',
              background: 'rgba(255,107,107,0.1)',
              borderRadius: '10px'
            }}>
              Rupture
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.discount_price === nextProps.product.discount_price &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.average_rating === nextProps.product.average_rating
  );
});
