import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/brands');
        if (res.data.success) setBrands(res.data.brands);
      } catch (err) {
        console.error('Error fetching brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in" style={{ marginTop: '24px', marginBottom: '60px' }}>
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
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Marques</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Nos Marques</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '1rem', lineHeight: 1.5 }}>
            Découvrez les plus grandes marques de parapharmacie disponibles sur notre boutique
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher une marque..."
            style={{
              width: '280px',
              height: '48px',
              padding: '8px 16px 8px 44px',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--border-light)',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ 
          padding: '100px', 
          textAlign: 'center',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des marques...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {filtered.map((brand) => (
            <Link 
              to={`/products?brand=${encodeURIComponent(brand.name)}`} 
              key={brand.id} 
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              {brand.logo_url ? (
                <img 
                  src={brand.logo_url} 
                  alt={brand.name} 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'contain', 
                    marginBottom: '16px',
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>{brand.name.charAt(0)}</div>
              )}
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '8px' }}>{brand.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{brand.products_count} produit{brand.products_count !== 1 ? 's' : ''}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ 
          padding: '80px 40px', 
          border: '2px dashed var(--border-light)', 
          borderRadius: 'var(--radius-lg)',
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>Aucune marque trouvée</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>Essayez une autre recherche.</p>
        </div>
      )}
    </div>
  );
}
