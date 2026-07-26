import React from 'react';

const ingredients = [
  { name: 'Vitamine C', icon: '🍊', color: 'hsl(35, 80%, 92%)', hoverColor: 'hsl(35, 80%, 50%)' },
  { name: 'Acide Hyaluronique', icon: '💧', color: 'hsl(210, 70%, 92%)', hoverColor: 'hsl(210, 70%, 50%)' },
  { name: 'Niacinamide', icon: '🧪', color: 'hsl(170, 55%, 90%)', hoverColor: 'hsl(170, 55%, 40%)' },
  { name: 'Rétinol', icon: '✨', color: 'hsl(280, 55%, 92%)', hoverColor: 'hsl(280, 55%, 50%)' },
  { name: 'Acide Salicylique', icon: '🌿', color: 'hsl(145, 50%, 90%)', hoverColor: 'hsl(145, 50%, 40%)' },
  { name: 'Acide Glycolique', icon: '🔬', color: 'hsl(335, 60%, 93%)', hoverColor: 'hsl(335, 60%, 50%)' }
];

const ActiveIngredients = () => {
  return (
    <section className="py-section" style={{ background: 'var(--bg-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 className="section-title">💡 Ingrédients Actifs</h2>
          <p className="section-subtitle">Découvrez les actifs phares de la dermocosmétique pour cibler vos besoins spécifiques</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="ingredient-card-v2" style={{ 
              textAlign: 'center', 
              cursor: 'pointer',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 16px',
              transition: 'all 0.35s ease',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: ing.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'all 0.35s ease'
              }}>
                {ing.icon}
              </div>
              <div style={{ 
                fontWeight: 700, 
                fontSize: '0.88rem', 
                color: 'var(--text)',
                fontFamily: 'var(--font-title)',
                lineHeight: 1.3
              }}>
                {ing.name}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-light)',
                lineHeight: 1.4
              }}>
                Voir les produits →
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .ingredient-card-v2:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-transparent) !important;
        }
        .ingredient-card-v2:hover div:first-child {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
    </section>
  );
};

export default ActiveIngredients;
