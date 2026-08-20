import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  LayoutDashboard, ShoppingBag, Pill, FolderOpen, Tag,
  Package, Percent, Image, Users, ShieldCheck, Star, LogOut, HeartPulse,
  Truck, CreditCard, Settings, ChevronDown, ChevronRight,
  Bell, ExternalLink, Grid3X3, Store, BookOpen, Handshake, PanelLeftClose, PanelLeft,
  ScanBarcode
} from 'lucide-react';

const navGroups = [
  {
    label: 'Principal',
    items: [
      { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    ]
  },
  {
    label: 'Ventes',
    items: [
      { path: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
      { path: '/admin/promotions', label: 'Promotions', icon: Percent },
      { path: '/admin/coupons', label: 'Coupons', icon: CreditCard },
    ]
  },
  {
    label: 'Catalogue',
    items: [
      { path: '/admin/products', label: 'Produits', icon: Pill },
      { path: '/admin/categories', label: 'Catégories', icon: Grid3X3 },
      { path: '/admin/subcategories', label: 'Sous-Catégories', icon: FolderOpen },
      { path: '/admin/brands', label: 'Marques', icon: Tag },
      { path: '/admin/stocks', label: 'Stock', icon: Package },
      { path: '/admin/scan-stock', label: 'Scanner Produit', icon: ScanBarcode },
    ]
  },
  {
    label: 'Clients & Personnel',
    items: [
      { path: '/admin/clients', label: 'Clients', icon: Users },
      { path: '/admin/staff', label: 'Personnel & Rôles', icon: ShieldCheck },
      { path: '/admin/reviews', label: 'Avis', icon: Star },
    ]
  },
  {
    label: 'Logistique',
    items: [
      { path: '/admin/suppliers', label: 'Fournisseurs', icon: Store },
      { path: '/admin/deliveries', label: 'Livraisons', icon: Truck },
    ]
  },
  {
    label: 'Apparence',
    items: [
      { path: '/admin/banners', label: 'Bannières', icon: Image },
      { path: '/admin/blog', label: 'Blog CMS', icon: BookOpen },
      { path: '/admin/partners', label: 'Partenaires', icon: Handshake },
    ]
  },
  {
    label: 'Configuration',
    items: [
      { path: '/admin/notifications', label: 'Notifications', icon: Bell, isNotification: true },
      { path: '/admin/settings', label: 'Paramètres', icon: Settings },
      { path: '/admin/profile', label: 'Mon Profil', icon: Users },
    ]
  },
];

export default function SidebarAdmin({ isCollapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get('/notifications/unread-count');
        if (res.data.success) {
          setUnreadCount(res.data.count);
        }
      } catch (err) {
        // silently ignore polling errors
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const toggleGroup = (label) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={`sidebar-admin${isCollapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '12px',
            background: 'var(--admin-sidebar-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <HeartPulse size={20} style={{ color: 'var(--admin-sidebar-bg)' }} />
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-logo-text">ParaPharma</div>
              <div className="sidebar-logo-sub">Admin Panel</div>
            </div>
          )}
          {!isCollapsed && (
            <a href="/" title="Retourner à la boutique"
              style={{ color: 'var(--admin-sidebar-title)', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--admin-sidebar-title)'}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="sidebar-collapse-btn"
        title={isCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
      >
        {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        {!isCollapsed && <span>Réduire</span>}
      </button>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {navGroups.map(group => (
          <div key={group.label} className="sidebar-group">
            {!isCollapsed ? (
            <button
              className="sidebar-group-title"
              onClick={() => toggleGroup(group.label)}
            >
              <span>{group.label}</span>
              {collapsed[group.label]
                ? <ChevronRight size={12} />
                : <ChevronDown size={12} />}
            </button>
          ) : (
            <div style={{ borderTop: '1px solid var(--admin-sidebar-border)', margin: '6px 12px' }} />
          )}

            {!collapsed[group.label] && group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="icon">
                  <item.icon size={17} />
                </span>
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && item.badge && <span className="sidebar-badge">{item.badge}</span>}
                {item.isNotification && unreadCount > 0 && (
                  <span className="sidebar-badge" style={isCollapsed ? { position: 'absolute', top: 4, right: 4, fontSize: '0.55rem', padding: '1px 4px' } : {}}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Administrateur</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-logout-btn" title={isCollapsed ? 'Déconnexion' : undefined}>
          <LogOut size={15} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
