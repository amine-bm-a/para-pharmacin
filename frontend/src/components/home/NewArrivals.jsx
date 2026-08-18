import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
import { useLang } from '../../context/LangContext';
import useScrollAnimation from '../../hooks/useScrollAnimation';

export default function NewArrivals() {
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const cached = localStorage.getItem('cached_products');
      if (cached) {
        setProducts(JSON.parse(cached).slice(4, 8));
        setLoading(false);
      }

      try {
        const res = await axios.get('/products');
        if (res.data.success) {
          const allProducts = res.data.products || res.data.data?.data || res.data.data || [];
          localStorage.setItem('cached_products', JSON.stringify(allProducts));
          setProducts(allProducts.slice(4, 8));
        }
      } catch (err) {
        console.error('Error fetching new arrivals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-section section-alt reveal">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div>
            <span className="section-label">{t('newArrivals')}</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-xs)' }}>
              {t('newArrivals')}
            </h2>
            <div style={{ width: '40px', height: '3px', background: 'var(--primary)', marginTop: 'var(--space-xs)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
