import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Save, Edit2, AlertCircle, Search, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function PharmacienStock() {
  const notif = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stockVal, setStockVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/pharmacien/stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (e) {
      console.error(e);
      notif.error('Erreur lors du chargement des stocks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setStockVal(String(p.stock));
  };

  const handleSave = async (id) => {
    const val = Number(stockVal);
    if (isNaN(val) || val < 0) {
      notif.error('Veuillez saisir un nombre valide.');
      return;
    }
    try {
      const res = await axios.put(`/pharmacien/stock/${id}`, { stock: val });
      if (res.data.success) {
        notif.success('Stock mis à jour avec succès.');
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: val } : p));
        setEditingId(null);
      }
    } catch (e) {
      notif.error('Erreur lors de la mise à jour.');
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const brand = p.brand?.name || '';
    const cat = p.category?.name || '';
    const query = searchQuery.toLowerCase();

    return name.toLowerCase().includes(query) ||
           brand.toLowerCase().includes(query) ||
           cat.toLowerCase().includes(query);
  });

  // Calculate metrics
  const totalItems = products.length;
  const outOfStockItems = products.filter(p => p.stock === 0).length;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="fade-in">
      {/* Premium Welcome Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>📦</span>
            <span>Gestion du Stock</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Suivez, modifiez et ajustez les niveaux de stock des médicaments et produits.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher un produit, marque..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-light)',
              background: 'var(--bg-subtle)',
              color: 'var(--text)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Products */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Package size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Produits</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>{totalItems}</div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Stock Faible (≤5)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{lowStockItems}</div>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Rupture de Stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>{outOfStockItems}</div>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '120px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⏳</div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des stocks...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)'
        }}>
          <Package size={56} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Aucun produit trouvé</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Aucun produit ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{
                  background: 'var(--bg-subtle)',
                  borderBottom: '1px solid var(--border-light)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <th style={{ padding: '16px 24px' }}>Produit</th>
                  <th style={{ padding: '16px 24px' }}>Marque</th>
                  <th style={{ padding: '16px 24px' }}>Catégorie</th>
                  <th style={{ padding: '16px 24px' }}>Stock disponible</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isLow = p.stock > 0 && p.stock <= 5;
                  const isOut = p.stock === 0;
                  const isEditing = editingId === p.id;
                  
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        color: 'var(--text)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px', height: '40px',
                            background: p.image_url ? 'none' : 'var(--bg-subtle)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border-light)'
                          }}>
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                            ) : (
                              <span style={{ fontSize: '1.2rem' }}>💊</span>
                            )}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {p.brand?.name || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>N/A</span>}
                      </td>
                      <td style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {p.category?.name || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>N/A</span>}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            value={stockVal}
                            onChange={e => setStockVal(e.target.value)}
                            style={{
                              width: '90px',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--primary)',
                              background: 'var(--bg-subtle)',
                              color: 'var(--text)',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          />
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isOut ? 'rgba(239, 68, 68, 0.1)' : isLow ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}>
                            {isOut && <AlertCircle size={14} />}
                            {isLow && <AlertCircle size={14} />}
                            {isOut ? 'Épuisé (0 unités)' : `${p.stock} unités`}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(p.id)}
                            style={{
                              background: 'var(--primary)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                            }}
                          >
                            <Save size={14} />
                            <span>Sauver</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(p)}
                            style={{
                              background: 'var(--bg-subtle)',
                              border: '1px solid var(--border-light)',
                              color: 'var(--text-muted)',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                          >
                            <Edit2 size={13} />
                            <span>Modifier</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
