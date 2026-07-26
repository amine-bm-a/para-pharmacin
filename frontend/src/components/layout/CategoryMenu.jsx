import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

/* ─── Full category data (paranewera-style) ─── */
const categories = [
  {
    name: 'VISAGE & CORPS',
    slug: 'visage-corps',
    subcategories: [
      {
        label: 'Visage', slug: 'visage',
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
        label: 'Corps', slug: 'corps',
        items: [
          'Hydratation & Nutrition', 'Gommages & Exfoliants',
          'Épilation / décoloration', 'Jambes lourdes et circulation',
          'Fermeté & sublimateur', 'Soins raffermissants',
          'Détente & massages', 'Soin Anti-Taches Corps',
        ],
      },
      {
        label: 'Yeux & Lèvres', slug: 'yeux-levres',
        items: [
          'Contours des yeux', 'Démaquillant yeux',
          'Anti-cernes & poches', 'Soins lèvres',
          'Soins cils & sourcils',
        ],
      },
      {
        label: 'Mains & Pieds', slug: 'mains-pieds',
        items: ['Soins des mains', 'Soins des pieds'],
        children: [
          { label: 'Les Ongles', slug: 'les-ongles', items: ['Vernis', 'Soins des ongles', 'Dissolvants', 'Kits Vernis'] },
        ],
      },
      {
        label: 'Maquillage', slug: 'maquillage',
        items: ['Teint', 'Yeux', 'Lèvres', 'Ongles', 'Accessoires'],
      },
      {
        label: 'Parfums', slug: 'parfums',
        items: ['Parfums Femme', 'Parfums Homme', 'Coffrets Parfums'],
      },
    ],
  },
  {
    name: 'CHEVEUX',
    slug: 'cheveux',
    subcategories: [
      { label: 'Shampoings', slug: 'shampoings', items: ['Anti-chute', 'Anti-pelliculaire', 'Cheveux secs', 'Cheveux gras', 'Cheveux colorés', 'Usage fréquent'] },
      { label: 'Soins & Masques', slug: 'soins-masques', items: ['Après-shampoings', 'Masques capillaires', 'Huiles capillaires', 'Sérums capillaires', 'Leave-in'] },
      { label: 'Coiffants', slug: 'coiffants', items: ['Gels & Cires', 'Mousses', 'Sprays fixants', 'Lissants'] },
      { label: 'Colorations', slug: 'colorations', items: ['Colorations permanentes', 'Colorations temporaires', 'Retouche racines'] },
      { label: 'Compléments Cheveux', slug: 'complements-cheveux', items: ['Anti-chute compléments', 'Kératine', 'Biotine'] },
    ],
  },
  {
    name: 'SOLAIRES',
    slug: 'solaires',
    subcategories: [
      { label: 'Protection Solaire', slug: 'protection-solaire', items: ['Crèmes solaires visage', 'Crèmes solaires corps', 'Sprays solaires', 'Protection enfants', 'Indice SPF 50+', 'Indice SPF 30'] },
      { label: 'Après-Soleil', slug: 'apres-soleil', items: ['Lait après-soleil', 'Gel apaisant', 'Réparateur'] },
      { label: 'Autobronzants', slug: 'autobronzants', items: ['Autobronzants visage', 'Autobronzants corps'] },
      { label: 'Solaires Bébé & Kids', slug: 'solaires-bebe', items: ['Crèmes solaires bébé', 'Sprays enfants'] },
    ],
  },
  {
    name: 'HYGIÈNE & SANTÉ',
    slug: 'hygiene-sante',
    subcategories: [
      { label: 'Hygiène Bucco-Dentaire', slug: 'bucco-dentaire', items: ['Dentifrices', 'Brosses à dents', 'Bains de bouche', 'Fils dentaires'] },
      { label: 'Hygiène Corporelle', slug: 'hygiene-corporelle', items: ['Gels douche', 'Savons', 'Déodorants', 'Hygiène intime'] },
      { label: 'Santé & Bien-être', slug: 'sante-bien-etre', items: ['Douleurs & Fièvre', 'Digestion', 'Sommeil & Stress', 'Circulation', 'Yeux fatigués'] },
      { label: 'Bébé & Maman', slug: 'bebe-maman', items: ['Soins bébé', 'Change & toilette', 'Grossesse & Allaitement', 'Soins maman'] },
    ],
  },
  {
    name: 'COMPLÉMENTS ALIMENTAIRES',
    slug: 'complements-alimentaires',
    subcategories: [
      { label: 'Vitalité & Énergie', slug: 'vitalite-energie', items: ['Multivitamines', 'Fer', 'Magnésium', 'Vitamine C', 'Vitamine D', 'Oméga 3'] },
      { label: 'Minceur & Digestion', slug: 'minceur-digestion', items: ['Brûleurs de graisses', 'Draineurs', 'Probiotiques', 'Transit'] },
      { label: 'Beauté', slug: 'beaute-complements', items: ['Peau', 'Cheveux & Ongles', 'Anti-âge', 'Collagène'] },
      { label: 'Immunité & Défenses', slug: 'immunite', items: ['Vitamine C', 'Zinc', 'Propolis', 'Échinacée'] },
    ],
  },
  {
    name: 'NATURE & BIO',
    slug: 'nature-bio',
    subcategories: [
      { label: 'Soins Bio Visage', slug: 'bio-visage', items: ['Crèmes bio', 'Sérums bio', 'Nettoyants bio', 'Huiles végétales'] },
      { label: 'Soins Bio Corps', slug: 'bio-corps', items: ['Laits bio', 'Beurres corporels', 'Huiles de massage'] },
      { label: 'Huiles Essentielles', slug: 'huiles-essentielles', items: ['Lavande', 'Tea tree', 'Eucalyptus', 'Menthe poivrée', 'Ravintsara'] },
      { label: 'Aromathérapie', slug: 'aromatherapie', items: ['Diffuseurs', 'Synergies', 'Roll-on'] },
    ],
  },
  {
    name: 'HOMME',
    slug: 'homme',
    subcategories: [
      { label: 'Soins Visage Homme', slug: 'soins-visage-homme', items: ['Hydratants', 'Anti-fatigue', 'Anti-âge homme', 'Nettoyants'] },
      { label: 'Rasage & Barbe', slug: 'rasage-barbe', items: ['Mousses & Gels de rasage', 'Après-rasage', 'Huiles à barbe', 'Accessoires'] },
      { label: 'Parfums Homme', slug: 'parfums-homme', items: ['Eau de toilette', 'Eau de parfum', 'Coffrets'] },
    ],
  },
  {
    name: 'PROMOS 🔥',
    slug: 'promotions',
    link: '/promotions',
    subcategories: [],
  },
  {
    name: 'MARQUES',
    slug: 'marques',
    link: '/marques',
    subcategories: [],
  },
];

