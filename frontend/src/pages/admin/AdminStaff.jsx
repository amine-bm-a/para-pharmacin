import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminStaff() {
  const { user: currentUser } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [formError, setFormError] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/staff');
      if (res.data.success) setStaff(res.data.staff);
    } catch (err) {
      console.error('Error fetching staff', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('admin');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingId(member.id);
    setName(member.name || '');
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setPassword('');
    setRole(member.role || 'pharmacien');
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      let res;
      if (editingId) {
        res = await axios.put(`/admin/staff/${editingId}`, { name, email, phone, password: password || undefined, role });
      } else {
        res = await axios.post('/admin/staff', { name, email, phone, password, role });
      }
      if (res.data.success) {
        setModalOpen(false);
        fetchStaff();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Supprimer l'utilisateur "${member.name}" ?`)) {
      try {
        const res = await axios.delete(`/admin/staff/${member.id}`);
        if (res.data.success) fetchStaff();
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression.');
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
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des utilisateurs...</p>
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
          }}>Utilisateurs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>Gérez les comptes administrateurs ayant accès à ce tableau de bord</p>
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
        >+ Ajouter un membre</button>
      </div>

      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Nom</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Téléphone</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Rôle</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Ajouté le</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((s, index) => (
                  <tr 
                    key={s.id}
                    style={{ 
                      borderBottom: index < staff.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>{s.name.charAt(0)}</div>
                        <div>
                          <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{s.name}</strong>
                          {currentUser?.id === s.id && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '50px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              background: 'var(--success-light)',
                              color: 'var(--success)',
                              marginLeft: '8px'
                            }}>Vous</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.email}</td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.phone || '—'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: s.role === 'admin' ? '#e8f5e9' : '#e0f2fe',
                        color: s.role === 'admin' ? '#2e7d32' : '#0369a1',
                        textTransform: 'capitalize'
                      }}>{s.role}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(s.created_at).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--primary)',
                          background: 'white',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--primary)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = 'var(--primary)';
                        }}
                      >
                        Modifier ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--danger)',
                          background: 'white',
                          color: 'var(--danger)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: currentUser?.id === s.id ? 0.5 : 1
                        }}
                        disabled={currentUser?.id === s.id}
                        title={currentUser?.id === s.id ? 'Vous ne pouvez pas supprimer votre propre compte' : ''}
                        onMouseEnter={(e) => {
                          if (currentUser?.id !== s.id) {
                            e.target.style.background = 'var(--danger)';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = 'transparent';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentUser?.id !== s.id) {
                            e.target.style.background = 'white';
                            e.target.style.color = 'var(--danger)';
                            e.target.style.borderColor = 'var(--danger)';
                          }
                        }}
                      >
                        Supprimer 🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Aucun administrateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                {editingId ? 'Modifier le Membre du Personnel' : 'Ajouter un Membre du Personnel'}
              </h2>
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Nom complet</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>👤</span>
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
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>📧</span>
                  <input 
                    type="email" 
                    required 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Téléphone <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>📞</span>
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
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
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
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Rôle</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔑</span>
                  <select 
                    required 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="admin">Administrateur</option>
                    <option value="pharmacien">Pharmacien</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                  Mot de passe {editingId && <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— laisser vide pour conserver l'actuel</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</span>
                  <input 
                    type="password" 
                    required={!editingId} 
                    minLength={8} 
                    style={{ 
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-light)',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
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
                >Créer le compte</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
