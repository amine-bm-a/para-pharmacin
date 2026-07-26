import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserNotif } from '../../context/UserNotifContext';
import {
  LayoutDashboard, ScanBarcode, Package, ClipboardCheck,
  Bell, LogOut, HeartPulse, ExternalLink, FileText, UserCog,
  ChevronDown, Search, ChevronRight, X, Check
} from 'lucide-react';

function buildNavGroups(pendingPrescriptionsCount) {
  return [
    {
      label: 'Principal',
      items: [
        { path: '/pharmacien', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
      ]
    },
    {
      label: 'Commandes',
      items: [
        { path: '/pharmacien/prepare', label: 'Préparer Commandes', icon: ClipboardCheck },
        { path: '/pharmacien/orders', label: 'Toutes les commandes', icon: Package },
        { path: '/pharmacien/scan', label: 'Scanner Commande', icon: ScanBarcode },
      ]
    },
    {
      label: 'Ordonnances',
      items: [
        {
          path: '/pharmacien/prescriptions',
          label: 'Valider Ordonnances',
          icon: FileText,
          badge: pendingPrescriptionsCount > 0 ? pendingPrescriptionsCount : null,
        },
      ]
    },
    {
      label: 'Inventaire',
      items: [
        { path: '/pharmacien/stock', label: 'Gestion Stock', icon: Package },
      ]
    },
    {
      label: 'Alertes',
      items: [
        { path: '/pharmacien/notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      label: 'Compte',
      items: [
        { path: '/pharmacien/profile', label: 'Mon Profil', icon: UserCog },
      ]
    },
  ];
}

const PAGE_TITLES = {
  '/pharmacien':              { title: 'Tableau de bord',     sub: "Vue d'ensemble de l'espace pharmacien" },
  '/pharmacien/scan':         { title: 'Scanner Commande',    sub: 'Vérification et scan des colis' },
  '/pharmacien/prepare':      { title: 'Préparer Commandes',  sub: 'Gestion des commandes à préparer' },
  '/pharmacien/orders':       { title: 'Toutes les commandes', sub: 'Historique complet de toutes les commandes' },
  '/pharmacien/prescriptions':{ title: 'Valider Ordonnances', sub: 'Approbation des ordonnances en attente' },
  '/pharmacien/stock':        { title: 'Gestion du Stock',    sub: 'Stocks, alertes et inventaire' },
  '/pharmacien/notifications':{ title: 'Notifications',       sub: 'Alertes et messages du système' },
  '/pharmacien/profile':      { title: 'Mon Profil',          sub: 'Informations personnelles et sécurité' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = Math.floor((new Date() - d) / 60000);
  if (diff < 1) return "À l'instant";
  if (diff < 60) return `Il y a ${diff} min`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `Il y a ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `Il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function notifIcon(type) {
  return { order: '📦', payment: '💳', prescription: '💊', promo: '🎁', system: '⚙️' }[type] || '🔔';
}

function PharmacienTopbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount, notifications, loading: notifLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotif } = useUserNotif();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = async () => { await logout(); navigate('/'); };
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Espace Pharmacien', sub: 'Portail employé' };

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleBellClick = () => {
    if (!showNotifPanel) fetchNotifications();
    setShowNotifPanel(v => !v);
    setShowUserMenu(false);
  };

  const preview = (notifications || []).slice(0, 8);

  return (
    <header className="admin-topbar">
      {/* Left: Page Title */}
      <div className="admin-topbar-left">
        <div>
          <h2 className="topbar-page-title">{pageInfo.title}</h2>
          <p className="topbar-page-sub">{pageInfo.sub}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="admin-topbar-right">

        {/* Search */}
        <div className="topbar-search-wrap">
          <Search size={15} className="topbar-search-icon" />
          <input type="text" placeholder="Rechercher..." className="topbar-search-input" />
        </div>

        {/* Visit Store */}
        <a href="/" className="topbar-action-btn" title="Voir la boutique" target="_blank" rel="noopener noreferrer">
          <ExternalLink size={17} />
        </a>

        {/* ─── Notifications Bell + Real Dropdown ─── */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="topbar-action-btn topbar-notif"
            title="Notifications"
            onClick={handleBellClick}
            style={{ position: 'relative' }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#ef4444', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.65rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-card)',
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifPanel && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 12px)', right: 0,
              width: '380px', maxHeight: '480px',
              background: 'var(--admin-card-bg, var(--bg-card))',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px 12px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: '#ef4444', color: 'white',
                      borderRadius: '20px', padding: '1px 8px',
                      fontSize: '0.7rem', fontWeight: 800,
                    }}>
                      {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      style={{
                        background: 'var(--primary-light)', border: 'none',
                        color: 'var(--primary)', borderRadius: '6px',
                        padding: '4px 8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Check size={12} /> Tout lu
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifPanel(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {notifLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{
                      width: '32px', height: '32px', margin: '0 auto 12px',
                      border: '3px solid var(--border)', borderTopColor: 'var(--primary)',
                      borderRadius: '50%', animation: 'spin 0.7s linear infinite'
                    }} />
                    Chargement…
                  </div>
                ) : preview.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔔</div>
                    <p style={{ margin: 0, fontSize: '0.88rem' }}>Aucune notification</p>
                  </div>
                ) : (
                  preview.map(n => (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '12px 18px',
                        background: n.is_read ? 'transparent' : 'var(--primary-light)',
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'var(--primary-light)'}
                    >
                      <span style={{
                        fontSize: '1.1rem', flexShrink: 0,
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: 'var(--bg-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {notifIcon(n.type)}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.83rem', fontWeight: n.is_read ? 600 : 800,
                          color: 'var(--text)', marginBottom: '2px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {n.title}
                        </div>
                        <div style={{
                          fontSize: '0.76rem', color: 'var(--text-muted)',
                          marginBottom: '4px', lineHeight: 1.4,
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                          {timeAgo(n.created_at)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                        {!n.is_read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            title="Lu"
                            style={{
                              background: 'var(--primary)', border: 'none', color: 'white',
                              borderRadius: '6px', width: '24px', height: '24px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Check size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(n.id)}
                          title="Supprimer"
                          style={{
                            background: 'var(--danger-light)', border: 'none', color: 'var(--danger)',
                            borderRadius: '6px', width: '24px', height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <button
                  onClick={() => { setShowNotifPanel(false); navigate('/pharmacien/notifications'); }}
                  style={{
                    width: '100%', padding: '9px',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    border: 'none', borderRadius: '10px',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  Voir toutes les notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Dark Mode Toggle (1 seul) ─── */}
        <button
          className={`theme-toggle-btn${isDark ? ' theme-toggle-btn--dark' : ''}`}
          onClick={toggleTheme}
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          aria-label="Toggle dark mode"
        >
          <span className="theme-toggle-bg" />
          <span className="theme-toggle-stars"><span /><span /><span /></span>
          <span className="theme-toggle-face">
            <span className="theme-toggle-rays">
              {[...Array(8)].map((_, i) => <span key={i} className="ray" style={{ '--i': i }} />)}
            </span>
            <span className="theme-toggle-core" />
          </span>
        </button>

        {/* User Dropdown */}
        <div className="topbar-user-wrap" ref={menuRef}>
          <button className="topbar-user-btn" onClick={() => { setShowUserMenu(v => !v); setShowNotifPanel(false); }}>
            <span className="topbar-user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user?.name}</span>
              <span className="topbar-user-role">Employé Pharmacien</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showUserMenu ? 'rotate(180deg)' : 'none' }} />
          </button>

          {showUserMenu && (
            <div className="topbar-user-dropdown">
              <div className="topbar-dropdown-header">
                <div className="topbar-user-avatar" style={{ width: 40, height: 40, fontSize: '1rem' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
              </div>
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Déconnexion
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
export default function PharmacienLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState({});
  const [pendingPrescriptionsCount, setPendingPrescriptionsCount] = useState(0);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const toggleGroup = (label) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    let cancelled = false;
    const fetchPendingCount = async () => {
      try {
        const res = await axios.get('/pharmacien/prescriptions/pending');
        if (!cancelled && res.data.success) {
          setPendingPrescriptionsCount((res.data.prescriptions || []).length);
        }
      } catch (e) {
        // Non-blocking — the badge simply stays at 0 if this fails.
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); // refresh every minute
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const navGroups = buildNavGroups(pendingPrescriptionsCount);

  return (
    <div className="admin-layout">
      {/* Sidebar — same structure/classes as admin */}
      <aside className="sidebar-admin">
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '12px',
              background: 'linear-gradient(135deg, #2ebb80 0%, #0d9488 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 4px 12px rgba(46,187,128,0.4)'
            }}>
              <HeartPulse size={20} style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-logo-text">ParaPharma</div>
              <div className="sidebar-logo-sub">Espace Employé</div>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" title="Voir la boutique"
              style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="sidebar-nav">
          {navGroups.map(group => (
            <div key={group.label} className="sidebar-group">
              <button
                className="sidebar-group-title"
                onClick={() => toggleGroup(group.label)}
              >
                <span>{group.label}</span>
                {collapsed[group.label]
                  ? <ChevronRight size={12} />
                  : <ChevronDown size={12} />}
              </button>

              {!collapsed[group.label] && group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="icon">
                    <item.icon size={17} />
                  </span>
                  <span>{item.label}</span>
                  {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Employé Pharmacien</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={15} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <PharmacienTopbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
