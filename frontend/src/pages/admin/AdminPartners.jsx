import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { Handshake, Plus, Trash2, Edit3, Image as ImageIcon, ArrowUpDown } from 'lucide-react';

export default function AdminPartners() {
  const notif = useNotification();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [position, setPosition] = useState(0);
  const [formError, setFormError] = useState('');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/partners/admin');
      if (res.data.success) {
        setPartners(res.data.partners || []);
      }
    } catch (err) {
      console.error('Error fetching partners', err);
      if (notif) notif.error('Erreur lors du chargement des partenaires.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setName('');
    setLogoUrl('');
    setPosition(partners.length);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (part) => {
    setEditingPartner(part);
    setName(part.name);
    setLogoUrl(part.logo_url);
    setPosition(part.position || 0);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name,
      logo_url: logoUrl,
      position: parseInt(position, 10) || 0
    };

    try {
      let res;
      if (editingPartner) {
        res = await axios.put(`/admin/partners/${editingPartner.id}`, payload);
      } else {
        res = await axios.post('/admin/partners', payload);
      }

      if (res.data.success) {
        if (notif) notif.success(editingPartner ? 'Partenaire modifié !' : 'Partenaire ajouté !');
        setModalOpen(false);
        fetchPartners();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const handleDelete = async (part) => {
    if (window.confirm(`Supprimer le partenaire "${part.name}" ?`)) {
      try {
        const res = await axios.delete(`/admin/partners/${part.id}`);
        if (res.data.success) {
          if (notif) notif.success('Partenaire supprimé avec succès.');
          fetchPartners();
        }
      } catch (err) {
        if (notif) notif.error("Erreur lors de la suppression.");
      }
    }
  };

  // Filter & Search
  const filteredPartners = partners.filter(part => {
    return part.name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      margin: '30px'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des partenaires...</p>
    </div>
  );

  return (
    <div style={{ padding: '30px' }} className="fade-in">
      {/* Header card */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Handshake size={28} color="var(--primary)" />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Partenaires & Marques
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Gérez les logos des marques partenaires affichées sur la page d'accueil.
            </p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd} 
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <Plus size={18} />
          <span>Ajouter un partenaire</span>
        </button>
      </div>

      {/* Controls: Search */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <input 
          type="text" 
          placeholder="Rechercher par nom de marque..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            width: '100%',
            maxWidth: '300px',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* Partners Grid / Table */}
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aperçu du Logo</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nom de la marque</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ordre d'affichage</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((part) => (
                  <tr key={part.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        width: '100px',
                        height: '50px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px'
                      }}>
                        {part.logo_url ? (
                          <img src={part.logo_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                          <ImageIcon size={20} color="#9ca3af" />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 650, color: 'var(--text)', fontSize: '0.95rem' }}>
                      {part.name}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowUpDown size={14} color="var(--primary)" />
                        <span style={{ fontWeight: 600 }}>Position {part.position || 0}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(part)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                        >
                          <Edit3 size={14} />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDelete(part)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: 'white',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                        >
                          <Trash2 size={14} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun partenaire trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
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
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
                {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >&times;</button>
            </div>

            {formError && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fee2e2', 
                color: '#ef4444', 
                borderRadius: '8px', 
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                  Nom de la marque
                </label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ex: Bioderma, Vichy, Nuxe..."
                  style={{ 
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                  URL du Logo de la marque
                </label>
                <input 
                  type="text" 
                  required 
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ 
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                  Position d'affichage
                </label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  placeholder="0, 1, 2..."
                  style={{ 
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'white',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  {editingPartner ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
