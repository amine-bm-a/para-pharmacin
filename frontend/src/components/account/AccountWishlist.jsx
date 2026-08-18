import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../ProductCard';

export default function AccountWishlist() {
  const { wishlist: wishlistItems, loading, removeFromWishlist } = useWishlist();

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        Chargement de vos favoris...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '2.2rem' }}>🤍</span>
          <span>Ma Wishlist</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Retrouvez ici tous les produits que vous avez sauvegardés pour plus tard
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🤍</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Votre wishlist est vide</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto 32px' }}>
            Parcourez nos produits et cliquez sur le cœur pour ajouter vos favoris ici.
          </p>
          <Link 
            to="/products" 
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
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
            🛍️ Parcourir nos produits
          </Link>

          {/* Tips */}
          <div style={{ 
            marginTop: '48px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            textAlign: 'center',
            maxWidth: '650px',
            margin: '48px auto 0'
          }}>
            {[
              { icon: '❤️', title: 'Sauvegardez', desc: 'Ajoutez vos produits favoris' },
              { icon: '🔔', title: 'Soyez alerté', desc: 'Recevez les baisses de prix' },
              { icon: '🛒', title: 'Commandez vite', desc: 'Ajoutez au panier en 1 clic' }
            ].map((tip, idx) => (
              <div key={idx} style={{
                padding: '24px 20px',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tip.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{tip.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Wishlist Grid */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {wishlistItems.map((product) => (
            <div key={product.id} style={{ minHeight: '340px' }}>
              <ProductCard 
                product={product} 
                onWishlistToggle={handleRemoveFromWishlist}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
