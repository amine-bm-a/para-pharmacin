import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Truck,
  Clock,
  Phone,
  Lock,
  ShieldCheck,
  LogOut,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchAutocomplete from './SearchAutocomplete';
import logo from '../assets/logo.png';

/* ─── Category mega-menu data ─── */
const MEGA_MENU = [
  {
    label: 'Visage & Corps',
    slug: 'visage-corps',
    subcategories: [
      {
        label: 'Visage',
        slug: 'visage',
        items: [
          'Nettoyants & Démaquillants', 'Soins acné & imperfections',
          'Hydratation & Nutrition Visage', 'Eaux Thermales',
          'Soins anti-taches et dépigmentants', 'Éclat du teint & bonne mine',
          'Soins anti-âge', 'Soins anti-rides et ridules',
          'Soins anti-rougeurs', 'Masques & Gommages',
          'Peeling visage', 'Soins des cicatrices',
        ],
      },
      {
        label: 'Corps',
        slug: 'corps',
        items: [
          'Hydratation & Nutrition', 'Gommages & Exfoliants',
          'Épilation / décoloration', 'Jambes lourdes et circulation',
          'Fermeté & sublimateur', 'Soins raffermissants',
          'Détente & massages', 'Soin Anti-Taches Corps',
        ],
      },
      {
        label: 'Yeux & Lèvres',
        slug: 'yeux-levres',
        items: [
          'Contours des yeux', 'Démaquillant yeux',
          'Anti-cernes & poches', 'Soins lèvres',
          'Soins cils & sourcils',
        ],
      },
      {
        label: 'Mains & Pieds',
        slug: 'mains-pieds',
        items: [
          'Soins des mains', 'Soins des pieds',
        ],
        children: [
          {
            label: 'Les Ongles',
            slug: 'les-ongles',
            items: ['Vernis', 'Soins des ongles', 'Dissolvants', 'Kits Vernis'],
          },
        ],
      },
      {
        label: 'Maquillage',
        slug: 'maquillage',
        items: [
          'Teint', 'Yeux', 'Lèvres', 'Ongles', 'Accessoires',
        ],
      },
      {
        label: 'Parfums',
        slug: 'parfums',
        items: [
          'Parfums Femme', 'Parfums Homme', 'Coffrets Parfums',
        ],
      },
    ],
  },
  {
    label: 'Cheveux',
    slug: 'cheveux',
    subcategories: [
      {
        label: 'Shampoings',
        slug: 'shampoings',
        items: [
          'Anti-chute', 'Anti-pelliculaire', 'Cheveux secs',
          'Cheveux gras', 'Cheveux colorés', 'Usage fréquent',
        ],
      },
      {
        label: 'Soins & Masques',
        slug: 'soins-masques',
        items: [
          'Après-shampoings', 'Masques capillaires', 'Huiles capillaires',
          'Sérums capillaires', 'Leave-in',
        ],
      },
      {
        label: 'Coiffants',
        slug: 'coiffants',
        items: [
          'Gels & Cires', 'Mousses', 'Sprays fixants', 'Lissants',
        ],
      },
      {
        label: 'Colorations',
        slug: 'colorations',
        items: [
          'Colorations permanentes', 'Colorations temporaires',
          'Retouche racines',
        ],
      },
    ],
  },
  {
    label: 'Solaires',
    slug: 'solaires',
    subcategories: [
      {
        label: 'Protection Solaire',
        slug: 'protection-solaire',
        items: [
          'Crèmes solaires visage', 'Crèmes solaires corps',
          'Sprays solaires', 'Protection enfants',
          'Indice SPF 50+', 'Indice SPF 30',
        ],
      },
      {
        label: 'Après-Soleil',
        slug: 'apres-soleil',
        items: [
          'Lait après-soleil', 'Gel apaisant', 'Réparateur',
        ],
      },
      {
        label: 'Autobronzants',
        slug: 'autobronzants',
        items: [
          'Autobronzants visage', 'Autobronzants corps',
        ],
      },
    ],
  },
  {
    label: 'Hygiène & Santé',
    slug: 'hygiene-sante',
    subcategories: [
      {
        label: 'Hygiène Bucco-Dentaire',
        slug: 'bucco-dentaire',
        items: [
          'Dentifrices', 'Brosses à dents', 'Bains de bouche',
          'Fils dentaires',
        ],
      },
      {
        label: 'Hygiène Corporelle',
        slug: 'hygiene-corporelle',
        items: [
          'Gels douche', 'Savons', 'Déodorants', 'Hygiène intime',
        ],
      },
      {
        label: 'Santé & Bien-être',
        slug: 'sante-bien-etre',
        items: [
          'Douleurs & Fièvre', 'Digestion', 'Sommeil & Stress',
          'Circulation', 'Yeux fatigués',
        ],
      },
      {
        label: 'Bébé & Maman',
        slug: 'bebe-maman',
        items: [
          'Soins bébé', 'Change & toilette',
          'Grossesse & Allaitement', 'Soins maman',
        ],
      },
    ],
  },
  {
    label: 'Compléments Alimentaires',
    slug: 'complements-alimentaires',
    subcategories: [
      {
        label: 'Vitalité & Énergie',
        slug: 'vitalite-energie',
        items: [
          'Multivitamines', 'Fer', 'Magnésium', 'Vitamine C',
          'Vitamine D', 'Oméga 3',
        ],
      },
      {
        label: 'Minceur & Digestion',
        slug: 'minceur-digestion',
        items: [
          'Brûleurs de graisses', 'Draineurs', 'Probiotiques',
          'Transit',
        ],
      },
      {
        label: 'Beauté',
        slug: 'beaute-complements',
        items: [
          'Peau', 'Cheveux & Ongles', 'Anti-âge', 'Collagène',
        ],
      },
      {
        label: 'Immunité & Défenses',
        slug: 'immunite',
        items: [
          'Vitamine C', 'Zinc', 'Propolis', 'Échinacée',
        ],
      },
    ],
  },
  {
    label: 'Nature & Bio',
    slug: 'nature-bio',
    subcategories: [
      {
        label: 'Soins Bio Visage',
        slug: 'bio-visage',
        items: [
          'Crèmes bio', 'Sérums bio', 'Nettoyants bio',
          'Huiles végétales',
        ],
      },
      {
        label: 'Soins Bio Corps',
        slug: 'bio-corps',
        items: [
          'Laits bio', 'Beurres corporels', 'Huiles de massage',
        ],
      },
      {
        label: 'Huiles Essentielles',
        slug: 'huiles-essentielles',
        items: [
          'Lavande', 'Tea tree', 'Eucalyptus', 'Menthe poivrée',
          'Ravintsara',
        ],
      },
      {
        label: 'Aromathérapie',
        slug: 'aromatherapie',
        items: [
          'Diffuseurs', 'Synergies', 'Roll-on',
        ],
      },
    ],
  },
];

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Mobile drawer & mobile search states */
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null); // active parent index
  const [mobileSubAccordion, setMobileSubAccordion] = useState(null); // active sub index

  /* Mega-menu state for desktop & touch */
  const [openMenu, setOpenMenu] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(100, (y / docH) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  /* Close mobile menus on location change */
  useEffect(() => {
    setMobileDrawerOpen(false);
    setMobileSearchOpen(false);
    setOpenMenu(null);
  }, [location.pathname, location.search]);

  const clearClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
      setActiveSub(null);
      setActiveChild(null);
    }, 180);
  }, []);

  const handleCategoryEnter = (idx) => {
    clearClose();
    setOpenMenu(idx);
    setActiveSub(0);
    setActiveChild(null);
  };

  const handleCategoryClick = (idx, slug, e) => {
    // Touch/click toggle support
    if (openMenu === idx) {
      navigateAndClose(`/products?category=${slug}`);
    } else {
      clearClose();
      setOpenMenu(idx);
      setActiveSub(0);
      setActiveChild(null);
    }
  };

  const handleSubEnter = (idx) => {
    clearClose();
    setActiveSub(idx);
    setActiveChild(null);
  };

  const handleChildEnter = (idx) => {
    clearClose();
    setActiveChild(idx);
  };

  const navigateAndClose = (path) => {
    navigate(path);
    setOpenMenu(null);
    setActiveSub(null);
    setActiveChild(null);
    setMobileDrawerOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, var(--primary), #4ade80, var(--accent))',
        zIndex: 'var(--z-toast)',
        transition: 'width 0.1s linear',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px rgba(10,168,79,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Top Utility Bar — SVG Lucide Icons */}
      <div className="top-bar">
        <div className="container flex justify-between align-center">
          <div className="flex align-center gap-2">
            <Truck size={14} color="var(--primary-light)" style={{ flexShrink: 0 }} />
            <span>Livraison gratuite à Marrakech et partout au Maroc dès 700 DH</span>
          </div>
          <div className="flex align-center gap-3 hide-mobile">
            <div className="flex align-center gap-1">
              <Clock size={13} color="rgba(255,255,255,0.85)" />
              <span>Magasin Marrakech : 9h00 - 21h30</span>
            </div>
            <div className="flex align-center gap-1" style={{ fontWeight: 'bold' }}>
              <Phone size={13} color="rgba(255,255,255,0.85)" />
              <span>+212 5 24 42 38 23</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="main-header"
        style={{
          transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
          ...(scrolled ? {
            background: 'rgba(var(--bg-card-rgb, 255,255,255), 0.88)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          } : {})
        }}
      >
        <div className="container header-inner flex justify-between align-center">

          {/* Left: Mobile Hamburger Button (< 1024px) */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="header-btn mobile-hamburger-btn"
            title="Menu principal"
            aria-label="Menu principal"
            style={{ display: 'none', padding: '6px' }}
          >
            {mobileDrawerOpen ? <X size={24} color="var(--text)" /> : <Menu size={24} color="var(--text)" />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logo} alt="Pharmacie Ben Moussa Abbes" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>Pharmacie</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.3px' }}>Ben Moussa Abbes</span>
            </div>
          </Link>

          {/* Desktop Search Autocomplete */}
          <div className="desktop-search-wrapper" style={{ flex: 1, maxWidth: '560px' }}>
            <SearchAutocomplete />
          </div>

          {/* Header Actions */}
          <div className="header-actions flex align-center gap-2">
            {/* Mobile search toggle button (< 768px) */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="header-btn mobile-search-trigger"
              title="Rechercher"
              aria-label="Rechercher"
              style={{ display: 'none' }}
            >
              <Search size={20} color="var(--text)" />
            </button>

            {/* Admin / User status */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isAdmin ? (
                  <Button variant="primary" size="sm" as={Link} to="/admin" style={{ fontSize: '0.82rem', gap: '6px', padding: '6px 14px' }}>
                    <ShieldCheck size={15} />
                    <span>Admin</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    as={Link}
                    to="/login?redirect=admin"
                    title="Accès Administrateur"
                    style={{ opacity: 0.6, padding: '8px' }}
                  >
                    <Lock size={16} />
                  </Button>
                )}
                <button
                  onClick={logout}
                  className="header-btn"
                  title="Se déconnecter"
                  aria-label="Se déconnecter"
                  style={{ padding: '8px' }}
                >
                  <LogOut size={18} color="var(--danger)" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="header-btn"
                title="Accès Administrateur"
                aria-label="Se connecter"
                style={{ padding: '8px' }}
              >
                <User size={20} color="var(--text-muted)" />
              </Link>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="header-btn" title="Panier" style={{ padding: '8px', position: 'relative' }}>
              <ShoppingCart size={21} color="var(--primary)" />
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </Link>
          </div>
        </div>

        {/* Mobile Search Overlay Bar */}
        {mobileSearchOpen && (
          <div className="mobile-search-overlay">
            <SearchAutocomplete />
          </div>
        )}
      </header>

      {/* ─── Sub-Header with Mega Menu (Desktop & Tablet > 1024px) ─── */}
      <div className="sub-header">
        <div className="container sub-header-container">
          <ul className="sub-nav-links">
            {/* Accueil */}
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/" className={`sub-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Accueil
              </Link>
            </li>

            {/* Mega-menu categories */}
            {MEGA_MENU.map((cat, catIdx) => (
              <li
                key={cat.slug}
                className={`mega-parent ${openMenu === catIdx ? 'mega-open' : ''}`}
                onMouseEnter={() => handleCategoryEnter(catIdx)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={`sub-nav-link mega-trigger ${location.search.includes(`category=${cat.slug}`) ? 'active' : ''}`}
                  onClick={(e) => handleCategoryClick(catIdx, cat.slug, e)}
                >
                  {cat.label}
                  <ChevronDown className="chevron-icon" size={13} />
                </button>
              </li>
            ))}

            {/* Static links */}
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/promotions" className={`sub-nav-link promo-nav ${location.pathname === '/promotions' ? 'active' : ''}`}>
                <Flame size={14} color="var(--danger)" style={{ marginRight: '4px' }} />
                Promos
              </Link>
            </li>
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/marques" className={`sub-nav-link ${location.pathname === '/marques' ? 'active' : ''}`}>
                Marques
              </Link>
            </li>
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/nos-conseils" className={`sub-nav-link ${location.pathname === '/nos-conseils' ? 'active' : ''}`}>
                Conseils
              </Link>
            </li>
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/contact" className={`sub-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>

          {/* ─── Dropdown unique, centré, hors des <li> ─── */}
          {openMenu !== null && MEGA_MENU[openMenu] && (
            <div
              className="mega-dropdown"
              onMouseEnter={clearClose}
              onMouseLeave={scheduleClose}
            >
              <div className="mega-col mega-col-left">
                {MEGA_MENU[openMenu].subcategories.map((sub, subIdx) => (
                  <button
                    key={sub.slug}
                    className={`mega-sub-btn ${activeSub === subIdx ? 'mega-sub-active' : ''}`}
                    onMouseEnter={() => handleSubEnter(subIdx)}
                    onClick={() => navigateAndClose(`/products?category=${MEGA_MENU[openMenu].slug}&sub=${sub.slug}`)}
                  >
                    {sub.label}
                    <ChevronRight size={13} className="mega-arrow" />
                  </button>
                ))}
              </div>

              {activeSub !== null && MEGA_MENU[openMenu].subcategories[activeSub] && (
                <div className="mega-col mega-col-mid">
                  <div className="mega-col-title">{MEGA_MENU[openMenu].subcategories[activeSub].label}</div>
                  {MEGA_MENU[openMenu].subcategories[activeSub].items.map((item) => (
                    <button
                      key={item}
                      className="mega-item-btn"
                      onClick={() => navigateAndClose(`/products?category=${MEGA_MENU[openMenu].slug}&sub=${MEGA_MENU[openMenu].subcategories[activeSub].slug}&q=${slugify(item)}`)}
                    >
                      {item}
                    </button>
                  ))}

                  {MEGA_MENU[openMenu].subcategories[activeSub].children?.map((child, childIdx) => (
                    <button
                      key={child.slug}
                      className={`mega-sub-btn mega-child-trigger ${activeChild === childIdx ? 'mega-sub-active' : ''}`}
                      onMouseEnter={() => handleChildEnter(childIdx)}
                      onClick={() => navigateAndClose(`/products?category=${MEGA_MENU[openMenu].slug}&sub=${child.slug}`)}
                    >
                      {child.label}
                      <ChevronRight size={13} className="mega-arrow" />
                    </button>
                  ))}
                </div>
              )}

              {activeChild !== null &&
                activeSub !== null &&
                MEGA_MENU[openMenu].subcategories[activeSub]?.children?.[activeChild] && (
                  <div className="mega-col mega-col-right">
                    <div className="mega-col-title">
                      {MEGA_MENU[openMenu].subcategories[activeSub].children[activeChild].label}
                    </div>
                    {MEGA_MENU[openMenu].subcategories[activeSub].children[activeChild].items.map((item) => (
                      <button
                        key={item}
                        className="mega-item-btn"
                        onClick={() => navigateAndClose(`/products?category=${MEGA_MENU[openMenu].slug}&sub=${MEGA_MENU[openMenu].subcategories[activeSub].children[activeChild].slug}&q=${slugify(item)}`)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Off-Canvas Drawer (< 1024px) ─── */}
      {mobileDrawerOpen && (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)} />
          <div className="mobile-drawer">
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="logo" style={{ gap: '8px' }}>
                <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>Menu</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                aria-label="Fermer le menu"
              >
                <X size={22} color="var(--text-muted)" />
              </button>
            </div>

            {/* Drawer Body — Accordion Navigation */}
            <div className="mobile-drawer-body">
              {/* Home */}
              <button
                className="mobile-accordion-btn"
                onClick={() => navigateAndClose('/')}
              >
                <span>Accueil</span>
              </button>

              {/* Mega Categories Accordion */}
              {MEGA_MENU.map((cat, catIdx) => {
                const isOpen = mobileAccordion === catIdx;
                return (
                  <div key={cat.slug} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <button
                      className={`mobile-accordion-btn ${isOpen ? 'active' : ''}`}
                      onClick={() => setMobileAccordion(isOpen ? null : catIdx)}
                    >
                      <span>{cat.label}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                        }}
                      />
                    </button>

                    {/* Subcategories */}
                    {isOpen && (
                      <div className="mobile-accordion-content">
                        {/* Direct link to whole category */}
                        <button
                          className="mobile-sub-btn"
                          style={{ fontWeight: 700, color: 'var(--primary)' }}
                          onClick={() => navigateAndClose(`/products?category=${cat.slug}`)}
                        >
                          <span>Tout dans {cat.label}</span>
                          <ChevronRight size={14} />
                        </button>

                        {cat.subcategories.map((sub, subIdx) => {
                          const isSubOpen = mobileSubAccordion === subIdx;
                          return (
                            <div key={sub.slug}>
                              <button
                                className={`mobile-sub-btn ${isSubOpen ? 'active' : ''}`}
                                onClick={() => setMobileSubAccordion(isSubOpen ? null : subIdx)}
                              >
                                <span>{sub.label}</span>
                                <ChevronDown
                                  size={13}
                                  style={{
                                    transform: isSubOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                  }}
                                />
                              </button>

                              {/* Items under subcategory */}
                              {isSubOpen && (
                                <div style={{ background: 'var(--bg-card)', padding: '4px 0' }}>
                                  {sub.items.map((item) => (
                                    <button
                                      key={item}
                                      className="mobile-item-link"
                                      style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                                      onClick={() => navigateAndClose(`/products?category=${cat.slug}&sub=${sub.slug}&q=${slugify(item)}`)}
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Static Quick Links */}
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <button className="mobile-accordion-btn" onClick={() => navigateAndClose('/promotions')}>
                  <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={16} /> Promos Exclusives
                  </span>
                </button>
                <button className="mobile-accordion-btn" onClick={() => navigateAndClose('/marques')}>
                  <span>Nos Marques</span>
                </button>
                <button className="mobile-accordion-btn" onClick={() => navigateAndClose('/nos-conseils')}>
                  <span>Conseils &amp; Articles</span>
                </button>
                <button className="mobile-accordion-btn" onClick={() => navigateAndClose('/contact')}>
                  <span>Contactez-nous</span>
                </button>
              </div>

              {/* Drawer Footer Info */}
              <div style={{
                margin: 'var(--space-md)',
                padding: 'var(--space-sm)',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="var(--primary)" />
                  <span>Marrakech : 9h00 - 21h30</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <Phone size={14} color="var(--primary)" />
                  <a href="tel:+212524423823" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +212 5 24 42 38 23
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header responsive styling helper */}
      <style>{`
        @media (max-width: 1024px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .desktop-search-wrapper {
            display: none !important;
          }
          .mobile-search-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
