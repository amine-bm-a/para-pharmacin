import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserNotif } from '../../context/UserNotifContext';
import logo from '../../assets/logo.png';
import axios from 'axios';
import { createPortal } from 'react-dom';
import { Heart, ShoppingCart, User, Search, Bell, Sun, Moon } from 'lucide-react';
import ThemeToggleButton from '../ui/ThemeToggleButton';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchPosition, setSearchPosition] = useState({ top: 0, left: 0, width: 0 });
  const [userDropdownPosition, setUserDropdownPosition] = useState({ top: 0, right: 0 });
  const { user, logout, isAdmin, isPharmacien } = useAuth();
  const { getCartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useUserNotif() || { unreadCount: 0 };
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedUserDropdownPortal = e.target.closest('.user-dropdown-portal');
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !clickedUserDropdownPortal) {
        setShowUserDropdown(false);
      }
      const clickedSearchPortal = e.target.closest('.search-portal');
      if (searchRef.current && !searchRef.current.contains(e.target) && !clickedSearchPortal) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate search dropdown position
  useEffect(() => {
    if (showSearch && searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setSearchPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width
      });
    }
  }, [showSearch]);

  // Calculate user dropdown position
  useEffect(() => {
    if (showUserDropdown && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setUserDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [showUserDropdown]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await axios.get(`/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) setSearchResults(res.data.products.slice(0, 6));
      } catch { /* ignore search errors */ } finally { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleLogout = async () => { 
    await logout(); 
    setShowUserDropdown(false);
    navigate('/'); 
  };

  const cartCount = getCartCount ? getCartCount() : 0;
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist ? wishlist.length : 0;

  // Custom action button style (clean white pill/card with subtle border and shadow)
  const actionBtnStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    padding: '8px 14px',
    border: isDark ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid rgba(13, 60, 38, 0.08)',
    background: isDark ? '#1a1a2e' : '#ffffff',
    cursor: 'pointer',
    color: isDark ? '#ffffff' : '#0d3c26',
    fontSize: '0.72rem',
    fontWeight: 700,
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(13, 60, 38, 0.03)',
    minWidth: '76px',
    outline: 'none'
  };

  const handleBtnEnter = (e) => {
    const target = e.currentTarget;
    target.style.background = isDark ? '#23233c' : '#eef9f4';
    target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(13, 60, 38, 0.2)';
    target.style.transform = 'translateY(-2px)';
    target.style.boxShadow = isDark ? '0 6px 15px rgba(0, 0, 0, 0.4)' : '0 6px 15px rgba(13, 60, 38, 0.08)';
  };

  const handleBtnLeave = (e) => {
    const target = e.currentTarget;
    target.style.background = isDark ? '#1a1a2e' : '#ffffff';
    target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(13, 60, 38, 0.08)';
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = isDark ? 'none' : '0 2px 6px rgba(13, 60, 38, 0.03)';
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: 'linear-gradient(135deg, #e54b4b, #d12e2e)',
    color: 'white',
    fontSize: '0.68rem',
    fontWeight: 800,
    minWidth: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    boxShadow: '0 3px 8px rgba(229, 75, 75, 0.4)',
    border: '1.5px solid white'
  };

  return (
    <header className="main-header" style={{
      background: isDark ? 'linear-gradient(180deg, #0d0d1a 0%, #0d0d1a 100%)' : 'linear-gradient(180deg, #f2f8f5 0%, #ffffff 100%)',
      borderBottom: isDark ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(13, 60, 38, 0.08)',
      padding: '16px 0',
      position: 'relative',
      zIndex: 1000,
      boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(13, 60, 38, 0.05)',
      transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '32px',
        width: '100%'
      }}>
        {/* Logo & Title (Left aligned) */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={logo} 
              alt="Parapharmacie Ben Moussa" 
              style={{ 
                height: '46px', 
                width: 'auto', 
                objectFit: 'contain', 
                transition: 'transform 0.3s ease' 
              }} 
              onMouseEnter={(e) => { e.target.style.transform = 'scale(1.08) rotate(3deg)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1) rotate(0deg)'; }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span className="navbar-logo-text-top">
                Parapharmacie
              </span>
              <span className="navbar-logo-text-bottom">
                Ben Moussa
              </span>
            </div>
          </Link>
        </div>

        {/* Right side container grouping Search bar next to Account, Favorites, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end' }}>
          {/* Search */}
          <div style={{ width: '100%', maxWidth: '380px', position: 'relative' }} ref={searchRef}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 52px 12px 20px',
                  border: isDark ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid rgba(13, 60, 38, 0.15)',
                  borderRadius: '50px',
                  background: isDark ? '#16162a' : '#ffffff',
                  color: isDark ? '#ffffff' : '#000000',
                  fontSize: '0.92rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(13, 60, 38, 0.02)'
                }}
                placeholder="Rechercher un produit, une marque..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = isDark ? '#16162a' : '#ffffff';
                  e.target.style.boxShadow = isDark ? '0 0 0 4px rgba(46, 187, 128, 0.3)' : '0 0 0 4px rgba(16, 130, 89, 0.15)';
                  setShowSearch(true);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(13, 60, 38, 0.15)';
                  e.target.style.background = isDark ? '#16162a' : '#ffffff';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    setShowSearch(false);
                    setSearchQuery('');
                  }
                }}
              />
              <Search size={18} style={{ 
                position: 'absolute', 
                right: '18px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: isDark ? '#2ebb80' : '#0d3c26',
                opacity: 0.7,
                pointerEvents: 'none'
              }} />
            </div>
            {showSearch && searchQuery.length >= 2 && createPortal(
              <div className="search-portal" style={{ 
                position: 'fixed', 
                top: `${searchPosition.top}px`, 
                left: `${searchPosition.left}px`, 
                width: `${searchPosition.width}px`, 
                zIndex: 99999,
                background: isDark ? '#16162a' : 'white',
                borderRadius: '20px',
                boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.15)',
                border: isDark ? '2px solid rgba(255, 255, 255, 0.12)' : '2px solid var(--border-light)',
                overflow: 'hidden',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {searchLoading && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>🔍 Recherche en cours...</div>}
                {!searchLoading && searchResults.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>😔 Aucun résultat trouvé</div>
                )}
                {searchResults.map((p, idx) => (
                  <div 
                    key={p.id} 
                    onClick={() => { navigate(`/products/${p.slug}`); setShowSearch(false); setSearchQuery(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderBottom: idx !== searchResults.length - 1 ? '1px solid var(--border-light)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isDark ? '#16162a' : 'white';
                    }}
                  >
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: isDark ? '#111122' : 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0, 
                      overflow: 'hidden',
                      border: isDark ? '2px solid rgba(255, 255, 255, 0.08)' : '2px solid var(--border-light)'
                    }}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} /> : <span style={{ fontSize: '1.5rem' }}>💊</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{p.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>{parseFloat(p.price).toFixed(2)} MAD</div>
                    </div>
                    <span style={{ fontSize: '1.2rem', opacity: 0.5, color: isDark ? '#ffffff' : 'inherit' }}>→</span>
                  </div>
                ))}
              </div>,
              document.body
            )}
          </div>

          {/* Actions (Compte, Favoris, Panier) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Account */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button 
                onClick={() => user ? setShowUserDropdown(v => !v) : navigate('/login')}
                style={actionBtnStyle}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                <User size={20} strokeWidth={2.2} style={{ color: '#1a8f5c' }} />
                <span>{user ? user.name.split(' ')[0] : 'Compte'}</span>
              </button>
              {showUserDropdown && user && createPortal(
                <div className="user-dropdown-portal" style={{ 
                  position: 'fixed', 
                  top: `${userDropdownPosition.top}px`, 
                  right: `${userDropdownPosition.right}px`, 
                  background: isDark ? '#16162a' : 'white', 
                  border: isDark ? '2px solid rgba(255, 255, 255, 0.12)' : '2px solid var(--border-light)', 
                  borderRadius: '20px', 
                  boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.15)', 
                  minWidth: '240px', 
                  zIndex: 99999, 
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    padding: '16px 20px', 
                    background: isDark ? 'linear-gradient(135deg, #1f2937, #111827)' : 'linear-gradient(135deg, var(--primary-light), #e8f5e9)', 
                    borderBottom: isDark ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid var(--border-light)' 
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)', marginBottom: '4px' }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  {(
                    isAdmin
                      ? [
                          { label: '⚙️ Panel Administration', path: '/admin', highlight: true },
                          { label: '👤 Profil Admin', path: '/admin/profile' },
                        ]
                      : isPharmacien
                        ? [
                            { label: '💊 Espace Pharmacien', path: '/pharmacien', highlight: true },
                            { label: '👤 Profil Pharmacien', path: '/pharmacien/profile' },
                          ]
                        : [
                            { label: '👤 Mon compte', path: '/mon-compte' },
                            { label: '📦 Mes commandes', path: '/mes-commandes' },
                          ]
                  ).map(item => (
                    <Link key={item.path} to={item.path} onClick={() => setShowUserDropdown(false)}
                      style={{ 
                        display: 'block', 
                        padding: '14px 20px', 
                        fontSize: '0.9rem', 
                        color: item.highlight ? 'var(--primary)' : 'var(--text)', 
                        transition: 'all 0.2s ease', 
                        textDecoration: 'none',
                        fontWeight: item.highlight ? 800 : 600,
                        borderBottom: '1px solid var(--border-light)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = item.highlight ? 'var(--primary-light)' : 'var(--bg-subtle)';
                        e.target.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = isDark ? '#16162a' : 'white';
                        e.target.style.paddingLeft = '20px';
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '2px solid var(--border-light)' }}>
                    <button onClick={handleLogout}
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        padding: '14px 20px', 
                        fontSize: '0.9rem', 
                        color: '#FF6B6B', 
                        fontWeight: 700, 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,107,107,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                      }}
                    >
                      🚪 Déconnexion
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>

            {/* Favorites (Wishlist) */}
            <button 
              onClick={() => navigate('/favoris')} 
              style={actionBtnStyle}
              onMouseEnter={handleBtnEnter}
              onMouseLeave={handleBtnLeave}
            >
              <Heart size={20} strokeWidth={2.2} style={{ color: '#e54b4b' }} />
              <span>Favoris</span>
              {wishlistCount > 0 && (
                <span style={badgeStyle}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications Bell (clients only) */}
            {user && (
              <button
                onClick={() => navigate('/notifications')}
                style={{ ...actionBtnStyle, position: 'relative' }}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                <Bell size={20} strokeWidth={2.2} style={{ color: '#7c3aed' }} />
                <span>Alertes</span>
                {unreadCount > 0 && (
                  <span style={{
                    ...badgeStyle,
                    background: '#ef4444',
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <ThemeToggleButton />

            {/* Cart */}
            <button 
              onClick={() => navigate('/cart')} 
              style={actionBtnStyle}
              onMouseEnter={handleBtnEnter}
              onMouseLeave={handleBtnLeave}
            >
              <ShoppingCart size={20} strokeWidth={2.2} style={{ color: '#1a8f5c' }} />
              <span>Panier</span>
              {cartCount > 0 && (
                <span style={badgeStyle}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
