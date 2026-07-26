import React, { useState } from 'react';
import axios from 'axios';

export default function AccountSecurity() {
  const [form, setForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.new_password !== form.new_password_confirmation) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (form.new_password.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put('/password', {
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation
      });
      if (res.data.success) {
        setSuccess('Mot de passe modifié avec succès !');
        setForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border)',
    fontSize: '0.95rem',
    background: 'var(--bg-subtle)',
    transition: 'all 0.2s'
  };

  return (
    <div>
      {/* Header */}
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
          <span style={{ fontSize: '2.2rem' }}>🔒</span>
          <span>Sécurité</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Protégez votre compte en mettant à jour votre mot de passe régulièrement
        </p>
      </div>

      {/* Password Change Card */}
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
          background: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.4rem' }}>🔑</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Modifier le mot de passe</h3>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Messages */}
          {success && (
            <div style={{
              padding: '14px 20px', background: 'var(--success-light)', border: '1px solid var(--success)',
              borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.88rem', fontWeight: 600,
              marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ✅ {success}
            </div>
          )}
          {error && (
            <div style={{
              padding: '14px 20px', background: 'var(--danger-light)', border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.88rem', fontWeight: 600,
              marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Mot de passe actuel
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    name="current_password"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.current_password}
                    onChange={handleChange}
                    required
                    placeholder="Entrez votre mot de passe actuel"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Nouveau mot de passe
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    name="new_password"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.new_password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 6 caractères"
                    className="form-control"
                  />
                </div>
                {/* Password strength indicator */}
                {form.new_password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} style={{
                          height: '4px',
                          flex: 1,
                          borderRadius: '2px',
                          background: form.new_password.length >= level * 3
                            ? form.new_password.length >= 12 ? 'var(--success)' : form.new_password.length >= 8 ? 'hsl(38, 80%, 50%)' : 'var(--danger)'
                            : 'var(--border)',
                          transition: 'background 0.3s'
                        }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                      {form.new_password.length < 6 ? 'Trop court' : form.new_password.length < 8 ? 'Faible' : form.new_password.length < 12 ? 'Moyen' : 'Fort'}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Confirmer le nouveau mot de passe
                </label>
                <div className="form-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    name="new_password_confirmation"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.new_password_confirmation}
                    onChange={handleChange}
                    required
                    placeholder="Ressaisissez le nouveau mot de passe"
                    className="form-control"
                  />
                </div>
                {form.new_password && form.new_password_confirmation && form.new_password !== form.new_password_confirmation && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '6px' }}>
                    ⚠️ Les mots de passe ne correspondent pas
                  </div>
                )}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                Afficher les mots de passe
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{ 
                  padding: '14px 36px', 
                  fontSize: '0.95rem', 
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
                {loading ? '⏳ Modification...' : '🔒 Modifier le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Tips */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '28px 32px',
        marginTop: '24px'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🛡️ Conseils de sécurité
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            'Utilisez un mot de passe unique pour chaque site',
            'Mélangez lettres, chiffres et caractères spéciaux',
            'Ne partagez jamais votre mot de passe',
            'Changez votre mot de passe tous les 3 mois'
          ].map((tip, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>
              <span style={{ color: 'var(--success)', flexShrink: 0, fontSize: '1rem' }}>✓</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
