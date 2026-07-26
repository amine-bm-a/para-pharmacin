import React from 'react';

export default function About() {
  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
      {/* Breadcrumbs */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)', 
        marginBottom: '24px',
        padding: '12px 16px',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🏠</span>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>À propos de nous</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', alignItems: 'center', marginBottom: '60px', gap: '40px' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}>
            La Pharmacie Ben Moussa Abbes
          </h1>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 600, color: 'var(--text)' }}>
            Votre partenaire santé et bien-être de confiance à Marrakech
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '1rem', lineHeight: 1.7 }}>
            Fondée avec la volonté d'offrir un service de santé de proximité de premier ordre, la Pharmacie Ben Moussa Abbes met un point d'honneur à accompagner ses patients au quotidien.
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '1rem', lineHeight: 1.7 }}>
            Au-delà de la délivrance d'ordonnances, nous sélectionnons rigoureusement le meilleur de la parapharmacie (soins dermatologiques, produits pour bébé, compléments alimentaires) pour vous proposer des produits sains, certifiés et au juste prix.
          </p>
        </div>
        <div style={{ 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          border: '1px solid var(--border-light)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" 
            alt="Intérieur Pharmacie" 
            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Core Values Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--bg-subtle), white)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '50px 40px', 
        marginBottom: '60px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '40px', 
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text)'
        }}>Nos Valeurs Fondamentales</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ 
            background: 'white', 
            padding: '28px 20px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤝</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700, color: 'var(--text)' }}>Proximité & Écoute</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Chaque patient est unique. Nous prenons le temps de vous conseiller et de répondre à vos besoins.
            </p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '28px 20px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700, color: 'var(--text)' }}>Qualité Certifiée</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              100% de nos médicaments et produits parapharmaceutiques proviennent de circuits de distribution officiels.
            </p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '28px 20px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700, color: 'var(--text)' }}>Conseil Expert</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Une équipe de pharmaciens diplômés et préparateurs expérimentés constamment formés aux nouveautés.
            </p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '28px 20px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700, color: 'var(--text)' }}>Disponibilité</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Un large stock de produits en réserve et un système de commande rapide sous 24 heures en cas de rupture.
            </p>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '32px', 
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text)'
        }}>Notre Équipe de Professionnels</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
          }}
          >
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              margin: '0 auto 16px', 
              border: '3px solid var(--primary-light)',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
            }}>
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80" alt="Dr. Benmoussa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Dr. Yasmina Benmoussa</h4>
            <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>Pharmacienne Titulaire</p>
          </div>

          <div style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
          }}
          >
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              margin: '0 auto 16px', 
              border: '3px solid var(--primary-light)',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
            }}>
              <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80" alt="Dr. Alami" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Dr. Karim Alami</h4>
            <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>Pharmacien Assistant</p>
          </div>

          <div style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
          }}
          >
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              margin: '0 auto 16px', 
              border: '3px solid var(--primary-light)',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
            }}>
              <img src="https://images.unsplash.com/photo-1594824813573-246434de83fb?w=200&q=80" alt="Khadija" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Mme. Khadija Ait</h4>
            <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>Préparatrice Conseil</p>
          </div>
        </div>
      </section>
    </div>
  );
}
