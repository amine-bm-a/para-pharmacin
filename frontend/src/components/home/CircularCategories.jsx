import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const circleCats = [
  {
    name: 'Promos',
    icon: '🏷️',
    to: '/promotions',
    lightColor: 'linear-gradient(135deg, var(--primary), hsl(335, 75%, 55%))',
    darkColor: 'linear-gradient(135deg, hsl(143,63%,20%), hsl(335,60%,28%))'
  },
  {
    name: 'Parfums',
    icon: '🌸',
    to: '/products?category=visage-corps&sub=parfums',
    lightColor: 'linear-gradient(135deg, hsl(340, 60%, 92%), hsl(340, 60%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(340,50%,22%), hsl(340,45%,18%))'
  },
  {
    name: 'Maquillage',
    icon: '💄',
    to: '/products?category=visage-corps&sub=maquillage',
    lightColor: 'linear-gradient(135deg, hsl(0, 60%, 92%), hsl(0, 60%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(0,50%,22%), hsl(0,45%,18%))'
  },
  {
    name: 'Visage',
    icon: '✨',
    to: '/products?category=visage-corps&sub=visage',
    lightColor: 'linear-gradient(135deg, hsl(210, 60%, 92%), hsl(210, 60%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(210,50%,22%), hsl(210,45%,18%))'
  },
  {
    name: 'Corps',
    icon: '🧴',
    to: '/products?category=visage-corps&sub=corps',
    lightColor: 'linear-gradient(135deg, hsl(170, 55%, 90%), hsl(170, 55%, 82%))',
    darkColor: 'linear-gradient(135deg, hsl(170,45%,20%), hsl(170,40%,16%))'
  },
  {
    name: 'Solaires',
    icon: '☀️',
    to: '/products?category=solaires',
    lightColor: 'linear-gradient(135deg, hsl(38, 80%, 90%), hsl(38, 80%, 82%))',
    darkColor: 'linear-gradient(135deg, hsl(38,60%,22%), hsl(38,55%,18%))'
  },
  {
    name: 'Cheveux',
    icon: '💇',
    to: '/products?category=cheveux',
    lightColor: 'linear-gradient(135deg, hsl(280, 55%, 92%), hsl(280, 55%, 85%))',
    darkColor: 'linear-gradient(135deg, hsl(280,45%,22%), hsl(280,40%,18%))'
  },
  {
    name: 'Bébé',
    icon: '👶',
    to: '/espace-bebe',
    lightColor: 'linear-gradient(135deg, hsl(190, 60%, 90%), hsl(190, 60%, 82%))',
    darkColor: 'linear-gradient(135deg, hsl(190,50%,20%), hsl(190,45%,16%))'
  },
  {
    name: 'Hygiène',
    icon: '🫧',
    to: '/products?category=hygiene-sante',
    lightColor: 'linear-gradient(135deg, hsl(145, 50%, 90%), hsl(145, 50%, 82%))',
    darkColor: 'linear-gradient(135deg, hsl(145,40%,18%), hsl(145,35%,14%))'
  },
  {
    name: 'Compléments',
    icon: '💊',
    to: '/products?category=complements-alimentaires',
    lightColor: 'linear-gradient(135deg, hsl(25, 70%, 90%), hsl(25, 70%, 82%))',
    darkColor: 'linear-gradient(135deg, hsl(25,55%,22%), hsl(25,50%,18%))'
  }
];

const CircularCategories = () => {
  const { isDark } = useTheme();

  return (
    <section style={{ padding: '50px 0 30px' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '0 20px'
        }}>
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
                padding: '8px',
                transition: 'transform 0.3s ease',
                textDecoration: 'none',
                width: '100px'
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
                  fontSize: '1.8rem',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  border: '3px solid var(--border-light)'
                }}
              >
                {cat.icon}
              </div>
              <span style={{
                fontWeight: 600,
                fontSize: '0.82rem',
                color: 'var(--text)',
                lineHeight: 1.2,
                fontFamily: 'var(--font-title)'
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
          box-shadow: 0 12px 28px rgba(0,0,0,0.22) !important;
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default CircularCategories;
