import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { t } = useLang();
  const { wishlist } = useWishlist();

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
          }}>
            <Heart size={28} color="white" fill="white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              margin: 0,
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('wishlist')}
            </h1>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '100px 40px',
            background: 'white',
            border: '2px dashed var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>❤️</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>Votre liste est vide</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Enregistrez vos produits préférés ici pour les retrouver facilement.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
