import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [promoRes, catRes] = await Promise.all([
        axios.get('/admin/promotions'),
        axios.get('/categories'),
      ]);
      if (promoRes.data.success) setPromotions(promoRes.data.promotions);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Error fetching promotions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setTitle('');
    setDescription('');
    setCategoryId('');
    setDiscountPercent('');
    setStartsAt('');
    setEndsAt('');
    setIsActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setTitle(promo.title);
    setDescription(promo.description || '');
    setCategoryId(promo.category_id || '');
    setDiscountPercent(promo.discount_percent);
    setStartsAt(promo.starts_at?.slice(0, 10) || '');
    setEndsAt(promo.ends_at?.slice(0, 10) || '');
    setIsActive(!!promo.is_active);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = {
      title,
      description,
      category_id: categoryId || null,
      discount_percent: discountPercent,
      starts_at: startsAt,
      ends_at: endsAt,
      is_active: isActive,
    };
    try {
      let res;
      if (editingPromo) {
        res = await axios.put(`/admin/promotions/${editingPromo.id}`, payload);
      } else {
        res = await axios.post('/admin/promotions', payload);
      }
      if (res.data.success) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur de validation.');
    }
  };

  const handleDelete = async (promo) => {
    if (window.confirm(`Supprimer la promotion "${promo.title}" ?`)) {
      try {
        const res = await axios.delete(`/admin/promotions/${promo.id}`);
        if (res.data.success) fetchData();
      } catch (err) {
        console.error('Error deleting promotion', err);
      }
    }
  };

  const isExpired = (promo) => new Date(promo.ends_at) < new Date();

  if (loading) return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des promotions...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>Promotions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>Créez et planifiez des offres promotionnelles par catégorie</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white',
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
        >+ Créer une promotion</button>
      </div>

      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Titre</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Catégorie</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Remise</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Période</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Statut</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length > 0 ? (
                promotions.map((p, index) => (
                  <tr 
                    key={p.id}
                    style={{ 
                      borderBottom: index < promotions.length - 1 ? '1px solid var(--border-light)' : 'none',
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
                      <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{p.title}</strong>
                      {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{p.description}</div>}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.category?.name || 'Toutes catégories'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'var(--danger-light)',
                        color: 'var(--danger)'
                      }}>-{p.discount_percent}%</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(p.starts_at).toLocaleDateString('fr-FR')} → {new Date(p.ends_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {!p.is_active ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--text-muted)',
                          color: 'white'
                        }}>Désactivée</span>
                      ) : isExpired(p) ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--danger-light)',
                          color: 'var(--danger)'
                        }}>Expirée</span>
                      ) : (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--success-light)',
                          color: 'var(--success)'
                        }}>Active</span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleOpenEdit(p)} 
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--primary)',
                            background: 'white',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
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
                        >Éditer ✏️</button>
                        <button 
                          onClick={() => handleDelete(p)} 
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--danger)',
                            background: 'white',
                            color: 'var(--danger)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--danger)';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = 'transparent';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = 'var(--danger)';
                            e.target.style.borderColor = 'var(--danger)';
                          }}
                        >Supprimer 🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Aucune promotion créée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setModalOpen(false)}>
          <div style={{
            maxWidth: '550px',
            width: '100%',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{editingPromo ? 'Modifier la Promotion' : 'Créer une Promotion'}</h2>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--danger-light)';
                  e.target.style.color = 'var(--danger)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-subtle)';
                  e.target.style.color = 'var(--text)';
                }}
              >&times;</button>
            </div>
            {formError && (
              <div style={{ 
                padding: '12px 16px', 
                background: 'var(--danger-light)', 
                color: 'var(--danger)', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>{formError}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Titre</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>📝</span>
                  <input 
                    type="text" 
                    required 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Description <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                <textarea 
                  rows="2" 
                  style={{ 
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-light)',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-light)';
                    e.target.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Catégorie <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— toutes si vide</span></label>
                  <select 
                    style={{ 
                      width: '100%',
                      height: '48px',
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
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Toutes catégories</option>
                    {categories.map((c) => (
                      <option value={c.id} key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Remise (%)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>%</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="90" 
                      required 
                      style={{ 
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--border-light)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={discountPercent} 
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Date de début</label>
                  <input 
                    type="date" 
                    required 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={startsAt} 
                    onChange={(e) => setStartsAt(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Date de fin</label>
                  <input 
                    type="date" 
                    required 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={endsAt} 
                    onChange={(e) => setEndsAt(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', marginBottom: '24px' }}>
                <input 
                  type="checkbox" 
                  id="active-check" 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                />
                <label htmlFor="active-check" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>Promotion active</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-light)',
                    background: 'white',
                    color: 'var(--text)',
                    fontWeight: 700,
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
                <button 
                  type="submit" 
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    color: 'white',
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
                >{editingPromo ? 'Sauvegarder' : 'Créer la promotion'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
