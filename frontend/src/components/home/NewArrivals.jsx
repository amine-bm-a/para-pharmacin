import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
import { useLang } from '../../context/LangContext';
import useScrollAnimation from '../../hooks/useScrollAnimation';

export default function NewArrivals() {
  const { t } = useLang();
  const sectionRef = useScrollAnimation('-left');
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
    <section ref={sectionRef} style={{ padding: '60px 0', background: 'var(--bg-light)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {t('newArrivals')}
            </h2>
            <div style={{ width: '40px', height: '3px', background: 'var(--primary)', marginTop: '8px' }} />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
