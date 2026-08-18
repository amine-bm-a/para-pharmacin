import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserNotif } from '../../context/UserNotifContext';
import { Bell, CheckCheck, Trash2, Package, User, Info, RefreshCw } from 'lucide-react';
import { formatBold, timeAgo } from '../../utils/textUtils';

const typeConfig = {
  order:  { icon: <Package size={18} />,    color: 'var(--status-info)',    bg: 'var(--status-info-bg)',    label: 'Commande' },
  client: { icon: <User size={18} />,       color: 'var(--primary)',        bg: 'var(--primary-transparent)', label: 'Client' },
  info:   { icon: <Info size={18} />,       color: 'var(--status-warning)', bg: 'var(--status-warning-bg)', label: 'Info' },
  default:{ icon: <Bell size={18} />,       color: 'var(--status-purple)',  bg: 'var(--status-purple-bg)',  label: 'Notification' },
};

export default function PharmacienNotifications() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotif, unreadCount } = useUserNotif();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const cfg = (type) => typeConfig[type] || typeConfig.default;

  return (
    <div className="fade-in">

      {/* Page Header */}
      <div style={{
        marginBottom: '28px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>🔔</span>
            Mes Notifications
            {unreadCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '3px 12px', fontSize: '0.8rem', fontWeight: 800 }}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Nouveaux clients, commandes reçues et mises à jour du système
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => fetchNotifications()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} />
            Actualiser
          </button>
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
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔔</div>
            <h3 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Aucune notification</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Vous serez alerté ici lors de nouvelles commandes ou inscriptions.
            </p>
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
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '16px',
                  boxShadow: notif.is_read ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  opacity: notif.is_read ? 0.75 : 1,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: c.bg, color: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {c.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {notif.title}
                      {!notif.is_read && (
                        <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: c.color }} />
                      )}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {timeAgo(notif.created_at)}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: c.bg, color: c.color, borderRadius: '6px', fontWeight: 700 }}>
                        {c.label}
                      </span>
                    </div>
                  </div>
                  <p
                    style={{ margin: '0 0 14px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: formatBold(notif.message) }}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                        style={{ fontSize: '0.82rem', fontWeight: 700, color: c.color, textDecoration: 'none', padding: '5px 14px', background: c.bg, borderRadius: '8px' }}
                      >
                        Voir →
                      </Link>
                    )}
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer' }}
                      >
                        ✓ Marquer lu
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={13} /> Supprimer
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
