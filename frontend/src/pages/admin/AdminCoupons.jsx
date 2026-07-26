import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminCoupons() {
  const notif = useNotification();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form fields
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/admin/coupons');
      if (res.data.success) setCoupons(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setType('percent');
    setValue('');
    setMinOrder('0');
    setUsageLimit('');
    setExpiresAt('');
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    setMinOrder(coupon.min_order);
    setUsageLimit(coupon.usage_limit || '');
    setExpiresAt(coupon.expires_at ? coupon.expires_at.split('T')[0] : '');
    setIsActive(coupon.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      code: code.toUpperCase(),
      type,
      value: Number(value),
      min_order: Number(minOrder),
      usage_limit: usageLimit ? Number(usageLimit) : null,
      expires_at: expiresAt || null,
      is_active: isActive
    };
    try {
      if (editingCoupon) {
        const res = await axios.put(`/admin/coupons/${editingCoupon.id}`, data);
        if (res.data.success) {
          notif.success('Coupon modifié avec succès.');
          setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? res.data.data : c));
        }
      } else {
        const res = await axios.post('/admin/coupons', data);
        if (res.data.success) {
          notif.success('Coupon créé avec succès.');
          setCoupons(prev => [...prev, res.data.data]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      notif.error('Une erreur s\'est produite.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce coupon ?')) return;
    try {
      const res = await axios.delete(`/admin/coupons/${id}`);
      if (res.data.success) {
        notif.success('Coupon supprimé.');
        setCoupons(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      notif.error('Erreur lors de la suppression.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tag size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Gestion des Coupons & Offres
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
          <span>Créer un coupon</span>
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
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Code</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Valeur</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Minimum Achat</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Utilisations</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Date d'expiration</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--primary)' }}>{coupon.code}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {coupon.type === 'percent' ? <Percent size={16} /> : <DollarSign size={16} />}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                    {coupon.value} {coupon.type === 'percent' ? '%' : 'DH'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>{coupon.min_order} DH</td>
                  <td style={{ padding: '16px 24px' }}>
                    {coupon.used_count} / {coupon.usage_limit || '∞'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Aucune'}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(coupon)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: '16px' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
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
            width: '480px',
            padding: '30px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>
              {editingCoupon ? 'Modifier le coupon' : 'Créer un nouveau coupon'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Code Promo
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    placeholder="E.g. SOLDE20"
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Type de remise
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
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
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (DH)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Valeur
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                    min="0"
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Achat minimal (DH)
                  </label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={e => setMinOrder(e.target.value)}
                    min="0"
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Limite d'utilisation
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    placeholder="Illimité si vide"
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
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
              </div>

              <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Actif (disponible à l'utilisation)
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
