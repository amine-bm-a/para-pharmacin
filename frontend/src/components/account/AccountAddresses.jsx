import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AccountAddresses() {
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState(() => {
    if (!user?.id) return [];
    const saved = localStorage.getItem(`addresses_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: '', address: '', city: '', postalCode: '', phone: '', isDefault: false });

  // Sync to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`addresses_${user.id}`, JSON.stringify(addresses));
    }
  }, [addresses, user?.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newAddress = { 
      ...form, 
      id: editingId || Date.now(),
      isDefault: addresses.length === 0 ? true : form.isDefault 
    };

    let updatedList;
    if (editingId) {
      updatedList = addresses.map(a => a.id === editingId ? newAddress : a);
    } else {
      updatedList = [...addresses, newAddress];
    }

    // If this address is set as default, remove default from all other addresses
    if (newAddress.isDefault) {
      updatedList = updatedList.map(a => a.id === newAddress.id ? a : { ...a, isDefault: false });
    }

    setAddresses(updatedList);
    setForm({ label: '', address: '', city: '', postalCode: '', phone: '', isDefault: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updatedList = addresses.filter(a => a.id !== id);
    // If we deleted the default address and have other addresses left, make the first one default
    if (addresses.find(a => a.id === id)?.isDefault && updatedList.length > 0) {
      updatedList[0].isDefault = true;
    }
    setAddresses(updatedList);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            marginBottom: '8px', 
            fontFamily: 'var(--font-title)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>📍</span>
            <span>Mes Adresses</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Gérez vos adresses de livraison pour un checkout plus rapide
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ label: '', address: '', city: '', postalCode: '', phone: '', isDefault: false }); }}
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
            + Ajouter une adresse
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '32px',
          marginBottom: '28px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingId ? '✏️ Modifier l\'adresse' : '📍 Nouvelle adresse'}
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Nom de l'adresse
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">🏷️</span>
                  <input name="label" value={form.label} onChange={handleChange} placeholder="ex: Maison, Bureau..." required className="form-control" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Téléphone
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">📱</span>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="0612345678" required className="form-control" />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Adresse complète
              </label>
              <div className="form-wrapper">
                <span className="input-icon">📍</span>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Rue, numéro, quartier..." required className="form-control" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Ville
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">🏙️</span>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="ex: Marrakech" required className="form-control" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Code Postal
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">📮</span>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="40000" className="form-control" />
                </div>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginBottom: '24px', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
              />
              Définir comme adresse par défaut
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ 
                padding: '12px 32px', 
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary), #45a049)',
                border: 'none',
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
              >
                💾 {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
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
        </div>
      )}

      {/* Address Cards */}
      {addresses.length === 0 && !showForm ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>📍</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Aucune adresse enregistrée</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
            Ajoutez une adresse de livraison pour accélérer vos prochaines commandes.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
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
            + Ajouter ma première adresse
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {addresses.map((addr) => (
            <div key={addr.id} style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              padding: '24px',
              position: 'relative',
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
              {addr.isDefault && (
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'var(--primary)', color: 'white',
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem', fontWeight: 700
                }}>
                  PAR DÉFAUT
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.1rem' }}>🏠</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{addr.label}</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{addr.address}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{addr.city} {addr.postalCode}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>📞 {addr.phone}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(addr)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(addr.id)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--danger-light)', background: 'var(--danger-light)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: 'var(--danger)' }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
