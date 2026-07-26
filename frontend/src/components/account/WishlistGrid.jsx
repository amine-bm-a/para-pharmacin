import React from 'react';
import { Heart, ShoppingCart, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const WishlistGrid = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'La Roche-Posay Lipikar Baume AP+',
      brand: 'La Roche-Posay',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
      price: 189,
      originalPrice: 220,
      inStock: true,
      addedDate: '2024-01-10',
    },
    {
      id: 2,
      name: 'Vichy Mineral 89 Serum',
      brand: 'Vichy',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
      price: 245,
      originalPrice: 290,
      inStock: true,
      addedDate: '2024-01-08',
    },
    {
      id: 3,
      name: 'Bioderma Sensibio H2O',
      brand: 'Bioderma',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
      price: 145,
      originalPrice: 165,
      inStock: false,
      addedDate: '2024-01-05',
    },
    {
      id: 4,
      name: 'CeraVe Hydrating Cleanser',
      brand: 'CeraVe',
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
      price: 175,
      originalPrice: 200,
      inStock: true,
      addedDate: '2024-01-03',
    },
    {
      id: 5,
      name: 'Avene Cleanance',
      brand: 'Avene',
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=400&q=80',
      price: 165,
      originalPrice: 190,
      inStock: true,
      addedDate: '2024-01-01',
    },
    {
      id: 6,
      name: 'Nuxe Huile Prodigieuse',
      brand: 'Nuxe',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
      price: 210,
      originalPrice: 245,
      inStock: true,
      addedDate: '2023-12-28',
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
            My Wishlist
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            {wishlistItems.length} items saved
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
          Clear All
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={{
          padding: '80px 40px',
          textAlign: 'center',
          borderRadius: 16,
          background: '#F8F9FA',
          border: '2px dashed #E8E8E8',
        }}>
          <Heart size={64} style={{ color: '#E8E8E8', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
            Your wishlist is empty
          </h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
            Save products you love to keep track of them
          </p>
          <button style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {wishlistItems.map((item) => (
            <div
              key={item.id}
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
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
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
                  <Heart size={18} style={{ color: '#DC2626', fill: '#DC2626' }} />
                </button>
                {!item.inStock && (
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}>
                    <AlertCircle size={14} />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  {item.brand}
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
                  {item.name}
                </h3>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#2E7D5B' }}>
                    DH {item.price}
                  </span>
                  {item.originalPrice && (
                    <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through' }}>
                      DH {item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  {item.inStock ? (
                    <CheckCircle size={14} style={{ color: '#2E7D5B' }} />
                  ) : (
                    <AlertCircle size={14} style={{ color: '#DC2626' }} />
                  )}
                  <span style={{ fontSize: 12, color: '#666' }}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    disabled={!item.inStock}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 8,
                      border: 'none',
                      background: item.inStock
                        ? 'linear-gradient(135deg, #2E7D5B, #8FAF9B)'
                        : '#E8E8E8',
                      color: item.inStock ? 'white' : '#999',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: item.inStock ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (item.inStock) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.inStock) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>
                  
                  <button style={{
                    width: 40,
                    padding: '10px',
                    borderRadius: 8,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    color: '#DC2626',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEF2F2';
                    e.currentTarget.style.borderColor = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#E8E8E8';
                  }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Added Date */}
                <div style={{ fontSize: 11, color: '#999', marginTop: 12, textAlign: 'center' }}>
                  Added on {item.addedDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistGrid;
