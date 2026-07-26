import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'discount_desc', label: 'Remise : la plus forte' },
  { value: 'price_asc', label: 'Prix : croissant' },
  { value: 'price_desc', label: 'Prix : décroissant' },
  { value: 'newest', label: 'Nouveautés' },
];

export default function Promotions() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [sort, setSort] = useState('discount_desc');

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/products?promotions=1');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error("Error fetching promotional products", err);
        setError("Impossible de charger les offres en ce moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const getDiscount = (p) =>
    p.discount_price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;

  const categories = useMemo(() => {
    const names = products
      .map((p) => p.category?.name)
      .filter(Boolean);
    return ['Tous', ...Array.from(new Set(names))];
  }, [products]);

  const stats = useMemo(() => {
    if (products.length === 0) return { count: 0, maxDiscount: 0, totalSavings: 0 };
    const discounts = products.map(getDiscount);
    const savings = products.reduce(
      (sum, p) => sum + (p.discount_price ? (p.price - p.discount_price) : 0),
      0
    );
    return {
      count: products.length,
      maxDiscount: Math.max(...discounts),
      totalSavings: savings,
    };
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'Tous') {
      list = list.filter((p) => p.category?.name === activeCategory);
    }
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
        break;
      case 'price_desc':
        list.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
        break;
      case 'newest':
        list.sort((a, b) => b.id - a.id);
        break;
      case 'discount_desc':
      default:
        list.sort((a, b) => getDiscount(b) - getDiscount(a));
        break;
    }
    return list;
  }, [products, activeCategory, sort]);

  return (
    <div className="container fade-in" style={{ marginTop: '24px', marginBottom: '48px' }}>
      {/* Breadcrumbs */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)', 
        marginBottom: '24px',
        padding: '12px 16px',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏠</span> Accueil
        </Link> 
        <span style={{ color: 'var(--border)' }}>/</span> 
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Promotions & Offres Spéciales</span>
      </div>

      {/* Promotions Hero Banner */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, hsl(354, 70%, 54%), hsl(354, 70%, 38%))',
          color: 'white',
          padding: '50px 40px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '32px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(239, 68, 68, 0.25)',
          border: '1px solid hsl(354, 70%, 65%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.10), transparent 45%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          fontSize: '15rem',
          opacity: 0.05,
          pointerEvents: 'none'
        }}>⚡</div>
        <span
          style={{
            background: 'white',
            color: 'hsl(354, 70%, 42%)',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '16px',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            position: 'relative'
          }}
        >
          Offres Limitées ⚡
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2, position: 'relative' }}>
          Prenez Soin de Vous à Petit Prix
        </h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.95, maxWidth: '620px', margin: '0 auto', lineHeight: 1.6, position: 'relative' }}>
          Profitez de nos remises exceptionnelles sur une sélection de produits de parapharmacie et soins corporels.
        </p>

        {!loading && !error && products.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '28px',
              position: 'relative',
            }}
          >
            {[
              { label: 'Produits en promo', value: stats.count },
              { label: 'Remise maximale', value: `-${stats.maxDiscount}%` },
              { label: 'Économie cumulée', value: `${stats.totalSavings.toFixed(0)} MAD` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 22px',
                  backdropFilter: 'blur(4px)',
                  minWidth: '150px',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar: category filters + sort */}
      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: activeCategory === cat ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                  background: activeCategory === cat ? 'linear-gradient(135deg, var(--primary), #45a049)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === cat ? '0 4px 15px rgba(76, 175, 80, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.target.style.borderColor = 'var(--border-light)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-light)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text)',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      <h2 style={{ marginBottom: '24px', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
        Nos Meilleures Offres
        {!loading && !error && visibleProducts.length > 0 && (
          <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1rem', marginLeft: '10px' }}>
            ({visibleProducts.length} produit{visibleProducts.length > 1 ? 's' : ''})
          </span>
        )}
      </h2>

      {loading ? (
        <div className="grid-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ aspectRatio: 1, background: 'var(--bg-subtle)' }} className="skeleton-pulse" />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton-pulse" style={{ height: '10px', width: '40%', borderRadius: '4px' }} />
                <div className="skeleton-pulse" style={{ height: '14px', width: '90%', borderRadius: '4px' }} />
                <div className="skeleton-pulse" style={{ height: '18px', width: '50%', borderRadius: '4px', marginTop: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center" style={{ 
          padding: '80px 40px', 
          border: '2px dashed var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>{error}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Merci de réessayer dans quelques instants.</p>
        </div>
      ) : visibleProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div style={{ padding: '60px 40px', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Aucune offre dans cette catégorie</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px', lineHeight: 1.5 }}>
            Essayez une autre catégorie ou consultez toutes nos offres.
          </p>
          <button 
            onClick={() => setActiveCategory('Tous')} 
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            }}
          >
            Voir toutes les promotions
          </button>
        </div>
      ) : (
        <div style={{ padding: '60px 40px', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏷️</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Aucune promotion active</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px', lineHeight: 1.5 }}>
            Revenez bientôt pour découvrir nos prochaines offres spéciales !
          </p>
          <Link 
            to="/products" 
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            }}
          >
            Parcourir notre catalogue
          </Link>
        </div>
      )}
    </div>
  );
}
