import React, { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, Smartphone, Trash2, CheckCircle2, XCircle, Loader2, RefreshCw, Info } from 'lucide-react';
import axios from 'axios';
import {
  isPushSupported,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../utils/pushNotifications';

/**
 * PWANotifications — manage browser push subscription in Account settings.
 * Shown as a card within the account/settings page.
 */
export default function PWANotifications() {
  const [permission, setPermission]     = useState('default');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage]           = useState(null); // { type: 'success'|'error', text }
  const [isInstalled, setIsInstalled]   = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    if (!isPushSupported()) { setLoading(false); return; }
    try {
      const res = await axios.get('/push-subscriptions');
      setSubscriptions(res.data.data || []);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setPermission(Notification?.permission ?? 'unsupported');
    setIsInstalled(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // ── Enable push ───────────────────────────────────────────────────────────
  const handleEnable = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setMessage({ type: 'error', text: 'Permission refusée. Activez les notifications dans les paramètres du navigateur.' });
        return;
      }
      await subscribeToPush(axios);
      await fetchSubscriptions();
      setMessage({ type: 'success', text: '✅ Notifications push activées pour ce navigateur.' });
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de l\'activation. Réessayez.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Disable push (this browser) ────────────────────────────────────────
  const handleDisable = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      await unsubscribeFromPush(axios);
      await fetchSubscriptions();
      setMessage({ type: 'success', text: 'Notifications désactivées pour ce navigateur.' });
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la désactivation.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Remove all ─────────────────────────────────────────────────────────
  const handleRemoveAll = async () => {
    if (!window.confirm('Supprimer toutes vos abonnements push sur tous les appareils ?')) return;
    setActionLoading(true);
    try {
      await axios.delete('/push-subscriptions/all');
      setSubscriptions([]);
      setMessage({ type: 'success', text: 'Tous les abonnements push supprimés.' });
    } catch {
      setMessage({ type: 'error', text: 'Erreur. Réessayez.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const permColor = { granted: '#16a34a', denied: '#dc2626', default: '#d97706' };
  const permLabel = { granted: 'Activées', denied: 'Bloquées', default: 'Non décidées' };
  const permIcon  = { granted: <CheckCircle2 size={16}/>, denied: <XCircle size={16}/>, default: <Bell size={16}/> };

  if (!isPushSupported()) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <Bell size={20} style={{ color: '#6b7280' }} />
          <h3 style={styles.title}>Notifications push</h3>
        </div>
        <div style={styles.unsupported}>
          <Info size={18} style={{ color: '#d97706', flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#92400e', fontSize: '.9rem' }}>
            Votre navigateur ne supporte pas les notifications push. Utilisez Chrome, Edge ou Firefox sur desktop, ou Chrome/Samsung sur Android.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <Bell size={20} style={{ color: '#16a34a' }} />
        <h3 style={styles.title}>Notifications push</h3>
        <button onClick={fetchSubscriptions} style={styles.refreshBtn} title="Rafraîchir" disabled={loading}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Permission badge */}
      <div style={{ ...styles.badge, background: permColor[permission] + '18', color: permColor[permission] }}>
        {permIcon[permission]}
        <span>Permissions navigateur : <strong>{permLabel[permission] ?? permission}</strong></span>
      </div>

      {/* Message */}
      {message && (
        <div style={{ ...styles.alert, background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#15803d' : '#dc2626', borderColor: message.type === 'success' ? '#bbf7d0' : '#fecaca' }}>
          {message.text}
        </div>
      )}

      {/* Enable / Disable buttons */}
      <div style={styles.btnRow}>
        {permission !== 'granted' ? (
          <button style={{ ...styles.btn, background: 'linear-gradient(135deg,#16a34a,#059669)', color: 'white' }} onClick={handleEnable} disabled={actionLoading || permission === 'denied'}>
            {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Bell size={16} />}
            Activer les notifications
          </button>
        ) : (
          <button style={{ ...styles.btn, background: '#f9fafb', color: '#374151', border: '1.5px solid #e5e7eb' }} onClick={handleDisable} disabled={actionLoading}>
            {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <BellOff size={16} />}
            Désactiver (ce navigateur)
          </button>
        )}
        {subscriptions.length > 1 && (
          <button style={{ ...styles.btn, background: '#fff1f2', color: '#dc2626', border: '1.5px solid #fecaca' }} onClick={handleRemoveAll} disabled={actionLoading}>
            <Trash2 size={14} />
            Tout supprimer
          </button>
        )}
      </div>

      {/* Subscription list */}
      {loading ? (
        <div style={styles.loadingRow}><Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#9ca3af' }} /></div>
      ) : subscriptions.length > 0 ? (
        <div style={{ marginTop: '1.25rem' }}>
          <p style={styles.sectionLabel}>Appareils abonnés ({subscriptions.length})</p>
          <div style={styles.deviceList}>
            {subscriptions.map((sub) => (
              <div key={sub.id} style={styles.deviceRow}>
                <Smartphone size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '.88rem', color: '#111827' }}>{sub.user_agent}</p>
                  <p style={{ margin: 0, fontSize: '.78rem', color: '#9ca3af' }}>
                    Ajouté le {sub.created_at}
                    {sub.last_used && ` · Utilisé ${sub.last_used}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : permission === 'granted' ? (
        <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '.88rem', textAlign: 'center' }}>
          Aucun abonnement actif. Activez les notifications ci-dessus.
        </p>
      ) : null}

      {/* PWA install hint */}
      {!isInstalled && (
        <div style={styles.installHint}>
          <Info size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#6b7280', fontSize: '.82rem' }}>
            Installez l&apos;application depuis votre navigateur pour recevoir les notifications même quand le site est fermé.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    marginBottom: '1rem',
  },
  title: {
    margin: 0, flex: 1, fontSize: '1.05rem', fontWeight: 700, color: '#111827',
  },
  refreshBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '.25rem',
    color: '#9ca3af', display: 'flex', alignItems: 'center',
  },
  badge: {
    display: 'flex', alignItems: 'center', gap: '.4rem',
    borderRadius: '10px', padding: '.5rem .85rem',
    fontSize: '.85rem', fontWeight: 500, marginBottom: '1rem',
  },
  alert: {
    border: '1px solid', borderRadius: '10px',
    padding: '.65rem 1rem', fontSize: '.88rem',
    marginBottom: '1rem',
  },
  btnRow: {
    display: 'flex', gap: '.75rem', flexWrap: 'wrap',
  },
  btn: {
    display: 'flex', alignItems: 'center', gap: '.4rem',
    padding: '.65rem 1.1rem', borderRadius: '12px',
    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.88rem',
    transition: 'opacity .15s',
  },
  loadingRow: {
    display: 'flex', justifyContent: 'center',
    padding: '1.5rem 0',
  },
  sectionLabel: {
    margin: '0 0 .5rem', fontSize: '.8rem', fontWeight: 600,
    color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em',
  },
  deviceList: {
    display: 'flex', flexDirection: 'column', gap: '.5rem',
  },
  deviceRow: {
    display: 'flex', alignItems: 'flex-start', gap: '.6rem',
    background: '#f9fafb', borderRadius: '10px', padding: '.65rem .85rem',
  },
  unsupported: {
    display: 'flex', gap: '.6rem',
    background: '#fffbeb', borderRadius: '10px',
    padding: '.75rem 1rem', border: '1px solid #fde68a',
    alignItems: 'flex-start',
  },
  installHint: {
    display: 'flex', gap: '.5rem', alignItems: 'flex-start',
    marginTop: '1.25rem', paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6',
  },
};
