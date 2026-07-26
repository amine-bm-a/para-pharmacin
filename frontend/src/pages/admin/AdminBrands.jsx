import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/brands');
      if (res.data.success) setBrands(res.data.brands);
    } catch (err) {
      console.error('Error fetching brands', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName('');
    setLogoUrl('');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setLogoUrl(brand.logo_url || '');
    setDescription(brand.description || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = { name, logo_url: logoUrl, description };
    try {
      let res;
      if (editingBrand) {
        res = await axios.put(`/admin/brands/${editingBrand.id}`, payload);
      } else {
        res = await axios.post('/admin/brands', payload);
      }
      if (res.data.success) {
        setModalOpen(false);
        fetchBrands();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur de validation.');
    }
  };

  const handleDelete = async (brand) => {
    if (brand.products_count > 0) {
      alert(`Impossible de supprimer "${brand.name}" : ${brand.products_count} produit(s) lui sont encore liés.`);
      return;
    }
    if (window.confirm(`Supprimer la marque "${brand.name}" ?`)) {
      try {
        const res = await axios.delete(`/admin/brands/${brand.id}`);
        if (res.data.success) fetchBrands();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des marques...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ 
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
            <span style={{ fontSize: '2.2rem' }}>🏷️</span>
            <span>Marques</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Gérez les marques de produits référencées dans votre catalogue
          </p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
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
          + Ajouter une marque
        </button>
      </div>

      <div style={{ 
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ 
              background: 'var(--bg-subtle)',
              borderBottom: '2px solid var(--primary)'
            }}>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Marque</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Description</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Produits liés</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((b) => (
                <tr 
                  key={b.id}
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                      ) : (
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: 'var(--radius-md)', 
                          background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 800, 
                          color: 'white',
                          fontSize: '1.1rem'
                        }}>
                          {b.name.charAt(0)}
                        </div>
                      )}
                      <strong style={{ fontSize: '0.95rem' }}>{b.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.description || '—'}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: b.products_count > 0 ? 'var(--success-light)' : 'hsl(38, 80%, 92%)',
                      color: b.products_count > 0 ? 'var(--success)' : 'hsl(38, 80%, 40%)'
                    }}>{b.products_count ?? 0} produit(s)</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenEdit(b)} 
                        style={{ 
                          padding: '6px 14px', 
                          fontSize: '0.8rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--primary)',
                          background: 'var(--bg-card)',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--primary)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--bg-card)';
                          e.target.style.color = 'var(--primary)';
                        }}
                      >Éditer ✏️</button>
                      <button 
                        onClick={() => handleDelete(b)} 
                        style={{ 
                          padding: '6px 14px', 
                          fontSize: '0.8rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--danger)',
                          background: 'var(--bg-card)',
                          color: b.products_count > 0 ? 'var(--text-muted)' : 'var(--danger)',
                          fontWeight: 600,
                          cursor: b.products_count > 0 ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: b.products_count > 0 ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (b.products_count === 0) {
                            e.target.style.background = 'var(--danger)';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--bg-card)';
                          e.target.style.color = b.products_count > 0 ? 'var(--text-muted)' : 'var(--danger)';
                        }}
                        disabled={b.products_count > 0}
                      >Supprimer 🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ 
                  padding: '80px 40px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>🏷️</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Aucune marque pour le moment</div>
                  <div style={{ fontSize: '0.9rem' }}>Ajoutez votre première marque pour commencer</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '2px solid var(--primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingBrand ? '✏️ Modifier la Marque' : '➕ Ajouter une Marque'}</h2>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--border-light)',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--danger)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--border-light)';
                  e.target.style.color = 'var(--text-muted)';
                }}
              >&times;</button>
            </div>
            <div style={{ padding: '32px' }}>
              {formError && <p style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>{formError}</p>}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Nom de la Marque</label>
                  <div className="form-wrapper">
                    <span className="input-icon">🏷️</span>
                    <input type="text" required className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>URL du Logo <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                  <div className="form-wrapper">
                    <span className="input-icon">🔗</span>
                    <input type="text" className="form-control" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Description <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                  <div className="form-wrapper">
                    <span className="input-icon">📝</span>
                    <textarea rows="3" className="form-control no-icon" style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', paddingLeft: '16px' }} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)} 
                    style={{ 
                      padding: '10px 24px', 
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--danger)';
                      e.target.style.color = 'var(--danger)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.color = 'var(--text-muted)';
                    }}
                  >Annuler</button>
                  <button 
                    type="submit" 
                    style={{ 
                      padding: '10px 24px', 
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--primary), #45a049)',
                      border: 'none',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
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
                  >{editingBrand ? '💾 Sauvegarder' : '➕ Créer la marque'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
