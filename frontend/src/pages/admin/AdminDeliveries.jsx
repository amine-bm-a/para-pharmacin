import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminDeliveries() {
  const notif = useNotification();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);

  // Form fields
  const [carrier, setCarrier] = useState('Standard');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState('pending');
  const [cost, setCost] = useState('0');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get('/admin/deliveries');
      if (res.data.success) {
        setDeliveries(res.data.data.data || res.data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleOpenEdit = (delivery) => {
    setEditingDelivery(delivery);
    setCarrier(delivery.carrier);
    setTrackingNumber(delivery.tracking_number || '');
    setStatus(delivery.status);
    setCost(delivery.cost);
    setAddress(delivery.address);
    setCity(delivery.city);
    setZip(delivery.zip || '');
    setNotes(delivery.notes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      carrier, tracking_number: trackingNumber, status,
      cost: Number(cost), address, city, zip, notes
    };
    try {
      const res = await axios.put(`/admin/deliveries/${editingDelivery.id}`, data);
      if (res.data.success) {
        notif.success('Livraison mise à jour avec succès.');
        setDeliveries(prev => prev.map(d => d.id === editingDelivery.id ? res.data.data : d));
      }
      setModalOpen(false);
    } catch (err) {
      notif.error('Une erreur s\'est produite.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette livraison ?')) return;
    try {
      const res = await axios.delete(`/admin/deliveries/${id}`);
      if (res.data.success) {
        notif.success('Livraison supprimée.');
        setDeliveries(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      notif.error('Erreur lors de la suppression.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Suivi des Livraisons
          </h1>
        </div>
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
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Commande #</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Client</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Transporteur / Suivi</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Adresse de livraison</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Statut</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 700 }}>#{d.order_id}</td>
                  <td style={{ padding: '16px 24px' }}>{d.order?.user?.name || 'Inconnu'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600 }}>{d.carrier}</span>
                      {d.tracking_number && <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Suivi: {d.tracking_number}</p>}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {d.address}, {d.city}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: d.status === 'delivered' ? 'rgba(16, 185, 129, 0.1)'
                        : d.status === 'shipped' ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                      color: d.status === 'delivered' ? '#10b981'
                        : d.status === 'shipped' ? '#3b82f6'
                        : '#f59e0b',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      {d.status === 'delivered' ? <CheckCircle size={12} />
                        : d.status === 'shipped' ? <Truck size={12} />
                        : <Clock size={12} />}
                      <span>{d.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEdit(d)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: '16px' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
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
            width: '500px',
            padding: '30px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>
              Mettre à jour la livraison
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Transporteur
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Numéro de suivi
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Frais de livraison (DH)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
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
                    Statut de livraison
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
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
                    <option value="pending">En attente (Pending)</option>
                    <option value="preparing">En cours de préparation</option>
                    <option value="shipped">Expédiée (Shipped)</option>
                    <option value="out_for_delivery">En cours de livraison</option>
                    <option value="delivered">Livrée (Delivered)</option>
                    <option value="failed">Échouée (Failed)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Ville
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'end', gap: '12px', marginTop: '30px' }}>
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
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
