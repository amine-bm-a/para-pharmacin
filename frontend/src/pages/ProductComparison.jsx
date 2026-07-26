import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { Link } from 'react-router-dom';

export default function ProductComparison() {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [comparedProducts, setComparedProducts] = useState([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('compared_products') || '[]');
      setComparedProducts(items);
    } catch (e) {
      setComparedProducts([]);
    }
  }, []);

  const handleRemove = (productId) => {
    const updated = comparedProducts.filter(p => p.id !== productId);
    setComparedProducts(updated);
    localStorage.setItem('compared_products', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '40px' }}>
          {t('compare')}
        </h1>

        {comparedProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '24px',
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔄</span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>Aucun produit à comparer</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Ajoutez des produits depuis leur fiche détaillée pour les comparer.</p>
            <Link to="/products" style={{
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              minWidth: '700px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '24px', color: 'var(--text-muted)', width: '250px', fontSize: '0.9rem' }}>Caractéristiques</th>
                  {comparedProducts.map(p => (
                    <th key={p.id} style={{ padding: '24px', verticalAlign: 'top', minWidth: '220px' }}>
                      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
                        <button
                          onClick={() => handleRemove(p.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Retirer</span>
                        </button>
                      </div>
                      <img src={p.image_url || 'https://via.placeholder.com/150'} alt={p.name} style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto 12px'
                      }} />
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 8px 0', textAlign: 'center' }}>{p.name}</h4>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0, textAlign: 'center' }}>
                        {p.discount_price || p.price} DH
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: 'var(--text-main)' }}>Marque</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{p.brand?.name || 'N/A'}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: 'var(--text-main)' }}>Catégorie</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{p.category?.name || 'N/A'}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: 'var(--text-main)' }}>Disponibilité</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '20px 24px' }}>
                      <span style={{
                        color: p.stock > 0 ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}>
                        {p.stock > 0 ? t('inStock') : t('outOfStock')}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700, color: 'var(--text-main)' }}>Note moyenne</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '20px 24px', color: 'var(--text-main)' }}>
                      ⭐ {p.average_rating || 'Pas de note'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '24px' }}></td>
                  {comparedProducts.map(p => (
                    <td key={p.id} style={{ padding: '24px', textAlign: 'center' }}>
                      <button
                        onClick={() => addToCart(p)}
                        disabled={p.stock <= 0}
                        style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.9rem',
                          opacity: p.stock <= 0 ? 0.5 : 1,
                        }}
                      >
                        <ShoppingCart size={16} />
                        <span>Acheter</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
