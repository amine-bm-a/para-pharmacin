import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container fade-in" style={{
      padding: '80px 20px',
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {/* Visual Pill & Code */}
      <div style={{
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        padding: '10px 24px',
        borderRadius: 'var(--radius-full)',
        fontWeight: 800,
        fontSize: '1.1rem',
        letterSpacing: '2px',
        marginBottom: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🔍 ERROR 404</span>
      </div>

      <h1 style={{
        fontSize: '3rem',
        fontWeight: 900,
        color: 'var(--text)',
        marginBottom: '16px',
        lineHeight: 1.2
      }}>
        Page Introuvable
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        maxWidth: '520px',
        fontSize: '1.05rem',
        lineHeight: 1.6,
        marginBottom: '36px'
      }}>
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'adresse ou retournez à la page d'accueil.
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          <Home size={18} />
          Retour à l'accueil
        </Link>

        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
        >
          <Search size={18} />
          Explorer nos produits
        </Link>
      </div>
    </div>
  );
}
