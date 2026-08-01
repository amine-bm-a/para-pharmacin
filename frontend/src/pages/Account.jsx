import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUserNotif } from '../context/UserNotifContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
  User, ShoppingBag, Heart, FileText, Activity, MapPin, Award,
  Bell, Tag, HelpCircle, Settings, LogOut, Search, ShoppingCart,
  Menu, X, Upload,
  ExternalLink, MessageSquare, Phone, ChevronDown, ChevronUp, Copy,
  Check, Key, Eye, EyeOff, Sparkles, Plus, Trash, Sun, Moon,
  Star, MessageCircle, Send, RefreshCw
} from 'lucide-react';
import Loyalty from './account/Loyalty';
import Subscriptions from './account/Subscriptions';
import AccountReferrals from './account/AccountReferrals';
import PWANotifications from '../components/account/PWANotifications';

// Fallback recommendations if empty
const FALLBACK_PRODUCTS = [
  { id: 101, name: 'CeraVe Crème Hydratante 454g', price: 185, image_url: '', slug: 'cerave-creme-hydratante-454g', stock: 12 },
  { id: 102, name: 'La Roche-Posay Anthelios SPF50+', price: 169, image_url: '', slug: 'la-roche-posay-anthelios-spf50', stock: 8 },
  { id: 103, name: 'Vichy Mineral 89 Booster Quotidien', price: 210, image_url: '', slug: 'vichy-mineral-89-booster', stock: 15 },
  { id: 104, name: 'Bioderma Sensibio H2O 500ml', price: 125, image_url: '', slug: 'bioderma-sensibio-h2o-500ml', stock: 0 }
];

