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
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
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
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des clients...</p>
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
            <span>Clients</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Liste de tous les clients enregistrés sur la plateforme
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
            background: 'linear-gradient(135deg, #f97316, #fb923c)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>👥</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Total clients</div>
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
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>🛒</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Avec au moins 1 commande</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{clients.filter(c => c.orders_count > 0).length}</div>
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
            background: 'linear-gradient(135deg, #2ebb80, #4ade80)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.8rem' 
          }}>💰</div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Dépenses totales</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{clients.reduce((s, c) => s + parseFloat(c.total_spent || 0), 0).toFixed(0)} MAD</div>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Tous les clients</h3>
          <div className="form-wrapper" style={{ width: '280px' }}>
            <span className="input-icon\">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
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
              <th>Client</th>
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
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800, 
                        color: 'white',
                        fontSize: '1.1rem'
                      }}>{c.name.charAt(0)}</div>
                      <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                    </div>
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
                  <td style={{ padding: '16px 20px' }}><strong style={{ fontSize: '0.95rem' }}>{parseFloat(c.total_spent).toFixed(2)} MAD</strong></td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ 
                  padding: '80px 40px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>👥</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Aucun client trouvé</div>
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
