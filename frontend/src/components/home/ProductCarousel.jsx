import React, { useRef, useState, useEffect, memo } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';

const ProductCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        if (res.data.success) {
          const allProducts = res.data.products || res.data.data?.data || res.data.data || [];
          // Get some products for the "Sélection" or featured list, e.g., next 5 items
          setProducts(allProducts.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
      setTimeout(checkScroll, 400);
    }
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-section">
      <div className="container">
        {/* Section Header with nav arrows */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '6px' }}>🌙 Bien Dormir</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Nos solutions naturelles pour un sommeil réparateur</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => scroll(-1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid ${canScrollLeft ? 'var(--primary)' : 'var(--border)'}`,
                background: canScrollLeft ? 'var(--primary-light)' : 'transparent',
                color: canScrollLeft ? 'var(--primary)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              ‹
            </button>
            <button 
              onClick={() => scroll(1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid ${canScrollRight ? 'var(--primary)' : 'var(--border)'}`,
                background: canScrollRight ? 'var(--primary-light)' : 'transparent',
                color: canScrollRight ? 'var(--primary)' : 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              ›
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Side Banner */}
          <div style={{ 
            flex: '0 0 280px', 
            backgroundImage: 'url("/sleep_banner.png")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            color: 'white', 
            padding: '36px 28px', 
            borderRadius: 'var(--radius-lg)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            position: 'relative', 
            overflow: 'hidden',
            minHeight: '380px'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,27,42,0.8), rgba(13,27,42,0.4))' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="promo-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '16px' }}>
                ✨ SÉLECTION
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.15, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                Dormir<br/>la nuit,
              </h2>
              <p style={{ fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#FFD700', textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                c'est mieux
              </p>
            </div>
            <button className="btn" style={{ 
              position: 'relative', 
              zIndex: 2, 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              backdropFilter: 'blur(6px)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.2)',
              alignSelf: 'flex-start'
            }}>
              Tout voir →
            </button>
          </div>
          
          {/* Scrollable Products */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            style={{ 
              flex: 1, 
              overflowX: 'auto', 
              display: 'flex', 
              gap: '18px', 
              paddingBottom: '8px',
              scrollbarWidth: 'none'
            }}
          >
            {products.map((p, i) => (
              <div key={i} style={{ minWidth: '230px', maxWidth: '240px' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProductCarousel);
