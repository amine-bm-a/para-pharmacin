import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const FREQ_LABELS = {
  weekly:   'Toutes les semaines',
  biweekly: 'Toutes les 2 semaines',
  monthly:  'Chaque mois',
};

const STATUS_COLORS = {
  active:    { color: '#22c55e', bg: '#f0fdf4', label: 'Actif' },
  paused:    { color: '#f59e0b', bg: '#fffbeb', label: 'En pause' },
  cancelled: { color: '#ef4444', bg: '#fef2f2', label: 'Annulé' },
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [showForm, setShowForm]           = useState(false);
  const [products, setProducts]           = useState([]);
  const [submitting, setSubmitting]       = useState(false);
  const [formError, setFormError]         = useState('');

  // Form state
  const [form, setForm] = useState({
    frequency:        'monthly',
    shipping_address: '',
    shipping_city:    '',
    postal_code:      '',
    phone_number:     '',
    payment_method:   'delivery',
    items:            [{ product_id: '', quantity: 1 }],
  });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/subscriptions');
      setSubscriptions(res.data.subscriptions || []);
    } catch {
      setError('Impossible de charger vos abonnements.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await axios.get('/products?no_prescription=true&limit=100');
    setProducts(res.data.products?.data || res.data.products || []);
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    fetchProducts();
  }, [fetchSubscriptions, fetchProducts]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/subscriptions/${id}`, { status });
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de cet abonnement ?')) return;
    try {
      await axios.delete(`/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleItemChange = (idx, field, value) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', quantity: 1 }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: form.items.filter(it => it.product_id),
      };
      await axios.post('/subscriptions', payload);
      setShowForm(false);
      setForm({ frequency: 'monthly', shipping_address: '', shipping_city: '', postal_code: '', phone_number: '', payment_method: 'delivery', items: [{ product_id: '', quantity: 1 }] });
      fetchSubscriptions();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la création de l\'abonnement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .sub-card { animation: fadeUp 0.4s ease both; }
        .sub-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1f2937' }}>🔄 Mes abonnements</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Commandes récurrentes avec 5% de réduction automatique</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #4CAF50, #2e7d32)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(76,175,80,0.35)',
            transition: 'transform 0.2s',
          }}
        >
          + Nouvel abonnement
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '20px' }}>{error}</p>}

      {/* ── New Subscription Form ── */}
      {showForm && (
        <div className="sub-card" style={{
          background: 'white',
          borderRadius: '16px',
          border: '2px solid #4CAF50',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(76,175,80,0.15)',
        }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Créer un abonnement</h2>

          {formError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '0.88rem' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Products */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: '10px', fontSize: '0.9rem' }}>Produits</label>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                  <select
                    value={item.product_id}
                    onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
                    required
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem', color: '#374151' }}
                  >
                    <option value="">Choisir un produit...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.requires_prescription}>
                        {p.name} {p.requires_prescription ? '(ordonnance requise)' : `— ${p.price} MAD`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number" min="1" max="99"
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
                    style={{ width: '70px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e5e7eb', textAlign: 'center', fontSize: '0.88rem' }}
                  />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', padding: '4px 8px' }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ background: 'none', border: '1.5px dashed #d1d5db', borderRadius: '10px', padding: '8px 18px', color: '#6b7280', cursor: 'pointer', fontSize: '0.85rem', width: '100%', marginTop: '4px' }}>
                + Ajouter un produit
              </button>
            </div>

            {/* Frequency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.87rem' }}>Fréquence</label>
                <select value={form.frequency} onChange={e => handleFormChange('frequency', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem' }}>
                  {Object.entries(FREQ_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.87rem' }}>Mode de livraison</label>
                <select value={form.payment_method} onChange={e => handleFormChange('payment_method', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem' }}>
                  <option value="delivery">Livraison à domicile</option>
                  <option value="pickup">Retrait en pharmacie</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {[
                { field: 'shipping_address', label: 'Adresse', placeholder: '123 Rue de la Paix', full: true },
                { field: 'shipping_city', label: 'Ville', placeholder: 'Casablanca' },
                { field: 'postal_code', label: 'Code postal', placeholder: '20000' },
                { field: 'phone_number', label: 'Téléphone', placeholder: '+212600000000' },
              ].map(f => (
                <div key={f.field} style={f.full ? { gridColumn: '1 / -1' } : {}}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.87rem' }}>{f.label}</label>
                  <input
                    type="text"
                    value={form[f.field]}
                    onChange={e => handleFormChange(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '11px 24px', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" disabled={submitting} style={{ padding: '11px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #4CAF50, #2e7d32)', color: 'white', border: 'none', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Création...' : 'Créer l\'abonnement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Subscriptions List ── */}
      {subscriptions.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: '#9ca3af' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔄</div>
          <h3 style={{ margin: '0 0 8px', color: '#6b7280' }}>Aucun abonnement actif</h3>
          <p style={{ margin: '0 0 24px', fontSize: '0.9rem' }}>Créez un abonnement pour recevoir vos médicaments chroniques automatiquement avec 5% de réduction.</p>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #4CAF50, #2e7d32)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Créer mon premier abonnement
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {subscriptions.map((sub, i) => {
            const statusInfo = STATUS_COLORS[sub.status] || STATUS_COLORS.active;
            return (
              <div key={sub.id} className="sub-card" style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.25s ease',
                animationDelay: `${i * 0.07}s`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>Abonnement #{sub.id}</h3>
                      <span style={{ background: statusInfo.bg, color: statusInfo.color, borderRadius: '99px', padding: '3px 12px', fontWeight: 700, fontSize: '0.78rem' }}>
                        {statusInfo.label}
                      </span>
                      <span style={{ background: '#f0fdf4', color: '#15803d', borderRadius: '99px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
                        -{sub.discount_percent}%
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                      {FREQ_LABELS[sub.frequency]} · Prochain : <strong>{new Date(sub.next_renewal_at).toLocaleDateString('fr-FR')}</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sub.status === 'active' && (
                      <button onClick={() => handleUpdateStatus(sub.id, 'paused')} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #f59e0b', background: 'white', color: '#d97706', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        ⏸ Pause
                      </button>
                    )}
                    {sub.status === 'paused' && (
                      <button onClick={() => handleUpdateStatus(sub.id, 'active')} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #4CAF50', background: 'white', color: '#4CAF50', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        ▶ Reprendre
                      </button>
                    )}
                    <button onClick={() => handleDelete(sub.id)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                      ✕ Annuler
                    </button>
                  </div>
                </div>

                {/* Products */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {sub.items?.map(item => (
                    <div key={item.id} style={{
                      background: '#f9fafb',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      {item.product?.image_url && (
                        <img src={item.product.image_url} alt={item.product?.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={e => e.target.style.display = 'none'} />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1f2937' }}>{item.product?.name || 'Produit'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Qté : {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '0.82rem', color: '#6b7280' }}>
                  📍 {sub.shipping_address}, {sub.shipping_city} {sub.postal_code} · 📞 {sub.phone_number}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
