import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';

export default function SearchResults() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/products?search=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setProducts(res.data.products || res.data.data?.data || res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ padding: '60px 0', minHeight: '60vh', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '30px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Résultats de recherche pour : 
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '-20px', marginBottom: '30px', fontWeight: 600 }}>
          "{query}"
        </p>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px', 
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{t('loading')}</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px', 
            background: 'white', 
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>🔍</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>{t('noResults')}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Essayez d'autres mots-clés ou parcourez notre catalogue.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
