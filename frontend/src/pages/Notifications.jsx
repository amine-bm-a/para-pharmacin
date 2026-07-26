import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserNotif } from '../context/UserNotifContext';
import { Bell, CheckCheck, Trash2, Package, User, Info, ArrowLeft } from 'lucide-react';

const typeConfig = {
  order:  { icon: <Package size={18} />,     color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   label: 'Commande' },
  client: { icon: <User size={18} />,        color: '#2ebb80', bg: 'rgba(46,187,128,0.1)',   label: 'Compte' },
  info:   { icon: <Info size={18} />,        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   label: 'Info' },
  default:{ icon: <Bell size={18} />,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   label: 'Notification' },
};

function formatBold(text) {
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`;
}

export default function Notifications() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotif, unreadCount } = useUserNotif();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const cfg = (type) => typeConfig[type] || typeConfig.default;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px' }} className="fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={22} color="var(--primary)" />
              Mes Notifications
              {unreadCount > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Confirmations de commandes, mises à jour et alertes
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
          >
            <CheckCheck size={16} />
            Tout marquer lu
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ fontWeight: 600 }}>Chargement...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔔</div>
            <h3 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Aucune notification</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Vous serez notifié ici pour vos confirmations de commandes et mises à jour importantes.
            </p>
            <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
              Explorer les produits →
            </Link>
          </div>
        ) : (
          notifications.map(notif => {
            const c = cfg(notif.type);
            return (
              <div
                key={notif.id}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${notif.is_read ? 'var(--border-light)' : c.color + '40'}`,
                  borderLeft: `4px solid ${notif.is_read ? 'var(--border-light)' : c.color}`,
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  gap: '16px',
                  transition: 'all 0.2s',
                  opacity: notif.is_read ? 0.8 : 1,
                  boxShadow: notif.is_read ? 'none' : `0 2px 12px ${c.color}20`,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: c.bg, color: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {c.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
                      {notif.title}
                      {!notif.is_read && (
                        <span style={{ marginLeft: '8px', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c.color, verticalAlign: 'middle' }} />
                      )}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, fontWeight: 500 }}>
                      {timeAgo(notif.created_at)}
                    </span>
                  </div>
                  <p
                    style={{ margin: '0 0 12px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: formatBold(notif.message) }}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {notif.link && notif.link !== '/' && (
                      <Link
                        to={notif.link}
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                        style={{ fontSize: '0.8rem', fontWeight: 700, color: c.color, textDecoration: 'none', padding: '4px 12px', background: c.bg, borderRadius: '8px' }}
                      >
                        Voir →
                      </Link>
                    )}
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-subtle)', border: 'none', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer' }}
                      >
                        ✓ Marquer lu
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
