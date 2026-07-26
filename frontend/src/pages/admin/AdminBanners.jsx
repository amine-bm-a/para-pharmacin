import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [position, setPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/banners');
      if (res.data.success) setBanners(res.data.banners);
    } catch (err) {
      console.error('Error fetching banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setLinkUrl('');
    setPosition(banners.length);
    setIsActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setImageUrl(banner.image_url);
    setLinkUrl(banner.link_url || '');
    setPosition(banner.position);
    setIsActive(!!banner.is_active);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = { title, subtitle, image_url: imageUrl, link_url: linkUrl, position, is_active: isActive };
    try {
      let res;
      if (editingBanner) {
        res = await axios.put(`/admin/banners/${editingBanner.id}`, payload);
      } else {
        res = await axios.post('/admin/banners', payload);
      }
      if (res.data.success) {
        setModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur de validation.');
    }
  };

  const handleDelete = async (banner) => {
    if (window.confirm(`Supprimer la bannière "${banner.title}" ?`)) {
      try {
        const res = await axios.delete(`/admin/banners/${banner.id}`);
        if (res.data.success) fetchBanners();
      } catch (err) {
        console.error('Error deleting banner', err);
      }
    }
  };

  if (loading) return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des bannières...</p>
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
          }}>Bannières</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>Gérez les visuels promotionnels affichés sur la page d'accueil</p>
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
        >+ Ajouter une bannière</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {banners.length > 0 ? (
          banners.map((b) => (
            <div 
              key={b.id} 
              style={{ 
                background: 'white', 
                border: '1px solid var(--border-light)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '16px', height: '160px', background: 'var(--bg-subtle)' }}>
                <img src={b.image_url} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: b.is_active ? 'var(--success-light)' : 'var(--text-muted)',
                  color: b.is_active ? 'var(--success)' : 'white'
                }}>
                  {b.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1rem', color: 'var(--text)' }}>{b.title}</strong>
              {b.subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.4 }}>{b.subtitle}</p>}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 500 }}>Position : {b.position}</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleOpenEdit(b)} 
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary)',
                    background: 'white',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexGrow: 1
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
                  onClick={() => handleDelete(b)} 
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--danger)',
                    background: 'white',
                    color: 'var(--danger)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexGrow: 1
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
            </div>
          ))
        ) : (
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '60px 40px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            gridColumn: '1 / -1'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖼️</div>
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>Aucune bannière créée.</p>
          </div>
        )}
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
            maxWidth: '500px',
            width: '100%',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{editingBanner ? 'Modifier la Bannière' : 'Ajouter une Bannière'}</h2>
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
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>📌</span>
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Sous-titre <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>✏️</span>
                  <input 
                    type="text" 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={subtitle} 
                    onChange={(e) => setSubtitle(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>URL de l'image</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🖼️</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="https://images.unsplash.com/..." 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Lien de redirection <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔗</span>
                  <input 
                    type="text" 
                    placeholder="/promotions" 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={linkUrl} 
                    onChange={(e) => setLinkUrl(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Position d'affichage</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>📍</span>
                  <input 
                    type="number" 
                    min="0" 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)}
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
                  id="banner-active-check" 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                />
                <label htmlFor="banner-active-check" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>Bannière active</label>
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
                >{editingBanner ? 'Sauvegarder' : 'Créer la bannière'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
