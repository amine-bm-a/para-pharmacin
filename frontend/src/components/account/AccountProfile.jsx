import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function AccountProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      // Get wishlist count
      try {
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
        setWishlistCount(wishlist.length);
      } catch (e) {
        console.error(e);
      }

      // Get addresses count
      try {
        const addresses = JSON.parse(localStorage.getItem(`addresses_${user.id}`) || '[]');
        setAddressesCount(addresses.length);
      } catch (e) {
        console.error(e);
      }

      // Get orders count from API
      axios.get('/orders')
        .then(res => {
          if (res.data.success) {
            setOrdersCount(res.data.orders.length);
          }
        })
        .catch(err => console.error("Error fetching orders count", err));
    }
  }, [user?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.put('/profile', form);
      if (res.data.success) {
        setSuccess('Profil mis à jour avec succès !');
        setEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  const infoFields = [
    { label: 'Nom complet', value: user?.name, icon: '👤', key: 'name' },
    { label: 'Email', value: user?.email, icon: '📧', key: 'email' },
    { label: 'Téléphone', value: user?.phone || 'Non renseigné', icon: '📱', key: 'phone' },
    { label: 'Membre depuis', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icon: '📅' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '2.2rem' }}>👤</span>
          <span>Mon Profil</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      {/* Success / Error Messages */}
      {success && (
        <div style={{
          padding: '14px 20px',
          background: 'var(--success-light)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--success)',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{
          padding: '14px 20px',
          background: 'var(--danger-light)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger)',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '2px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🪪</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Informations Personnelles</h3>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--primary)',
                background: 'var(--bg-card)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-title)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--bg-card)';
                e.target.style.color = 'var(--primary)';
              }}
            >
              ✏️ Modifier
            </button>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '32px' }}>
          {!editing ? (
            /* === VIEW MODE === */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {infoFields.map((field, idx) => (
                <div key={idx} style={{
                  padding: '18px 20px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-light)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{field.icon}</span>
                    {field.label}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: field.value === 'Non renseigné' ? 'var(--text-light)' : 'var(--text)'
                  }}>
                    {field.value || '—'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* === EDIT MODE === */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Nom complet
                  </label>
                  <div className="form-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Email
                  </label>
                  <div className="form-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Téléphone
                  </label>
                  <div className="form-wrapper">
                    <span className="input-icon">📱</span>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0612345678"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '0.9rem', 
                    borderRadius: 'var(--radius-md)',
                    background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), #45a049)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                    }
                  }}
                >
                  {loading ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
                  }}
                  style={{
                    padding: '12px 32px',
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
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.color = 'var(--text-muted)';
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '28px' }}>
        {[
          { label: 'Commandes', value: ordersCount, icon: '📦', color: 'var(--primary)' },
          { label: 'Produits favoris', value: wishlistCount, icon: '🤍', color: 'hsl(354, 70%, 54%)' },
          { label: 'Adresses enregistrées', value: addressesCount, icon: '📍', color: 'hsl(210, 70%, 50%)' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
          }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              flexShrink: 0
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-title)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
