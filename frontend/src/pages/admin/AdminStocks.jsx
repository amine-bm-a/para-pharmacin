import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminStocks() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchStocks = async (status = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/stocks', { params: status ? { status } : {} });
      if (res.data.success) {
        setProducts(res.data.products);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching stocks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks(statusFilter);
  }, [statusFilter]);

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditValue(p.stock);
  };

  const handleSaveStock = async (id) => {
    try {
      const res = await axios.put(`/admin/stocks/${id}`, { stock: editValue });
      if (res.data.success) {
        setEditingId(null);
        fetchStocks(statusFilter);
      }
    } catch (err) {
      console.error('Error updating stock', err);
    }
  };

  const stockBadge = (stock) => {
    if (stock === 0) return <span className="badge badge-danger">Épuisé</span>;
    if (stock <= 10) return <span className="badge badge-warning">Faible</span>;
    return <span className="badge badge-success">OK</span>;
  };

  if (loading && !summary) return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des stocks...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>Stocks</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>Suivez et ajustez les niveaux de stock de vos produits</p>
        </div>
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>📦</div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total produits</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{summary.total}</div>
            </div>
          </div>
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>⚠️</div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Stock faible (≤10)</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{summary.low_stock}</div>
            </div>
          </div>
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>🚫</div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Épuisés</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{summary.out_of_stock}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Inventaire</h3>
          <select 
            style={{ 
              width: '200px', 
              height: '42px', 
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-light)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text)',
              background: 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.boxShadow = 'none';
            }}
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="low">Stock faible</option>
            <option value="out">Épuisé</option>
            <option value="ok">Stock normal</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Produit</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Catégorie</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Marque</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Stock</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Statut</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p, index) => (
                  <tr 
                    key={p.id}
                    style={{ 
                      borderBottom: index < products.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} 
                        />
                        <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{p.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.brand}</td>
                    <td style={{ padding: '16px' }}>
                      {editingId === p.id ? (
                        <input
                          type="number"
                          min="0"
                          style={{ 
                            width: '90px', 
                            height: '38px', 
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary)',
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        <strong style={{ 
                          color: p.stock === 0 ? 'var(--danger)' : p.stock <= 10 ? 'var(--warning)' : 'var(--primary)',
                          fontSize: '0.95rem'
                        }}>{p.stock}</strong>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {p.stock === 0 ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--danger-light)',
                          color: 'var(--danger)'
                        }}>Épuisé</span>
                      ) : p.stock <= 10 ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--warning-light)',
                          color: 'var(--warning)'
                        }}>Faible</span>
                      ) : (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--success-light)',
                          color: 'var(--success)'
                        }}>OK</span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {editingId === p.id ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleSaveStock(p.id)} 
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '0.8rem', 
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              background: 'linear-gradient(135deg, var(--primary), #45a049)',
                              color: 'white',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >Sauver ✅</button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '0.8rem', 
                              borderRadius: 'var(--radius-md)',
                              border: '2px solid var(--border-light)',
                              background: 'white',
                              color: 'var(--text)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'var(--danger)';
                              e.target.style.color = 'var(--danger)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = 'var(--border-light)';
                              e.target.style.color = 'var(--text)';
                            }}
                          >Annuler</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(p)} 
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.8rem', 
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary)',
                            background: 'white',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, var(--primary), #45a049)';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = 'transparent';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = 'var(--primary)';
                            e.target.style.borderColor = 'var(--primary)';
                          }}
                        >Ajuster ✏️</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Aucun produit trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
