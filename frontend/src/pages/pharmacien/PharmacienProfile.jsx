import React, { useState } from 'react';
import { User, Key, Save, Mail, Phone, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

export default function PharmacienProfile() {
  const { user, setUser } = useAuth() || {};
  const notif = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingInfo, setSavingInfo] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.two_factor_enabled);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await axios.put('/profile', { name, email, phone });
      if (res.data.success) {
        notif.success('Informations mises à jour avec succès !');
        if (typeof setUser === 'function') setUser(res.data.user);
      }
    } catch (err) {
      notif.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    const nextValue = !twoFactorEnabled;
    setSavingTwoFactor(true);
    try {
      const res = await axios.put('/profile', {
        name, email, phone,
        two_factor_enabled: nextValue,
      });
      if (res.data.success) {
        setTwoFactorEnabled(nextValue);
        notif.success(nextValue ? 'Vérification en deux étapes activée.' : 'Vérification en deux étapes désactivée.');
        if (typeof setUser === 'function') setUser(res.data.user);
      }
    } catch (err) {
      notif.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSavingTwoFactor(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notif.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await axios.put('/password', {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      if (res.data.success) {
        notif.success('Mot de passe modifié avec succès !');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      notif.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 38px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
    fontWeight: 650,
  };

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: 'var(--shadow-sm)',
  };

  const buttonStyle = {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <User size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Mon Profil
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Personal info */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary)" />
            <span>Informations personnelles</span>
          </h3>

          <form onSubmit={handleUpdateInfo}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ ...inputStyle, paddingLeft: '12px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Téléphone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <button type="submit" disabled={savingInfo} style={{ ...buttonStyle, opacity: savingInfo ? 0.7 : 1 }}>
                <Save size={18} />
                <span>{savingInfo ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security: password + 2FA */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--primary)" />
            <span>Sécurité & mot de passe</span>
          </h3>

          <form onSubmit={handleUpdatePassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Mot de passe actuel</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={inputStyle}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Au moins 8 caractères, une majuscule, une minuscule et un chiffre.
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Confirmer le nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <button type="submit" disabled={savingPassword} style={{ ...buttonStyle, opacity: savingPassword ? 0.7 : 1 }}>
                <Save size={18} />
                <span>{savingPassword ? 'Modification...' : 'Modifier le mot de passe'}</span>
              </button>
            </div>
          </form>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 650, color: 'var(--text-main)' }}>Vérification en deux étapes</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ajoute une couche de sécurité supplémentaire à votre compte.
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleTwoFactor}
              disabled={savingTwoFactor}
              style={{
                width: '50px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                background: twoFactorEnabled ? 'var(--primary)' : 'var(--border-light)',
                transition: 'background 0.25s',
                flexShrink: 0,
                opacity: savingTwoFactor ? 0.7 : 1,
              }}
              aria-label="Activer ou désactiver la vérification en deux étapes"
            >
              <span style={{
                position: 'absolute',
                top: '3px',
                left: twoFactorEnabled ? '25px' : '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.25s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