export default function Account() {
  const { user, logout } = useAuth();
  const { addToCart, getCartCount } = useCart();
  const { wishlist } = useWishlist() || { wishlist: [] };
  const { unreadCount, notifications, loading: notifLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotif } = useUserNotif() || {};
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Sidebar controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('showDashboard');
    return saved !== 'false'; // Default to true
  });

  // Loaded data
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Reviews state
  const [myReviews, setMyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get('/my-reviews');
      if (res.data.success) setMyReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Health Profile State
  const [healthProfile, setHealthProfile] = useState({
    skin_type: 'sensitive',
    hair_type: 'normal',
    allergies: 'Aucune allergie connue',
    preferred_brands: 'CeraVe, La Roche-Posay',
    health_preferences: 'organic',
    emergency_contact: 'Ahmed Benmoussa - 0612345678'
  });
  const [savingHealth, setSavingHealth] = useState(false);

  // Settings states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    two_factor_enabled: user?.two_factor_enabled || false
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });

  // Standalone prescription uploads simulation
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescFile, setPrescFile] = useState(null);
  const [prescUploading, setPrescUploading] = useState(false);

  // Copy coupon feedback state
  const [copiedCode, setCopiedCode] = useState('');

  // Expandable FAQ states
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Fetch client orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Load health profile if defined
      if (user.health_profile) {
        setHealthProfile(prev => ({ ...prev, ...user.health_profile }));
      }
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        two_factor_enabled: !!user.two_factor_enabled
      });
      // Load addresses
      const savedAddrs = localStorage.getItem(`addresses_${user.id}`);
      setAddresses(savedAddrs ? JSON.parse(savedAddrs) : []);

      // Load mock prescriptions
      const savedPrescs = localStorage.getItem(`prescriptions_${user.id}`);
      setPrescriptions(savedPrescs ? JSON.parse(savedPrescs) : [
        { id: 201, date: '10/07/2026', fileName: 'ordonnance_juillet.pdf', status: 'approved' },
        { id: 202, date: '28/06/2026', fileName: 'ordonnance_skincare.png', status: 'approved' }
      ]);
    }
  }, [user]);

  // Handle updates
  const handleSaveHealthProfile = async (e) => {
    e.preventDefault();
    setSavingHealth(true);
    try {
      const res = await axios.put('/profile', {
        name: user.name,
        email: user.email,
        phone: user.phone,
        health_profile: healthProfile
      });
      if (res.data.success) {
        notifSuccess('Profil de santé mis à jour !');
      }
    } catch (err) {
      notifError('Erreur de mise à jour.');
    } finally {
      setSavingHealth(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/profile', profileForm);
      if (res.data.success) {
        notifSuccess('Informations personnelles mises à jour.');
      }
    } catch (err) {
      notifError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      notifError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const res = await axios.put('/password', passwordForm);
      if (res.data.success) {
        notifSuccess('Mot de passe changé avec succès !');
        setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      }
    } catch (err) {
      notifError(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  // Reorder logic
  const handleReorder = (orderItems) => {
    if (!orderItems || orderItems.length === 0) return;
    orderItems.forEach(item => {
      if (item.product) {
        addToCart(item.product, item.quantity);
      }
    });
    notifSuccess(`${orderItems.length} article(s) ajoutés à votre panier.`);
    navigate('/cart');
  };

  // Address logic
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      ...addressForm,
      id: editingAddressId || Date.now()
    };
    let list = [...addresses];
    if (editingAddressId) {
      list = list.map(a => a.id === editingAddressId ? newAddr : a);
    } else {
      list.push(newAddr);
    }
    if (newAddr.isDefault) {
      list = list.map(a => a.id === newAddr.id ? a : { ...a, isDefault: false });
    }
    setAddresses(list);
    localStorage.setItem(`addresses_${user.id}`, JSON.stringify(list));
    setAddressForm({ label: '', address: '', city: '', postalCode: '', phone: '', isDefault: false });
    setShowAddressForm(false);
    setEditingAddressId(null);
    notifSuccess('Adresse enregistrée.');
  };

  const handleDeleteAddress = (id) => {
    const list = addresses.filter(a => a.id !== id);
    setAddresses(list);
    localStorage.setItem(`addresses_${user.id}`, JSON.stringify(list));
    notifSuccess('Adresse supprimée.');
  };

  // Prescription upload logic
  const handlePrescriptionUpload = (e) => {
    e.preventDefault();
    if (!prescFile) return;
    setPrescUploading(true);
    setTimeout(() => {
      const newPresc = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        fileName: prescFile.name,
        status: 'pending'
      };
      const list = [newPresc, ...prescriptions];
      setPrescriptions(list);
      localStorage.setItem(`prescriptions_${user.id}`, JSON.stringify(list));
      setPrescFile(null);
      setPrescUploading(false);
      notifSuccess('Ordonnance soumise avec succès.');
    }, 1500);
  };

  // Toast feedback wrappers
  const notifSuccess = (msg) => {
    alert(`✅ ${msg}`);
  };
  const notifError = (msg) => {
    alert(`❌ ${msg}`);
  };

  const handleCopyCoupon = (codeStr) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(codeStr);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Menu Definition
  const menuItems = [
    ...(showDashboard ? [{ key: 'dashboard', label: 'Tableau de bord', icon: <ShoppingBag size={18} /> }] : []),
    { key: 'orders', label: 'Mes commandes', icon: <ShoppingCart size={18} /> },
    { key: 'subscriptions', label: 'Mes abonnements', icon: <RefreshCw size={18} /> },
    { key: 'wishlist', label: 'Ma Liste de favoris', icon: <Heart size={18} /> },
    { key: 'reviews', label: 'Mes Avis', icon: <Star size={18} /> },
    { key: 'prescriptions', label: 'Mes Ordonnances', icon: <FileText size={18} /> },
    { key: 'health', label: 'Profil de Santé', icon: <Activity size={18} /> },
    { key: 'addresses', label: 'Adresses', icon: <MapPin size={18} /> },
    { key: 'loyalty', label: 'Programme Fidélité', icon: <Award size={18} /> },
    { key: 'notifications', label: 'Centre de Notifications', icon: <Bell size={18} />, badge: unreadCount > 0 },
    { key: 'offers', label: 'Offres exclusives', icon: <Tag size={18} /> },
    { key: 'help', label: 'Centre d\'aide', icon: <HelpCircle size={18} /> },
    { key: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  const handleToggleDashboard = () => {
    const newValue = !showDashboard;
    setShowDashboard(newValue);
    localStorage.setItem('showDashboard', String(newValue));
    // If we're hiding dashboard and currently on dashboard tab, switch to orders
    if (!newValue && activeTab === 'dashboard') {
      setActiveTab('orders');
    }
  };

  // Load my reviews when the tab is activated
  React.useEffect(() => {
    if (activeTab === 'reviews') fetchMyReviews();
  }, [activeTab]);

  // Helper values
  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const wishlistCount = wishlist?.length || 0;
  const loyaltyPoints = user?.loyalty_points || 120;
  const lastPurchase = orders.length > 0 ? orders[0] : null;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-subtle)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* ========================================================
          SIDEBAR (Collapsible & Premium)
         ======================================================== */}
      <aside style={{
        width: isSidebarCollapsed ? '80px' : '280px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        zIndex: 100,
        position: 'relative'
      }} className="desktop-sidebar">

        {/* Logo / Brand Header */}
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-light)',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), #8FAF9B)',
            display: 'flex', alignItems: 'center', justifyItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem'
          }}>
            M
          </div>
          {!isSidebarCollapsed && (
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-title)', display: 'block', color: 'var(--primary)' }}>Ben Moussa</span>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)', fontWeight: 700 }}>Espace Client</span>
            </div>
          )}
        </div>

        {/* User Card */}
        {!isSidebarCollapsed && (
          <div style={{
            padding: '24px 20px',
            margin: '16px',
            background: 'var(--bg-warm)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Client'}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={12} /> Silver Member
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setIsMobileSidebarOpen(false);
                  // Fetch real notifications from DB when opening the panel
                  if (item.key === 'notifications' && fetchNotifications) {
                    fetchNotifications();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && <span>{item.label}</span>}
                {item.badge && !isSidebarCollapsed && (
                  <span style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%'
                  }} />
                )}
              </button>
            );
          })}

          {/* Collapsible toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              marginTop: 'auto',
              border: 'none',
              background: 'transparent',
              padding: '12px',
              cursor: 'pointer',
              color: 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSidebarCollapsed ? '→' : '← Réduire le menu'}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </nav>
      </aside>

      {/* ========================================================
          MAIN APP CONTENT CONTAINER
         ======================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ========================================================
            TOP BAR NAVIGATION
           ======================================================== */}
        <header style={{
          height: '70px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'none',
              padding: '6px',
              color: 'var(--text)'
            }}
            className="mobile-menu-btn"
          >
            <Menu size={24} />
          </button>

          {/* Global Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Rechercher des soins, vitamines, marques..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') navigate(`/recherche?q=${searchQuery}`); }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-subtle)',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          {/* Action links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Boutique Link */}
            <Link to="/" style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}>
              Retourner à la boutique <ExternalLink size={14} />
            </Link>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px', color: 'var(--text)' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0',
                  background: '#ef4444', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 850,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveTab('wishlist')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px', color: 'var(--text)' }}
            >
              <Heart size={20} style={{ color: '#e54b4b' }} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0',
                  background: 'var(--primary)', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <Link to="/cart" style={{ background: 'transparent', textDecoration: 'none', position: 'relative', padding: '6px', color: 'var(--text)' }}>
              <ShoppingCart size={20} style={{ color: 'var(--primary)' }} />
              {getCartCount() > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0',
                  background: 'var(--accent)', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text)', transition: 'all 0.2s'
              }}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }} />

            {/* Profile Avatar */}
            <div
              onClick={() => setActiveTab('settings')}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ========================================================
            TAB VIEW DISPLAY
           ======================================================== */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Personalized Hero Banner */}
              <div style={{
                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-warm))',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 42px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ zIndex: 2 }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{new Date().getHours() < 17 ? 'Bonjour' : 'Bonsoir'}, {user?.name || 'Client'}</span>
                    <span style={{ animation: 'wave 2s infinite' }}>👋</span>
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '0 0 24px 0', maxWidth: '480px' }}>
                    Bienvenue dans votre espace santé et beauté parapharmaceutique. Retrouvez vos ordonnances, votre programme fidélité et vos commandes.
                  </p>
                  <button
                    onClick={() => setActiveTab('health')}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '12px 24px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(46, 125, 91, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <span>Mon profil de santé</span>
                    <Sparkles size={16} color="var(--accent)" />
                  </button>
                </div>

                {/* SVG Illustration on Right */}
                <div style={{ width: '160px', height: '160px', opacity: 0.85 }} className="hero-illustration">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="rgba(143, 175, 155, 0.15)" />
                    <rect x="70" y="50" width="60" height="90" rx="8" fill="var(--primary)" />
                    <circle cx="100" cy="80" r="16" fill="var(--accent)" />
                    <path d="M92 80H108M100 72V88" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    <rect x="80" y="110" width="40" height="6" rx="3" fill="#ffffff" opacity="0.8" />
                    <circle cx="50" cy="140" r="20" fill="rgba(201, 169, 106, 0.2)" />
                    <circle cx="150" cy="60" r="24" fill="rgba(46, 125, 91, 0.1)" />
                  </svg>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {[
                  { label: 'Commandes actives', val: activeOrdersCount, sub: 'À livrer', icon: <ShoppingBag size={20} color="var(--primary)" /> },
                  { label: 'Points de fidélité', val: loyaltyPoints, sub: 'Statut : Silver Member', icon: <Award size={20} color="var(--accent)" /> },
                  { label: 'Articles sauvegardés', val: wishlistCount, sub: 'Dans votre liste', icon: <Heart size={20} color="#e54b4b" /> },
                  { label: 'Dernier achat', val: lastPurchase ? `#${lastPurchase.order_number.substring(0, 10)}...` : 'Aucun', sub: lastPurchase ? new Date(lastPurchase.created_at).toLocaleDateString('fr-FR') : 'Parcourir nos produits', icon: <ShoppingCart size={20} color="var(--text)" /> },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'var(--bg-subtle)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{card.label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>{card.val}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>{card.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main row grid (Timeline & Health Profiles Quick view) */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', flexWrap: 'wrap' }} className="dashboard-grid">

                {/* Recent Order Timeline widget */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={18} color="var(--primary)" />
                    <span>Dernière commande passée</span>
                  </h3>

                  {orders.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Aucune commande passée.
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Commande #{orders[0].order_number}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                            Montant : {parseFloat(orders[0].total_amount).toFixed(2)} MAD
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          style={{
                            background: 'none', border: 'none', color: 'var(--primary)',
                            fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                          }}
                        >
                          Suivre ma livraison →
                        </button>
                      </div>

                      {/* Interactive visual timeline */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '32px' }}>
                        <div style={{
                          position: 'absolute', top: '12px', left: '16px', right: '16px',
                          height: '2px', background: 'var(--border-light)', zIndex: 1
                        }} />

                        {[
                          { key: 'pending', label: 'Confirmée' },
                          { key: 'preparing', label: 'Préparation' },
                          { key: 'shipped', label: 'Expédiée' },
                          { key: 'delivered', label: 'Livrée' },
                        ].map((step, sIdx) => {
                          const statusIndexMap = { pending: 0, preparing: 1, shipped: 2, delivered: 3, cancelled: -1 };
                          const currentStepIndex = statusIndexMap[orders[0].status] ?? 0;
                          const isDone = sIdx <= currentStepIndex;

                          return (
                            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, width: '60px' }}>
                              <div style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: isDone ? 'var(--primary)' : 'var(--bg-card)',
                                border: `2px solid ${isDone ? 'var(--primary)' : 'var(--border)'}`,
                                color: isDone ? 'white' : 'var(--text-light)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 800
                              }}>
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: isDone ? 'var(--text)' : 'var(--text-light)', fontWeight: 700, marginTop: '8px', textAlign: 'center' }}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Micro Health profile Summary Widget */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} color="var(--primary)" />
                      <span>Mon Profil de Santé</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Type de peau</span>
                        <strong style={{ fontSize: '0.88rem', textTransform: 'capitalize' }}>{healthProfile.skin_type}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Préférence parapharmaceutique</span>
                        <strong style={{ fontSize: '0.88rem', textTransform: 'capitalize' }}>{healthProfile.health_preferences === 'organic' ? 'Naturel & Bio' : 'Classique'}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('health')}
                    style={{
                      marginTop: '20px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                  >
                    Mettre à jour mes infos
                  </button>
                </div>
              </div>

              {/* Horizontal slider of recommended products */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 20px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--accent)" />
                  <span>Recommandé pour vous</span>
                </h3>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px' }} className="recommended-slider">
                  {FALLBACK_PRODUCTS.map(p => (
                    <div
                      key={p.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        minWidth: '220px',
                        maxWidth: '220px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <div style={{
                          width: '100%', height: '120px', borderRadius: '10px',
                          background: 'var(--bg-subtle)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
                        }}>
                          <span style={{ fontSize: '2.5rem' }}>💊</span>
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </h4>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
                          {p.price} MAD
                        </div>
                      </div>

                      <button
                        onClick={() => { addToCart(p, 1); notifSuccess('Produit ajouté au panier.'); }}
                        style={{
                          width: '100%',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Mes Commandes</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Historique d'achats et suivi des colis.</p>
              </div>

              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ fontSize: '2.5rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⏳</div>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                  Aucune commande passée.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => {
                    const badge = getStatusBadgeStyle(order.status);
                    return (
                      <div
                        key={order.id}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-light)',
                          padding: '24px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {/* Order info row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>#{order.order_number}</strong>
                              <span style={{
                                background: badge.bg, color: badge.color,
                                padding: '3px 8px', borderRadius: '12px',
                                fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase'
                              }}>
                                {badge.text}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                              {parseFloat(order.total_amount).toFixed(2)} MAD
                            </span>
                          </div>
                        </div>

                        {/* List of items inside order */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                          {(order.order_items || order.items || []).map(it => (
                            <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {it.product?.name || `Produit #${it.product_id}`} <strong style={{ color: 'var(--text)' }}>x{it.quantity}</strong>
                              </span>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                {parseFloat(it.price).toFixed(2)} MAD
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions Row */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => navigate(`/suivi-commande/${order.id}`)}
                            style={{
                              background: 'var(--primary-light)', color: 'var(--primary)',
                              border: 'none', borderRadius: '8px', padding: '10px 16px',
                              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                            }}
                          >
                            Suivre mon colis
                          </button>

                          <button
                            onClick={() => handleReorder(order.order_items || order.items)}
                            style={{
                              background: 'var(--primary)', color: 'white',
                              border: 'none', borderRadius: '8px', padding: '10px 16px',
                              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                          >
                            <ShoppingCart size={14} /> Recommander
                          </button>

                          <button
                            onClick={() => alert('Téléchargement de la facture PDF...')}
                            style={{
                              background: 'transparent', border: '1px solid var(--border)',
                              borderRadius: '8px', padding: '10px 16px',
                              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                              color: 'var(--text-muted)'
                            }}
                          >
                            Facture PDF
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Ma Liste de favoris</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Retrouvez les produits enregistrés.</p>
              </div>

              {wishlistItems().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                  <Heart size={44} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Votre liste est vide.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px'
                }}>
                  {wishlistItems().map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{
                          height: '110px', background: 'var(--bg-subtle)', borderRadius: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
                        }}>
                          <span style={{ fontSize: '2rem' }}>💊</span>
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 6px 0' }}>{item.name}</h4>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '14px' }}>
                          {item.price} MAD
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => { addToCart(item, 1); notifSuccess('Produit ajouté au panier.'); }}
                          style={{
                            flex: 1, background: 'var(--primary)', color: 'white',
                            border: 'none', borderRadius: '8px', padding: '8px',
                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                          }}
                        >
                          Acheter
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          style={{
                            background: 'var(--danger-light)', color: 'var(--danger)',
                            border: 'none', borderRadius: '8px', padding: '8px 12px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRESCRIPTION CENTER */}
          {activeTab === 'prescriptions' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Mes Ordonnances</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Soumettez ou gérez vos ordonnances médicales.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', flexWrap: 'wrap' }} className="presc-grid">

                {/* Upload Section */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} color="var(--primary)" />
                    <span>Nouvelle ordonnance</span>
                  </h3>

                  <form onSubmit={handlePrescriptionUpload}>
                    <div style={{
                      border: '2px dashed var(--border)', borderRadius: '12px',
                      padding: '24px 16px', textAlign: 'center', background: 'var(--bg-subtle)',
                      cursor: 'pointer', marginBottom: '20px', position: 'relative'
                    }}>
                      <Upload size={32} style={{ color: 'var(--text-light)', marginBottom: '10px' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                        {prescFile ? prescFile.name : 'Sélectionner un scan/PDF'}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Fichiers max: 5Mo (PDF, JPG, PNG)
                      </span>
                      <input
                        type="file"
                        onChange={e => setPrescFile(e.target.files[0])}
                        style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          opacity: 0, cursor: 'pointer'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!prescFile || prescUploading}
                      style={{
                        width: '100%', background: prescFile ? 'var(--primary)' : 'var(--border)',
                        color: 'white', border: 'none', borderRadius: '8px',
                        padding: '12px', fontWeight: 700, fontSize: '0.88rem',
                        cursor: prescFile ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                      }}
                    >
                      {prescUploading ? 'Téléchargement...' : 'Soumettre l\'ordonnance'}
                    </button>
                  </form>
                </div>

                {/* History Section */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0' }}>Historique des validations</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {prescriptions.map(presc => (
                      <div
                        key={presc.id}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 18px', background: 'var(--bg-subtle)', borderRadius: '10px',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{presc.fileName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '2px' }}>
                            Soumise le {presc.date}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            background: presc.status === 'approved' ? 'var(--success-light)' : 'rgba(245, 158, 11, 0.1)',
                            color: presc.status === 'approved' ? 'var(--success)' : '#f59e0b',
                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700
                          }}>
                            {presc.status === 'approved' ? 'Validée' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: MY HEALTH PROFILE */}
          {activeTab === 'health' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Profil de Santé</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Configurez vos préférences de soin et allergies pour des suggestions sur mesure.</p>
              </div>

              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', padding: '32px',
                boxShadow: 'var(--shadow-sm)', maxWidth: '700px'
              }}>
                <form onSubmit={handleSaveHealthProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                    {/* Skin type selector */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Type de peau</label>
                      <select
                        value={healthProfile.skin_type}
                        onChange={e => setHealthProfile({ ...healthProfile, skin_type: e.target.value })}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                          color: 'var(--text)', outline: 'none'
                        }}
                      >
                        <option value="sensitive">Sensible</option>
                        <option value="dry">Sèche</option>
                        <option value="oily">Grasse</option>
                        <option value="combination">Mixte</option>
                        <option value="normal">Normale</option>
                      </select>
                    </div>

                    {/* Hair type selector */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Type de cheveux</label>
                      <select
                        value={healthProfile.hair_type}
                        onChange={e => setHealthProfile({ ...healthProfile, hair_type: e.target.value })}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                          color: 'var(--text)', outline: 'none'
                        }}
                      >
                        <option value="normal">Normal</option>
                        <option value="dry">Sec</option>
                        <option value="oily">Gras</option>
                        <option value="curly">Bouclé / Crépus</option>
                        <option value="treated">Colorés / Traités</option>
                      </select>
                    </div>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                    {/* Preferences */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Préférences parapharmaceutiques</label>
                      <select
                        value={healthProfile.health_preferences}
                        onChange={e => setHealthProfile({ ...healthProfile, health_preferences: e.target.value })}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                          color: 'var(--text)', outline: 'none'
                        }}
                      >
                        <option value="organic">Naturel & Bio</option>
                        <option value="vegan">Végan / Cruelty-free</option>
                        <option value="classic">Classique / Dermocosmetique</option>
                      </select>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Contact d'urgence</label>
                      <input
                        type="text"
                        value={healthProfile.emergency_contact}
                        onChange={e => setHealthProfile({ ...healthProfile, emergency_contact: e.target.value })}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                          color: 'var(--text)', outline: 'none'
                        }}
                      />
                    </div>

                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Allergies ou Contre-indications</label>
                    <input
                      type="text"
                      value={healthProfile.allergies}
                      onChange={e => setHealthProfile({ ...healthProfile, allergies: e.target.value })}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '8px',
                        border: '1px solid var(--border)', background: 'var(--bg-subtle)',
                        color: 'var(--text)', outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingHealth}
                    style={{
                      background: 'var(--primary)', color: 'white', border: 'none',
                      borderRadius: '8px', padding: '12px 28px', fontWeight: 700,
                      cursor: 'pointer', boxShadow: '0 4px 15px rgba(46, 125, 91, 0.25)'
                    }}
                  >
                    {savingHealth ? 'Sauvegarde...' : 'Enregistrer mon profil santé'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Mes Adresses</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Gérez vos coordonnées de livraison.</p>
                </div>
                <button
                  onClick={() => { setShowAddressForm(true); setEditingAddressId(null); }}
                  style={{
                    background: 'var(--primary)', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '10px 20px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Plus size={16} /> Ajouter une adresse
                </button>
              </div>

              {/* Form card */}
              {showAddressForm && (
                <div style={{
                  background: 'var(--bg-card)', border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius-lg)', padding: '28px',
                  boxShadow: 'var(--shadow-md)', marginBottom: '32px', maxWidth: '600px'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0' }}>
                    {editingAddressId ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
                  </h3>
                  <form onSubmit={handleSaveAddress}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Libellé (ex: Maison)</label>
                        <input
                          type="text"
                          required
                          value={addressForm.label}
                          onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Téléphone</label>
                        <input
                          type="text"
                          required
                          value={addressForm.phone}
                          onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Adresse complète</label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Ville</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Code Postal</label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      <label htmlFor="isDefault" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Définir comme adresse principale</label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Enregistrer</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 20px', color: 'var(--text-muted)', cursor: 'pointer' }}>Annuler</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses list */}
              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                  Aucune adresse enregistrée.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      style={{
                        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                        border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        padding: '24px', boxShadow: 'var(--shadow-sm)',
                        display: 'flex', flexDirection: 'column', justifyItems: 'space-between',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{addr.label}</strong>
                          {addr.isDefault && (
                            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>Principale</span>
                          )}
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {addr.address}<br />
                          {addr.postalCode} {addr.city}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '20px' }}>
                          📞 {addr.phone}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                        <button
                          onClick={() => { setAddressForm(addr); setEditingAddressId(addr.id); setShowAddressForm(true); }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: LOYALTY PROGRAM */}
          {activeTab === 'loyalty' && <Loyalty />}

          {/* TAB 7.5: SUBSCRIPTIONS PROGRAM */}
          {activeTab === 'subscriptions' && <Subscriptions />}

          {/* TAB 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    Centre de Notifications
                    {unreadCount > 0 && (
                      <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 800 }}>
                        {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Suivi de vos commandes, alertes santé et messages de la pharmacie.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => fetchNotifications && fetchNotifications()}
                    style={{
                      background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)',
                      borderRadius: '8px', padding: '8px 14px', fontWeight: 600,
                      fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    🔄 Actualiser
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        background: 'var(--primary-light)', color: 'var(--primary)', border: 'none',
                        borderRadius: '8px', padding: '8px 16px', fontWeight: 700,
                        fontSize: '0.82rem', cursor: 'pointer'
                      }}
                    >
                      ✓ Tout marquer comme lu
                    </button>
                  )}
                </div>
              </div>

              {notifLoading ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Chargement des notifications…</p>
                </div>
              ) : (notifications || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔔</div>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>Aucune notification reçue pour le moment.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(notifications || []).map(notif => {
                    const d = new Date(notif.created_at);
                    const now = new Date();
                    const diffMin = Math.floor((now - d) / 60000);
                    let timeAgo = "À l'instant";
                    if (diffMin >= 1 && diffMin < 60) timeAgo = `Il y a ${diffMin} min`;
                    else if (diffMin >= 60 && diffMin < 1440) timeAgo = `Il y a ${Math.floor(diffMin / 60)}h`;
                    else if (diffMin >= 1440 && diffMin < 10080) timeAgo = `Il y a ${Math.floor(diffMin / 1440)} jour(s)`;
                    else if (notif.created_at) timeAgo = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

                    const icon = { order: '📦', payment: '💳', prescription: '💊', promo: '🎁', system: '⚙️' }[notif.type] || '🔔';

                    return (
                      <div
                        key={notif.id}
                        style={{
                          background: notif.is_read ? 'var(--bg-card)' : 'var(--bg-warm)',
                          border: '1px solid var(--border-light)',
                          borderLeft: `4px solid ${notif.is_read ? 'var(--border)' : 'var(--primary)'}`,
                          borderRadius: '14px',
                          padding: '18px 22px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                          opacity: notif.is_read ? 0.8 : 1,
                          boxShadow: notif.is_read ? 'none' : 'var(--shadow-sm)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Icon + Content */}
                        <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                          <span style={{
                            fontSize: '1.4rem', flexShrink: 0,
                            width: '42px', height: '42px', borderRadius: '12px',
                            background: 'var(--bg-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {icon}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>{notif.title}</strong>
                              {!notif.is_read && (
                                <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{notif.message}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>🕐 {timeAgo}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                          {!notif.is_read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              style={{
                                background: 'var(--primary-light)', border: 'none', color: 'var(--primary)',
                                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                                borderRadius: '6px', padding: '5px 10px'
                              }}
                            >
                              ✓ Lu
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotif(notif.id)}
                            style={{
                              background: 'var(--danger-light)', border: 'none', color: 'var(--danger)',
                              fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                              borderRadius: '6px', padding: '5px 10px'
                            }}
                          >
                            🗑 Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: OFFERS */}

          {activeTab === 'offers' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Offres exclusives & Coupons</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Bénéficiez de réductions personnalisées et saisonnières.</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { code: 'SANTÉ10', label: '10% sur la parapharmacie', desc: 'Valable sur l\'ensemble des produits de soin et beauté.', expiry: '31/12/2026' },
                  { code: 'BIENVENUE50', label: '50 MAD offerts dès 500 MAD', desc: 'Offre exclusive de bienvenue pour votre premier achat.', expiry: '30/09/2026' },
                ].map(coupon => (
                  <div
                    key={coupon.code}
                    style={{
                      background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-light)', padding: '24px',
                      boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between', borderLeft: '4px solid var(--accent)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>Bon de réduction</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Exp : {coupon.expiry}</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text)' }}>{coupon.label}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.4 }}>{coupon.desc}</p>
                    </div>

                    <div style={{
                      display: 'flex', background: 'var(--bg-subtle)', borderRadius: '8px',
                      border: '1px dashed var(--border)', padding: '10px',
                      alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{coupon.code}</code>
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        style={{
                          background: 'var(--primary)', color: 'white', border: 'none',
                          borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem',
                          fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {copiedCode === coupon.code ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedCode === coupon.code ? 'Copié' : 'Copier'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: HELP CENTER */}
          {activeTab === 'help' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Centre d'aide & Support</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Une question ? Nos pharmaciens et notre support sont à votre écoute.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', flexWrap: 'wrap' }} className="help-grid">

                {/* Contact options */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px 0' }}>Contact direct</h3>

                  <a
                    href="https://wa.me/212600000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px', background: '#25d366', color: 'white',
                      borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
                      fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <MessageSquare size={20} />
                    <span>Support WhatsApp</span>
                  </a>

                  <a
                    href="tel:0536000000"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px', background: 'var(--primary)', color: 'white',
                      borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
                      fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(46, 125, 91, 0.2)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Phone size={20} />
                    <span>Appeler la pharmacie</span>
                  </a>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    📍 Parapharmacie Ben Moussa Abbes, Oujda, Maroc.
                  </div>
                </div>

                {/* FAQ accordions */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0' }}>Questions fréquentes (FAQ)</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { q: 'Comment soumettre mon ordonnance ?', a: 'Vous pouvez importer votre ordonnance directement depuis l\'onglet "Mes Ordonnances" sous forme d\'image ou de PDF. Notre pharmacien la validera dans les plus brefs délais.' },
                      { q: 'Quels sont les délais de livraison à Oujda ?', a: 'Pour toute commande passée à Oujda, la livraison se fait dans la journée ou sous 24 heures maximum.' },
                      { q: 'Comment fonctionne le programme de points ?', a: 'Chaque achat sur notre parapharmacie en ligne vous fait gagner des points de fidélité que vous pourrez convertir en coupons de réduction ou cadeaux exclusifs.' },
                    ].map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          borderBottom: '1px solid var(--border-light)',
                          paddingBottom: '12px'
                        }}
                      >
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === fIdx ? null : fIdx)}
                          style={{
                            width: '100%', background: 'none', border: 'none',
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', cursor: 'pointer', textAlign: 'left',
                            padding: '8px 0', fontWeight: 700, fontSize: '0.9rem',
                            color: 'var(--text)'
                          }}
                        >
                          <span>{faq.q}</span>
                          {expandedFaq === fIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {expandedFaq === fIdx && (
                          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {faq.a}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-title)' }}>Paramètres du Compte</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>Gérez vos informations de connexion et préférences de sécurité.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', flexWrap: 'wrap' }} className="settings-grid">

                {/* Dashboard Toggle */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={18} color="var(--primary)" />
                    <span>Préférences d'affichage</span>
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Afficher le tableau de bord</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Afficher ou masquer le tableau de bord dans le menu latéral</div>
                    </div>
                    <button
                      onClick={handleToggleDashboard}
                      style={{
                        width: '50px',
                        height: '26px',
                        borderRadius: '13px',
                        background: showDashboard ? 'var(--primary)' : 'var(--border)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.3s'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: showDashboard ? '26px' : '2px',
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--primary)" />
                    <span>Informations personnelles</span>
                  </h3>

                  <form onSubmit={handleUpdateProfile}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nom complet</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Adresse e-mail</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Téléphone</label>
                      <input
                        type="text"
                        value={profileForm.phone || ''}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: 'var(--primary)', color: 'white', border: 'none',
                        borderRadius: '8px', padding: '10px 20px', fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Enregistrer
                    </button>
                  </form>
                </div>

                {/* Password / Security */}
                <div style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={18} color="var(--primary)" />
                    <span>Sécurité du compte</span>
                  </h3>

                  <form onSubmit={handleUpdatePassword}>
                    <div style={{ marginBottom: '14px', position: 'relative' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Mot de passe actuel</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordForm.current_password}
                        onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '34px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nouveau mot de passe</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordForm.new_password}
                        onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Confirmer le nouveau mot de passe</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordForm.new_password_confirmation}
                        onChange={e => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: 'var(--primary)', color: 'white', border: 'none',
                        borderRadius: '8px', padding: '10px 20px', fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Changer le mot de passe
                    </button>
                  </form>
                </div>

                {/* ── Notifications Push / PWA ── */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <PWANotifications />
                </div>

              </div>
            </div>
          )}

          {/* ── TAB: MES AVIS ── */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-title)', marginBottom: '6px' }}>Mes Avis</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Partagez votre expérience avec la communauté</p>
              </div>

              {/* Write a review */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)' }}>
                  <MessageCircle size={18} color="var(--primary)" /> Écrire un nouvel avis
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Votre note</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button"
                        onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star size={28} fill={star <= newReview.rating ? '#fbbf24' : 'none'} color={star <= newReview.rating ? '#fbbf24' : 'var(--border)'} />
                      </button>
                    ))}
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 600 }}>
                      {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][newReview.rating]}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Votre commentaire</label>
                  <textarea
                    value={newReview.comment}
                    onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                    placeholder="Décrivez votre expérience avec ce produit..."
                    rows={4}
                    style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '14px', color: 'var(--text)', fontSize: '0.92rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '16px', lineHeight: 1.5 }}>
                  ℹ️ Vous pouvez laisser un avis uniquement sur un produit que vous avez acheté. Chaque avis est vérifié avant publication.
                </p>

                <button
                  onClick={async () => {
                    if (!newReview.comment.trim()) { alert('Veuillez écrire un commentaire.'); return; }
                    notifSuccess('Votre avis a été soumis et sera publié après validation par notre équipe.');
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-title)', boxShadow: '0 4px 16px rgba(10,168,79,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(10,168,79,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(10,168,79,0.3)'; }}
                >
                  <Send size={16} /> Soumettre mon avis
                </button>
              </div>

              {/* My published reviews */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)' }}>
                  <Star size={18} color="var(--primary)" fill="var(--primary)" /> Mes avis publiés
                </h3>

                {reviewsLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chargement...</div>
                ) : myReviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>⭐</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px', fontSize: '1.05rem' }}>Aucun avis pour l'instant</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>Achetez un produit et partagez votre expérience avec la communauté.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myReviews.map(review => (
                      <div key={review.id} style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '6px' }}>{review.product?.name || 'Produit'}</div>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= review.rating ? '#fbbf24' : 'none'} color={s <= review.rating ? '#fbbf24' : 'var(--border)'} />)}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: review.status === 'approved' ? 'var(--primary-light)' : review.status === 'rejected' ? 'var(--danger-light)' : 'rgba(245,158,11,0.1)', color: review.status === 'approved' ? 'var(--primary)' : review.status === 'rejected' ? 'var(--danger)' : '#f59e0b' }}>
                            {review.status === 'approved' ? '✓ Publié' : review.status === 'rejected' ? '✕ Refusé' : '⏳ En attente'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>"{review.comment}"</p>
                        {review.admin_reply && (
                          <div style={{ background: 'var(--primary-light)', borderLeft: '4px solid var(--primary)', borderRadius: '8px', padding: '12px 16px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Réponse de la Pharmacie</div>
                            <p style={{ margin: 0, fontSize: '0.87rem', color: 'var(--text)', lineHeight: 1.5 }}>{review.admin_reply}</p>
                          </div>
                        )}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                          {new Date(review.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          MOBILE OVERLAY SIDEBAR DRAWER
         ======================================================== */}
      {isMobileSidebarOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex'
        }}>
          <div style={{ width: '280px', background: 'var(--bg-card)', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>Menu Client</span>
              <button onClick={() => setIsMobileSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {menuItems.map(item => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActiveTab(item.key); setIsMobileSidebarOpen(false); }}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      fontWeight: isActive ? 700 : 600, cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                  background: 'transparent', color: 'var(--danger)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  fontWeight: 700, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Embedded style overrides for animations and custom layouts */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        .recommended-slider::-webkit-scrollbar {
          height: 6px;
        }
        .recommended-slider::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        @media (max-width: 900px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .presc-grid, .loyalty-grid, .help-grid, .settings-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-illustration {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );

  // Quick list/set helpers for wishlist items mapping
  function wishlistItems() {
    const list = localStorage.getItem(`wishlist_${user?.id}`);
    return list ? JSON.parse(list) : [];
  }

  function removeFromWishlist(id) {
    const list = wishlistItems();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updated));
    // Trigger state change so wishlist tab updates
    setActiveTab('dashboard');
    setTimeout(() => setActiveTab('wishlist'), 10);
    notifSuccess('Produit retiré des favoris.');
  }

  function getStatusBadgeStyle(status) {
    const statusMap = {
      pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'Confirmée' },
      preparing: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: 'En cours de préparation' },
      shipped: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', text: 'Expédiée' },
      delivered: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Livrée' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Annulée' },
    };
    return statusMap[status] || { bg: 'var(--border-light)', color: 'var(--text-muted)', text: status };
  }
}
