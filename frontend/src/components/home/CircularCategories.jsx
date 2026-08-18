import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Tag,       // Promos
  Flower2,   // Parfums
  Palette,   // Maquillage
  Sparkles,  // Visage
  Droplet,   // Corps
  Sun,       // Solaires
  Scissors,  // Cheveux
  Baby,      // Bébé
  Waves,     // Hygiène
  Pill,      // Compléments
} from 'lucide-react';

const circleCats = [
  {
    name: 'Promos',
    Icon: Tag,
    to: '/promotions',
    lightColor: 'linear-gradient(135deg, var(--primary-light), hsl(143,55%,85%))',
    darkColor: 'linear-gradient(135deg, hsl(143,63%,14%), hsl(143,55%,20%))',
    iconColor: 'var(--primary)',
  },
  {
    name: 'Parfums',
    Icon: Flower2,
    to: '/products?category=visage-corps&sub=parfums',
    lightColor: 'linear-gradient(135deg, hsl(340, 60%, 94%), hsl(340, 60%, 88%))',
    darkColor: 'linear-gradient(135deg, hsl(340,50%,18%), hsl(340,45%,14%))',
    iconColor: 'hsl(340,60%,55%)',
  },
  {
    name: 'Maquillage',
    Icon: Palette,
    to: '/products?category=visage-corps&sub=maquillage',
    lightColor: 'linear-gradient(135deg, hsl(0, 60%, 94%), hsl(0, 60%, 88%))',
    darkColor: 'linear-gradient(135deg, hsl(0,50%,18%), hsl(0,45%,14%))',
    iconColor: 'hsl(0,60%,55%)',
  },
  {
    name: 'Visage',
    Icon: Sparkles,
    to: '/products?category=visage-corps&sub=visage',
    lightColor: 'linear-gradient(135deg, hsl(210, 60%, 94%), hsl(210, 60%, 88%))',
    darkColor: 'linear-gradient(135deg, hsl(210,50%,18%), hsl(210,45%,14%))',
    iconColor: 'hsl(210,70%,55%)',
  },
  {
    name: 'Corps',
    Icon: Droplet,
    to: '/products?category=visage-corps&sub=corps',
    lightColor: 'linear-gradient(135deg, hsl(170, 55%, 92%), hsl(170, 55%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(170,45%,16%), hsl(170,40%,12%))',
    iconColor: 'hsl(170,55%,40%)',
  },
  {
    name: 'Solaires',
    Icon: Sun,
    to: '/products?category=solaires',
    lightColor: 'linear-gradient(135deg, hsl(38, 80%, 92%), hsl(38, 80%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(38,60%,18%), hsl(38,55%,14%))',
    iconColor: 'hsl(38,80%,50%)',
  },
  {
    name: 'Cheveux',
    Icon: Scissors,
    to: '/products?category=cheveux',
    lightColor: 'linear-gradient(135deg, hsl(280, 55%, 94%), hsl(280, 55%, 88%))',
    darkColor: 'linear-gradient(135deg, hsl(280,45%,18%), hsl(280,40%,14%))',
    iconColor: 'hsl(280,55%,55%)',
  },
  {
    name: 'Bébé',
    Icon: Baby,
    to: '/espace-bebe',
    lightColor: 'linear-gradient(135deg, hsl(190, 60%, 92%), hsl(190, 60%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(190,50%,16%), hsl(190,45%,12%))',
    iconColor: 'hsl(190,60%,45%)',
  },
  {
    name: 'Hygiène',
    Icon: Waves,
    to: '/products?category=hygiene-sante',
    lightColor: 'linear-gradient(135deg, hsl(145, 50%, 92%), hsl(145, 50%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(145,40%,15%), hsl(145,35%,11%))',
    iconColor: 'hsl(145,50%,40%)',
  },
  {
    name: 'Compléments',
    Icon: Pill,
    to: '/products?category=complements-alimentaires',
    lightColor: 'linear-gradient(135deg, hsl(25, 70%, 92%), hsl(25, 70%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(25,55%,18%), hsl(25,50%,14%))',
    iconColor: 'hsl(25,70%,50%)',
  },
];

const CircularCategories = () => {
  const { isDark } = useTheme();
  const scrollRef = useRef(null);

  return (
    <section className="reveal" style={{ padding: 'var(--space-xl) 0 var(--space-lg)' }}>
      <div className="container">
        {/* Scroll container — horizontal on mobile, wrap on desktop */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            flexWrap: 'wrap',
            padding: '0 var(--space-xs)',
          }}
          className="categories-scroll-container"
        >
          {circleCats.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.to}
              className="cat-circle-item"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: 'var(--space-xs)',
                transition: 'var(--transition)',
                textDecoration: 'none',
                width: '90px',
                flexShrink: 0,
              }}
            >
              <div
                className="cat-circle-icon"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: isDark ? cat.darkColor : cat.lightColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)',
                  border: '2px solid transparent',
                }}
              >
                <cat.Icon
                  size={26}
                  color={cat.iconColor}
                  strokeWidth={1.8}
                />
              </div>
              <span style={{
                fontWeight: 'var(--fw-semibold)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--text)',
                lineHeight: 'var(--lh-tight)',
                fontFamily: 'var(--font-title)',
              }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-circle-item:hover {
          transform: translateY(-6px);
        }
        .cat-circle-item:hover .cat-circle-icon {
          box-shadow: var(--shadow-md) !important;
          transform: scale(1.1);
          border-color: var(--border) !important;
        }

        /* Mobile: horizontal scroll instead of multi-line wrap */
        @media (max-width: 640px) {
          .categories-scroll-container {
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            overflow-x: auto !important;
            padding-bottom: var(--space-xs) !important;
            /* Hide scrollbar but keep functionality */
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .categories-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .cat-circle-item {
            width: 80px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CircularCategories;
