import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  LayoutDashboard, ShoppingBag, Pill, FolderOpen, Tag,
  Package, Percent, Image, Users, ShieldCheck, Star, LogOut, HeartPulse,
  Truck, CreditCard, Settings, ChevronDown, ChevronRight,
  Bell, ExternalLink, Grid3X3, Store, BookOpen, Handshake
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

export default function SidebarAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
        console.log('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const toggleGroup = (label) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
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
            <div className="sidebar-logo-sub">Admin Panel</div>
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
                {item.isNotification && unreadCount > 0 && (
                  <span className="sidebar-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
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
            <div className="sidebar-user-role">Administrateur</div>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut size={15} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
