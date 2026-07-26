import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Truck, ArrowRight, Home } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function OrderConfirmation() {
  const { t } = useLang();
  const location = useLocation();
  const order = location.state?.order || { id: 'N/A', total: 0 };

  return (
    <div style={{ padding: '80px 20px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' }}>
      <div style={{
        maxWidth: '550px',
        width: '100%',
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '50px 40px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        animation: 'fadeInUp 0.5s ease',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle size={44} color="white" />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>
          {t('thankYou')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '32px' }}>
          {t('orderConfirmed')}
        </p>

        <div style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          textAlign: 'left',
          marginBottom: '32px',
          border: '1px solid var(--border-light)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Numéro de commande :</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>#{order.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Montant total :</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{order.total} DH</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to={`/suivi-commande/${order.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            }}
          >
            <Truck size={18} />
            <span>{t('tracking')}</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'transparent',
              color: 'var(--text)',
              border: '2px solid var(--border-light)',
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-subtle)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            <Home size={18} />
            <span>{t('backHome')}</span>
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
