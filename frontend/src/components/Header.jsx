import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  /* Mega-menu state */
  const [openMenu, setOpenMenu] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const closeTimer = useRef(null);

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
        zIndex: 9999,
        transition: 'width 0.1s linear',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px rgba(10,168,79,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container flex justify-between align-center">
          <div className="flex align-center gap-2">
            <span>🚚 Livraison gratuite à Marrakech et partout au Maroc dès 700 DH</span>
          </div>
          <div className="flex align-center gap-3">
            <span>⏰ Magasin Marrakech : 9h00 - 21h30</span>
            <span style={{ fontWeight: 'bold' }}>📞 +212 5 24 42 38 23</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={{
        transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
        ...(scrolled ? {
          background: 'rgba(var(--bg-card-rgb, 255,255,255), 0.82)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
        } : {})
      }}>
        <div className="container header-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Pharmacie Ben Moussa Abbes" style={{ width: '42px', height: '42px', objectFit: 'contain', transition: 'transform 0.3s' }} className="logo-svg" />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>Pharmacie</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.3px' }}>Ben Moussa Abbes</span>
            </div>
          </Link>

          <SearchAutocomplete />

          <div className="header-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {isAdmin ? (
                  <Button variant="primary" size="sm" as={Link} to="/admin" style={{ fontSize: '0.85rem' }}>Dashboard Admin</Button>
                ) : (
                  <Button variant="outline" size="sm" as={Link} to="/login?redirect=admin" title="Accès Administrateur" style={{ opacity: 0.45, fontSize: '1.1rem', filter: 'grayscale(0.3)' }}>🔒</Button>
                )}
                <Button variant="outline" size="sm" onClick={logout} className="action-btn" title="Se déconnecter">🚪</Button>
              </div>
            ) : (
              <Link
                to="/login"
                className="action-btn"
                title="Accès Administrateur"
                style={{ opacity: 0.45, fontSize: '1.1rem', filter: 'grayscale(0.3)' }}
              >
                🔐
              </Link>
            )}

            <Link to="/cart" className="action-btn" title="Panier">
              🛒
              {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Sub-Header with Mega Menu ─── */}
      <div className="sub-header">
        <div className="container sub-header-container">
          <ul className="sub-nav-links">
            {/* Accueil */}
            <li
              onMouseEnter={() => { clearClose(); setOpenMenu(null); }}
            >
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
                  onClick={() => navigateAndClose(`/products?category=${cat.slug}`)}
                >
                  {cat.label}
                  <svg className="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown panel */}
                {openMenu === catIdx && (
                  <div className="mega-dropdown" onMouseEnter={clearClose} onMouseLeave={scheduleClose}>
                    {/* Left column — subcategory names */}
                    <div className="mega-col mega-col-left">
                      {cat.subcategories.map((sub, subIdx) => (
                        <button
                          key={sub.slug}
                          className={`mega-sub-btn ${activeSub === subIdx ? 'mega-sub-active' : ''}`}
                          onMouseEnter={() => handleSubEnter(subIdx)}
                          onClick={() => navigateAndClose(`/products?category=${cat.slug}&sub=${sub.slug}`)}
                        >
                          {sub.label}
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="mega-arrow">
                            <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Middle column — items of active subcategory */}
                    {activeSub !== null && cat.subcategories[activeSub] && (
                      <div className="mega-col mega-col-mid">
                        <div className="mega-col-title">{cat.subcategories[activeSub].label}</div>
                        {cat.subcategories[activeSub].items.map((item) => (
                          <button
                            key={item}
                            className="mega-item-btn"
                            onClick={() => navigateAndClose(`/products?category=${cat.slug}&sub=${cat.subcategories[activeSub].slug}&q=${slugify(item)}`)}
                          >
                            {item}
                          </button>
                        ))}

                        {/* Sub-children (e.g. Les Ongles) */}
                        {cat.subcategories[activeSub].children?.map((child, childIdx) => (
                          <button
                            key={child.slug}
                            className={`mega-sub-btn mega-child-trigger ${activeChild === childIdx ? 'mega-sub-active' : ''}`}
                            onMouseEnter={() => handleChildEnter(childIdx)}
                            onClick={() => navigateAndClose(`/products?category=${cat.slug}&sub=${child.slug}`)}
                          >
                            {child.label}
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="mega-arrow">
                              <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Right column — sub-children items */}
                    {activeChild !== null &&
                      activeSub !== null &&
                      cat.subcategories[activeSub]?.children?.[activeChild] && (
                        <div className="mega-col mega-col-right">
                          <div className="mega-col-title">{cat.subcategories[activeSub].children[activeChild].label}</div>
                          {cat.subcategories[activeSub].children[activeChild].items.map((item) => (
                            <button
                              key={item}
                              className="mega-item-btn"
                              onClick={() => navigateAndClose(`/products?category=${cat.slug}&sub=${cat.subcategories[activeSub].children[activeChild].slug}&q=${slugify(item)}`)}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </li>
            ))}

            {/* Static links */}
            <li onMouseEnter={() => { clearClose(); setOpenMenu(null); }}>
              <Link to="/promotions" className={`sub-nav-link promo-nav ${location.pathname === '/promotions' ? 'active' : ''}`}>
                Promos 🔥
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
        </div>
      </div>
    </>
  );
}
