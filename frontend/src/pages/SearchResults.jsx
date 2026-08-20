import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

export default function SearchResults() {
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
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Résultats de recherche
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 600 }}>
          {query ? `Recherche pour "${query}"` : 'Tous les produits'}
        </p>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 30px', 
            background: 'white', 
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: 'var(--text-muted)'
            }}>
              <Search size={36} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>
              Aucun résultat pour "{query}"
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Désolé, nous n'avons trouvé aucun produit correspondant à votre recherche. Vérifiez l'orthographe ou essayez un mot-clé plus général.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link 
                to="/products"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', background: 'var(--primary)', color: 'white',
                  borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none'
                }}
              >
                <ShoppingBag size={18} /> Voir tout le catalogue <ArrowRight size={16} />
              </Link>
            </div>
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