const slugify = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CategoryMenu = () => {
  const navigate = useNavigate();

  /* State */
  const [openCat, setOpenCat] = useState(null);   // which top-level is open
  const [activeSub, setActiveSub] = useState(null); // which subcategory is hovered
  const [activeChild, setActiveChild] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, isReverse: false });
  const closeTimer = useRef(null);
  const itemRefs = useRef({});

  const clearClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => {
      setOpenCat(null);
      setActiveSub(null);
      setActiveChild(null);
    }, 200);
  }, []);

  const handleCatEnter = (idx) => {
    clearClose();
    if (categories[idx].subcategories.length === 0) {
      setOpenCat(null);
      setActiveSub(null);
      setActiveChild(null);
      return;
    }
    setOpenCat(idx);
    setActiveSub(null); // Do not show the second column by default
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

  const go = (path) => {
    navigate(path);
    setOpenCat(null);
    setActiveSub(null);
    setActiveChild(null);
  };

  // Update dropdown position when active
  useEffect(() => {
    if (openCat !== null && itemRefs.current[openCat]) {
      const rect = itemRefs.current[openCat].getBoundingClientRect();
      const currentCat = categories[openCat];
      
      // Calculate max potential menu width for this category
      let maxMenuWidth = 220; // Col 1
      if (currentCat.subcategories && currentCat.subcategories.length > 0) {
        maxMenuWidth += 240; // Col 2
        const hasChildren = currentCat.subcategories.some(subItem => subItem.children && subItem.children.length > 0);
        if (hasChildren) {
          maxMenuWidth += 220; // Col 3
        }
      }

      // Calculate active menu width based on rendered columns: Col 1 is 220px, Col 2 is 240px, Col 3 is 220px
      let menuWidth = 220; 
      if (activeSub !== null) menuWidth += 240;
      const currentSub = currentCat && activeSub !== null ? currentCat.subcategories[activeSub] : null;
      if (activeChild !== null && currentSub?.children?.[activeChild]) menuWidth += 220;

      const viewportWidth = window.innerWidth;
      let leftPosition = rect.left + window.scrollX;
      const isReverse = (rect.left + maxMenuWidth > viewportWidth);
      
      // Align right edge of dropdown with right edge of category item if it would overflow the right of the screen
      if (isReverse) {
        leftPosition = (rect.right + window.scrollX) - menuWidth;
      }
      
      // Prevent off-screen left alignment
      leftPosition = Math.max(16, leftPosition);

      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: leftPosition,
        isReverse: isReverse
      });
    }
  }, [openCat, activeSub, activeChild]);

  const cat = openCat !== null ? categories[openCat] : null;
  const sub = cat && activeSub !== null ? cat.subcategories[activeSub] : null;
  const child = sub?.children && activeChild !== null ? sub.children[activeChild] : null;

  return (
    <div className="catmenu-wrapper">
      <div className="container">
        <ul className="catmenu-list">
          {categories.map((c, idx) => (
            <li
              key={c.slug}
              ref={(el) => (itemRefs.current[idx] = el)}
              className={`catmenu-item ${openCat === idx ? 'catmenu-item--active' : ''}`}
              onMouseEnter={() => handleCatEnter(idx)}
              onMouseLeave={scheduleClose}
            >
              <button
                className="catmenu-btn"
                onClick={() => go(c.link || `/products?category=${c.slug}`)}
              >
                {c.name}
                {c.subcategories.length > 0 && (
                  <svg className="catmenu-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Dropdown portal ── */}
      {openCat !== null && cat && cat.subcategories.length > 0 && createPortal(
        <div
          className={`catmenu-dropdown ${dropdownPosition.isReverse ? 'catmenu-dropdown--reverse' : ''}`}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          {/* Col 1 — subcategory names */}
          <div className="catmenu-col catmenu-col--left">
            {cat.subcategories.map((s, sIdx) => (
              <button
                key={s.slug}
                className={`catmenu-sub ${activeSub === sIdx ? 'catmenu-sub--active' : ''}`}
                onMouseEnter={() => handleSubEnter(sIdx)}
                onClick={() => go(`/products?category=${cat.slug}&sub=${s.slug}`)}
              >
                <span>{s.label}</span>
                <svg className="catmenu-arrow" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>

          {/* Col 2 — items of active subcategory */}
          {sub && (
            <div className="catmenu-col catmenu-col--mid">
              <button
                onClick={() => go(`/products?category=${cat.slug}&sub=${sub.slug}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  width: '100%',
                  padding: '8px 24px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Voir tout {sub.label}</span>
                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>→</span>
              </button>
              {sub.items.map((item) => (
                <button
                  key={item}
                  className="catmenu-item-btn"
                  onClick={() => go(`/products?category=${cat.slug}&sub=${sub.slug}&q=${slugify(item)}`)}
                >
                  {item}
                </button>
              ))}
              {/* Nested children triggers (e.g. Les Ongles) */}
              {sub.children?.map((ch, chIdx) => (
                <button
                  key={ch.slug}
                  className={`catmenu-sub catmenu-child-trigger ${activeChild === chIdx ? 'catmenu-sub--active' : ''}`}
                  onMouseEnter={() => handleChildEnter(chIdx)}
                  onClick={() => go(`/products?category=${cat.slug}&sub=${ch.slug}`)}
                >
                  <span>{ch.label}</span>
                  <svg className="catmenu-arrow" width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Col 3 — child items */}
          {child && (
            <div className="catmenu-col catmenu-col--right">
              <button
                onClick={() => go(`/products?category=${cat.slug}&sub=${child.slug}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  width: '100%',
                  padding: '8px 24px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Voir tout {child.label}</span>
                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>→</span>
              </button>
              {child.items.map((item) => (
                <button
                  key={item}
                  className="catmenu-item-btn"
                  onClick={() => go(`/products?category=${cat.slug}&sub=${child.slug}&q=${slugify(item)}`)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default CategoryMenu;
