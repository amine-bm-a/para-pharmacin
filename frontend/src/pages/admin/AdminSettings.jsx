import React, { useState, useEffect } from 'react';
import { Settings, Save, Store, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

export default function AdminSettings() {
  const notif = useNotification();
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [freeDeliveryMin, setFreeDeliveryMin] = useState('500');
  const [currency, setCurrency] = useState('DH');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.settings) {
          const contact = res.data.settings.contact || {};
          setStoreName(contact.store_name || 'Pharmacie Ben Moussa');
          setStoreEmail(contact.email || 'contact@parabenmoussa.ma');
          setStorePhone(contact.phone || '+212 524-423823');
          setStoreAddress(contact.address || 'Marrakech, Maroc');
          setFreeDeliveryMin(contact.free_delivery_min || '500');
          setCurrency(contact.currency || 'DH');
        }
      } catch (err) {
        console.error('Error fetching settings', err);
        if (notif) notif.error('Erreur lors du chargement des paramètres.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [notif]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/admin/settings/contact', {
        value: {
          store_name: storeName,
          email: storeEmail,
          phone: storePhone,
          address: storeAddress,
          free_delivery_min: freeDeliveryMin,
          currency: currency
        }
      });
      if (res.data.success) {
        if (notif) notif.success('Paramètres sauvegardés avec succès !');
      } else {
        if (notif) notif.error(res.data.message || 'Erreur lors de la sauvegarde.');
      }
    } catch (err) {
      console.error('Error saving settings', err);
      if (notif) notif.error(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: '20px',
      border: '1px solid var(--border-light)',
      margin: '30px'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des paramètres...</p>
    </div>
  );

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <Settings size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Paramètres du site
        </h1>
      </div>

      <div style={{
        maxWidth: '700px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} color="var(--primary)" />
            <span>Informations générales</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Nom de la parapharmacie
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Email de contact
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={storeEmail}
                  onChange={e => setStoreEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Téléphone
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={storePhone}
                  onChange={e => setStorePhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Adresse physique
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={storeAddress}
                  onChange={e => setStoreAddress(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--border-light)', margin: '30px 0' }} />

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--primary)" />
            <span>Facturation et Livraison</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Minimum d'achat livraison gratuite (DH)
              </label>
              <input
                type="number"
                value={freeDeliveryMin}
                onChange={e => setFreeDeliveryMin(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 650 }}>
                Devise par défaut
              </label>
              <input
                type="text"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: saving ? 0.7 : 1
              }}
            >
              <Save size={18} />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
