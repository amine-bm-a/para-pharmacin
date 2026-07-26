import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const subtotal = getCartTotal();
  const shipping = subtotal > 150 ? 0 : 20; // Free shipping above 150 MAD
  const total = subtotal + shipping;

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
      {/* Breadcrumbs */}
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
        <span>🏠</span>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Accueil</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Votre panier</span>
      </div>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 800, 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--primary), #45a049)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Votre panier
        <span style={{ 
          fontWeight: 600, 
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          marginLeft: '12px',
          background: 'none',
          WebkitBackgroundClip: 'unset',
          WebkitTextFillColor: 'var(--text-muted)'
        }}>({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})</span>
      </h1>

      {cartItems.length > 0 ? (
        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          {/* Items Table */}
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Articles ({cartItems.length})</h3>
            </div>
            <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  style={{ 
                    display: 'flex', 
                    gap: '20px',
                    padding: '20px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    style={{ 
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <Link 
                        to={`/products/${item.product.slug}`} 
                        style={{ 
                          color: 'var(--text)',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          marginBottom: '4px',
                          display: 'block',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
                      >
                        {item.product.name}
                      </Link>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{item.product.brand}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div className="quantity-selector" style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        border: '2px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        width: '120px'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                          style={{ 
                            width: '36px',
                            height: '36px',
                            border: 'none',
                            background: 'var(--bg-subtle)',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                          onMouseLeave={(e) => e.target.style.background = 'var(--bg-subtle)'}
                        >-</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                          style={{ 
                            width: '36px',
                            height: '36px',
                            border: 'none',
                            background: 'var(--bg-subtle)',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                          onMouseLeave={(e) => e.target.style.background = 'var(--bg-subtle)'}
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)} 
                        style={{ 
                          padding: '8px 16px',
                          background: 'rgba(220, 53, 69, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid var(--danger)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--danger)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                          e.target.style.color = 'var(--danger)';
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    {item.product.discount_price ? (
                      <div>
                        <div style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '1.2rem' }}>
                          {parseFloat(item.product.discount_price).toFixed(2)} MAD
                        </div>
                        <div style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {parseFloat(item.product.price).toFixed(2)} MAD
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
                        {parseFloat(item.product.price).toFixed(2)} MAD
                      </div>
                    )}
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem', marginTop: '4px' }}>
                      Total: {((item.product.discount_price ?? item.product.price) * item.quantity).toFixed(2)} MAD
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)' }}>
              <Link 
                to="/products" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary-light)';
                  e.target.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-subtle)';
                  e.target.style.color = 'var(--text)';
                  e.target.style.transform = 'translateX(-4px)';
                }}
              >
                ← Continuer mes achats
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <aside style={{ 
            background: 'white',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem',
              fontWeight: 800,
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid var(--border-light)',
              color: 'var(--text)'
            }}>
              Résumé de la commande
            </h3>
            
            <div className="summary-row" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px',
              fontSize: '0.95rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Sous-total</span>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{subtotal.toFixed(2)} MAD</span>
            </div>
            
            <div className="summary-row" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px',
              fontSize: '0.95rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Livraison</span>
              <span style={{ 
                fontWeight: 700,
                color: shipping === 0 ? 'var(--primary)' : 'var(--text)',
                fontSize: '1rem'
              }}>
                {shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} MAD`}
              </span>
            </div>

            {shipping > 0 && (
              <div style={{ 
                padding: '12px 16px',
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <span>Ajoutez {(150 - subtotal).toFixed(2)} MAD pour la livraison gratuite !</span>
              </div>
            )}

            <div className="summary-row total" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              paddingTop: '20px',
              borderTop: '2px solid var(--border)',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
              <span style={{ 
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--primary)'
              }}>{total.toFixed(2)} MAD</span>
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary), #45a049)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
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
              🛍️ Passer la commande
            </button>

            {/* Simulated Payment Brands */}
            <div style={{ 
              marginTop: '24px', 
              borderTop: '1px solid var(--border)', 
              paddingTop: '20px', 
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Paiement 100% sécurisé</p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px', 
                fontSize: '1.8rem',
                opacity: 0.8
              }}>
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
                <span title="CMI">💳</span>
                <span title="PayPal">🅿️</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>VISA / Mastercard / CMI / PayPal</p>
            </div>
          </aside>
        </div>
      ) : (
        <div className="text-center" style={{ 
          padding: '100px 40px', 
          border: '2px dashed var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🛒</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>Votre panier est vide</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 32px', fontSize: '1rem', lineHeight: 1.6 }}>
            Vous n'avez pas encore ajouté d'articles à votre panier.<br />
            Découvrez notre catalogue et profitez vos produits préférés.
          </p>
          <Link 
            to="/products" 
            className="btn btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease'
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
            🛍️ Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
}
