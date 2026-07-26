import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';

export default function Nouveautes() {
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get('/products?sort=newest');
        if (res.data.success) {
          const allProducts = res.data.products || res.data.data?.data || res.data.data || [];
          setProducts(allProducts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
            {t('newArrivals')}
          </h1>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', marginTop: '12px' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t('loading')}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-light)', borderRadius: '16px' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{t('noResults')}</p>
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
