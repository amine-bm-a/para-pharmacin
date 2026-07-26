import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.related_products || []);
        }
      } catch (err) {
        console.error("Error fetching product details", err);
        setError("Impossible de charger les détails du produit.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to register page with a message
      navigate('/register', {
        state: {
          message: 'Veuillez créer un compte pour commander des produits.',
          redirectTo: `/products/${slug}`
        }
      });
      return;
    }
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewSuccess('');
    setReviewError('');
    try {
      const res = await axios.post(`/products/${product.id}/reviews`, {
        rating: newRating,
        comment: newComment
      });

      if (res.data.success) {
        setReviewSuccess(res.data.message);
        // Add new review to current state product reviews
        setProduct(prev => ({
          ...prev,
          reviews: [res.data.review, ...prev.reviews]
        }));
        setNewComment('');
        setNewRating(5);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Erreur lors de la soumission de l'avis.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="container text-center" style={{ 
      padding: '100px', 
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement...</p>
    </div>
  );
  if (error || !product) return (
    <div className="container text-center" style={{ 
      padding: '100px', 
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      color: 'var(--danger)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
      <p style={{ fontSize: '1rem', fontWeight: 500 }}>{error || "Produit non trouvé."}</p>
    </div>
  );

  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
      <Helmet>
        <title>{product.name} | Pharmacie Ben Moussa</title>
        <meta
          name="description"
          content={
            (product.description || `Découvrez ${product.name} sur Pharmacie Ben Moussa.`)
              .replace(/\s+/g, ' ')
              .slice(0, 160)
          }
        />
        <meta property="og:title" content={product.name} />
        <meta
          property="og:description"
          content={(product.description || '').replace(/\s+/g, ' ').slice(0, 160)}
        />
        {product.image_url && <meta property="og:image" content={product.image_url} />}
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
      </Helmet>
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
        <Link to="/products" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Produits</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="product-detail-gallery" style={{ 
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ 
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '16px',
            background: 'var(--bg-subtle)'
          }}>
            <img
              src={product.image_url}
              alt={product.name}
              className="main-detail-image"
              style={{ 
                width: '100%',
                height: '400px',
                objectFit: 'contain',
                transition: 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80';
              }}
            />
            {product.discount_price && (
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
              }}>
                -{Math.round((1 - product.discount_price / product.price) * 100)}%
              </div>
            )}
          </div>
          <div className="gallery-thumbnails" style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: 'var(--radius-md)', 
              border: '2px solid var(--primary)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <img src={product.image_url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="product-detail-info" style={{ 
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <span className="detail-brand" style={{ 
            display: 'inline-block',
            padding: '6px 14px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>{product.brand}</span>
          <h1 className="detail-name" style={{ 
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: 1.2,
            color: 'var(--text)'
          }}>{product.name}</h1>
          
          <div className="detail-rating-row" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '12px 16px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.4rem', color: '#FFD700' }}>★</span>
              <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem' }}>{product.average_rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.reviews?.length || 0} avis)</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Réf: {302780 + product.id}</span>
          </div>

          <div className="detail-price-box" style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, var(--primary-light), rgba(76, 175, 80, 0.1))',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px'
          }}>
            {product.discount_price ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <div className="detail-price" style={{ 
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--danger)',
                  lineHeight: 1
                }}>
                  {parseFloat(product.discount_price).toFixed(2)} MAD
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  color: 'var(--text-muted)', 
                  textDecoration: 'line-through',
                  fontWeight: 500
                }}>
                  {parseFloat(product.price).toFixed(2)} MAD
                </div>
              </div>
            ) : (
              <div className="detail-price" style={{ 
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--primary)',
                lineHeight: 1
              }}>
                {parseFloat(product.price).toFixed(2)} MAD
              </div>
            )}
            <div className="detail-price-desc" style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}>Prix TTC, hors frais de livraison</div>
          </div>

          {product.stock > 0 ? (
            <>
              <div className="quantity-add-row" style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '20px'
              }}>
                <div className="quantity-selector" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  width: '140px'
                }}>
                  <button 
                    onClick={handleDecrement} 
                    className="quantity-btn"
                    style={{ 
                      width: '44px',
                      height: '48px',
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--bg-subtle)'}
                  >-</button>
                  <span className="quantity-value" style={{ 
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>{quantity}</span>
                  <button 
                    onClick={handleIncrement} 
                    className="quantity-btn"
                    style={{ 
                      width: '44px',
                      height: '48px',
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--bg-subtle)'}
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  className="btn btn-primary" 
                  style={{ 
                    flexGrow: 1, 
                    height: '48px',
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontWeight: 700,
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
                  🛒 Ajouter au panier
                </button>
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary)',
                fontWeight: 700,
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🟢</span>
                <span>En stock ({product.stock} disponibles)</span>
              </div>
            </>
          ) : (
            <div style={{ 
              padding: '16px 20px',
              background: 'rgba(220, 53, 69, 0.1)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontWeight: 700,
              fontSize: '1.1rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>🔴</span>
              <span>Rupture de stock</span>
            </div>
          )}

          {/* Core assurances in the mockup */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px', 
            borderTop: '1px solid var(--border)', 
            paddingTop: '24px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚚</div>
              <strong style={{ 
                display: 'block', 
                color: 'var(--text)', 
                marginBottom: '4px',
                fontSize: '0.9rem'
              }}>Livraison rapide</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>24h/48h partout au Maroc</span>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
              <strong style={{ 
                display: 'block', 
                color: 'var(--text)', 
                marginBottom: '4px',
                fontSize: '0.9rem'
              }}>Retour facile</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sous 7 jours</span>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔒</div>
              <strong style={{ 
                display: 'block', 
                color: 'var(--text)', 
                marginBottom: '4px',
                fontSize: '0.9rem'
              }}>Paiement sécurisé</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs" style={{ 
        marginTop: '40px',
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <div className="tab-nav" style={{ 
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-subtle)'
        }}>
          {[
            { id: 'description', label: 'Description', icon: '📝' },
            { id: 'usage', label: 'Conseils d\'utilisation', icon: '💡' },
            { id: 'ingredients', label: 'Ingrédients', icon: '🧪' },
            { id: 'reviews', label: `Avis (${product.reviews?.length || 0})`, icon: '⭐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(76, 175, 80, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content" style={{ padding: '32px' }}>
          {activeTab === 'description' && (
            <div style={{ lineHeight: 1.8, color: 'var(--text)' }}>
              <p>{product.description || "Aucune description disponible pour ce produit."}</p>
            </div>
          )}
          
          {activeTab === 'usage' && (
            <div style={{ lineHeight: 1.8, color: 'var(--text)' }}>
              <p style={{ whiteSpace: 'pre-line' }}>{product.usage_instructions || "Aucun conseil d'utilisation spécifié."}</p>
            </div>
          )}
          
          {activeTab === 'ingredients' && (
            <div style={{ lineHeight: 1.8, color: 'var(--text)' }}>
              <p style={{ wordBreak: 'break-word' }}>{product.ingredients || "Liste des ingrédients non renseignée."}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Review Form */}
              {user ? (
                <form 
                  onSubmit={handleReviewSubmit} 
                  style={{ 
                    border: '1px solid var(--border)', 
                    padding: '24px', 
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)'
                  }}
                >
                  <h4 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 800 }}>✨ Donnez votre avis</h4>
                  {reviewSuccess && (
                    <div style={{ 
                      color: 'var(--primary)', 
                      marginBottom: '16px',
                      padding: '12px 16px',
                      background: 'var(--success-light)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
                    }}>
                      ✓ {reviewSuccess}
                    </div>
                  )}
                  {reviewError && (
                    <div style={{ 
                      color: 'var(--danger)', 
                      marginBottom: '16px',
                      padding: '12px 16px',
                      background: 'var(--danger-light)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)'
                    }}>
                      ✗ {reviewError}
                    </div>
                  )}
                  
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Note :</label>
                    <div className="form-wrapper">
                      <span className="input-icon">⭐</span>
                      <select
                        className="form-control"
                        style={{ width: '100%' }}
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Étoiles</option>
                        <option value="4">⭐⭐⭐⭐ 4 Étoiles</option>
                        <option value="3">⭐⭐⭐ 3 Étoiles</option>
                        <option value="2">⭐⭐ 2 Étoiles</option>
                        <option value="1">⭐ 1 Étoile</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Commentaire :</label>
                    <div className="form-wrapper">
                      <span className="input-icon">💬</span>
                      <textarea
                        rows="4"
                        className="form-control no-icon"
                        style={{ 
                          borderRadius: 'var(--radius-md)', 
                          resize: 'vertical',
                          paddingLeft: '16px'
                        }}
                        placeholder="Partagez votre expérience avec ce produit..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingReview} 
                    className="btn btn-primary"
                    style={{
                      padding: '12px 24px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      cursor: submittingReview ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submittingReview ? "Envoi..." : "📝 Publier l'avis"}
                  </button>
                </form>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  border: '2px dashed var(--border)', 
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  background: 'var(--bg-subtle)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔐</div>
                  <p style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>Veuillez vous connecter pour laisser un avis</p>
                  <Link 
                    to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} 
                    style={{ 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      fontWeight: 700,
                      padding: '10px 20px',
                      background: 'var(--primary-light)',
                      borderRadius: 'var(--radius-md)',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--primary)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--primary-light)';
                      e.target.style.color = 'var(--primary)';
                    }}
                  >
                    Se connecter
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {product.reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border)', 
                        paddingBottom: '20px',
                        padding: '20px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), #81C784)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '1rem'
                          }}>
                            {(rev.user?.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>{rev.user?.name || "Client"}</strong>
                        </div>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          color: 'var(--text-muted)',
                          padding: '4px 12px',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {new Date(rev.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div style={{ 
                        color: '#FFD700', 
                        marginBottom: '12px',
                        fontSize: '1.2rem',
                        letterSpacing: '2px'
                      }}>
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.6 }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ 
          marginTop: '60px',
          padding: '32px',
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ 
            marginBottom: '32px', 
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Produits similaires</h2>
          <div className="grid-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
