import { Heart, ShoppingCart, Star } from 'lucide-react';

const RecommendedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'La Roche-Posay Lipikar Baume AP+',
      brand: 'La Roche-Posay',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
      price: 189,
      originalPrice: 220,
      rating: 4.8,
      reviews: 245,
      discount: 14,
      inStock: true,
    },
    {
      id: 2,
      name: 'Vichy Mineral 89 Serum',
      brand: 'Vichy',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
      price: 245,
      originalPrice: 290,
      rating: 4.9,
      reviews: 312,
      discount: 16,
      inStock: true,
    },
    {
      id: 3,
      name: 'Bioderma Sensibio H2O',
      brand: 'Bioderma',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
      price: 145,
      originalPrice: 165,
      rating: 4.7,
      reviews: 189,
      discount: 12,
      inStock: true,
    },
    {
      id: 4,
      name: 'CeraVe Hydrating Cleanser',
      brand: 'CeraVe',
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
      price: 175,
      originalPrice: 200,
      rating: 4.6,
      reviews: 156,
      discount: 13,
      inStock: false,
    },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
            Recommended for You
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            Based on your previous purchases and preferences
          </p>
        </div>
        <button style={{
          padding: '10px 20px',
          borderRadius: 10,
          border: '1px solid #E8E8E8',
          background: 'white',
          color: '#666',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F6F1EB';
          e.currentTarget.style.borderColor = '#2E7D5B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#E8E8E8';
        }}
        >
          View All
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              borderRadius: 16,
              border: '1px solid #E8E8E8',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              background: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = '#2E7D5B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E8E8E8';
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', height: 200, background: '#F8F9FA' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {product.discount && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'linear-gradient(135deg, #C9A96A, #E8D5A3)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  -{product.discount}%
                </div>
              )}
              <button
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEF2F2';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                <Heart size={18} style={{ color: '#DC2626' }} />
              </button>
              {!product.inStock && (
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                {product.brand}
              </div>
              <h3 style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1A1A1A',
                margin: '0 0 8px 0',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {product.name}
              </h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Star size={14} style={{ color: '#C9A96A', fill: '#C9A96A' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                    {product.rating}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: '#999' }}>
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#2E7D5B' }}>
                  DH {product.price}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through' }}>
                    DH {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Actions */}
              <button
                disabled={!product.inStock}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  background: product.inStock
                    ? 'linear-gradient(135deg, #2E7D5B, #8FAF9B)'
                    : '#E8E8E8',
                  color: product.inStock ? 'white' : '#999',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (product.inStock) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.inStock) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <ShoppingCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
