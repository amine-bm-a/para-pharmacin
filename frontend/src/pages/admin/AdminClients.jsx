import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/admin/clients');
        if (res.data.success) setClients(res.data.clients);
      } catch (err) {
        console.error('Error fetching clients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = clients.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.role || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des utilisateurs...</p>
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
        borderBottom: '4px solid var(--primary)'
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
            <span style={{ fontSize: '2.2rem' }}>👥</span>
            <span>Gestion des Utilisateurs</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Liste complète de tous les comptes enregistrés sur la plateforme
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #f97316, #fb923c)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>👥</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Total Utilisateurs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{clients.length}</div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>🛒</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Comptes Clients</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{clients.filter(c => c.role === 'client').length}</div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #2ebb80, #4ade80)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>🛡️</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Équipe & Admins</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{clients.filter(c => c.role !== 'client').length}</div>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Tous les comptes utilisateurs</h3>
          <div className="form-wrapper" style={{ width: '280px' }}>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou rôle..."
              className="form-control"
              style={{ height: '40px', padding: '4px 12px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Contact</th>
              <th>Commandes</th>
              <th>Total dépensé</th>
              <th>Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr 
                  key={c.id}
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s',
                    background: c.is_current_user ? 'rgba(10,168,79,0.06)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: 'var(--radius-md)', 
                        background: c.role === 'admin' ? 'linear-gradient(135deg, #ef4444, #f87171)' : c.role === 'client' ? 'linear-gradient(135deg, var(--primary-light), var(--primary))' : 'linear-gradient(135deg, #10b981, #34d399)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800, 
                        color: 'white',
                        fontSize: '1.1rem'
                      }}>{c.name ? c.name.charAt(0).toUpperCase() : 'U'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                        {c.is_current_user && (
                          <span style={{ 
                            background: '#0AA84F', 
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.72rem', 
                            fontWeight: 800,
                            letterSpacing: '0.3px'
                          }}>
                            (Vous)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {c.role === 'admin' ? (
                      <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
                        👑 Admin
                      </span>
                    ) : c.role === 'pharmacien' || c.role === 'employe' ? (
                      <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
                        💊 Employé / Pharmacien
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
                        👤 Client
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '0.85rem' }}>{c.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>📞 {c.phone || '—'}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: c.orders_count > 0 ? 'var(--success-light)' : 'var(--bg-subtle)',
                      color: c.orders_count > 0 ? 'var(--success)' : 'var(--text-muted)'
                    }}>{c.orders_count} commande(s)</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}><strong style={{ fontSize: '0.95rem' }}>{parseFloat(c.total_spent || 0).toFixed(2)} MAD</strong></td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ 
                  padding: '80px 40px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>👥</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Aucun utilisateur trouvé</div>
                  <div style={{ fontSize: '0.9rem' }}>Essayez une autre recherche</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
