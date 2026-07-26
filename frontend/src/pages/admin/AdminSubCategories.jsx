import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Check, X, Layers } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminSubCategories() {
  const notif = useNotification();
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get('/admin/subcategories');
      if (res.data.success) setSubcategories(res.data.data);
      
      const catRes = await axios.get('/categories');
      setCategories(catRes.data.data || catRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingSub(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSub(sub);
    setName(sub.name);
    setCategoryId(sub.category_id);
    setIsActive(sub.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, category_id: categoryId, is_active: isActive };
    try {
      if (editingSub) {
        const res = await axios.put(`/admin/subcategories/${editingSub.id}`, data);
        if (res.data.success) {
          notif.success('Sous-catégorie modifiée avec succès.');
          setSubcategories(prev => prev.map(s => s.id === editingSub.id ? res.data.data : s));
        }
      } else {
        const res = await axios.post('/admin/subcategories', data);
        if (res.data.success) {
          notif.success('Sous-catégorie créée avec succès.');
          setSubcategories(prev => [...prev, res.data.data]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      notif.error('Une erreur s\'est produite.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette sous-catégorie ?')) return;
    try {
      const res = await axios.delete(`/admin/subcategories/${id}`);
      if (res.data.success) {
        notif.success('Sous-catégorie supprimée.');
        setSubcategories(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      notif.error('Erreur lors de la suppression.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Gestion des Sous-Catégories
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          <span>Ajouter</span>
        </button>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Nom</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Catégorie parente</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Statut</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-main)' }}>{sub.name}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{sub.category?.name || 'N/A'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: sub.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: sub.is_active ? '#10b981' : '#ef4444',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      {sub.is_active ? <Check size={12} /> : <X size={12} />}
                      <span>{sub.is_active ? 'Actif' : 'Inactif'}</span>
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: '16px' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simple Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            width: '450px',
            padding: '30px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>
              {editingSub ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  Nom de la sous-catégorie
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  Catégorie parente
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Actif
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
