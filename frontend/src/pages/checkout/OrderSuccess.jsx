import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = React.memo(function OrderSuccess({ orderSuccess, name, address, city, zip, phone, paymentMethod }) {
  return (
    <div className="container fade-in" style={{ 
      padding: '80px 20px', 
      maxWidth: '700px',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '6rem', 
        marginBottom: '24px',
        animation: 'bounce 2s ease-in-out infinite'
      }}>🎉</div>
      <h1 style={{ 
        fontSize: '2.2rem', 
        fontWeight: 800, 
        marginBottom: '16px',
        color: 'var(--primary)'
      }}>Commande validée !</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
        Merci pour votre achat. Votre commande <strong style={{ color: 'var(--primary)' }}>{orderSuccess.order_number}</strong> a bien été enregistrée.
      </p>
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '32px', 
        textAlign: 'left', 
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          paddingBottom: '16px',
          borderBottom: '2px solid var(--border-light)',
          fontSize: '1.3rem',
          fontWeight: 800,
          color: 'var(--text)'
        }}>Récapitulatif de livraison</h3>
        <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}><strong>👤 Destinataire :</strong> {name}</p>
        <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}><strong>📍 Adresse :</strong> {address}, {city}, {zip}</p>
        <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}><strong>📞 Téléphone :</strong> {phone}</p>
        <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}><strong>💳 Méthode de paiement :</strong> {paymentMethod === 'delivery' ? 'Paiement à la livraison' : paymentMethod === 'card' ? 'Carte bancaire (Simulé)' : 'Retrait en pharmacie'}</p>
        <p style={{ 
          fontSize: '1.3rem', 
          fontWeight: 800, 
          color: 'var(--primary)', 
          marginTop: '20px',
          padding: '16px',
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-md)'
        }}><strong>💰 Montant total :</strong> {parseFloat(orderSuccess.total_amount).toFixed(2)} MAD</p>
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          to="/products" 
          style={{
            padding: '14px 28px',
            background: 'var(--bg-subtle)',
            color: 'var(--text)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            transition: 'all 0.2s',
            border: '2px solid var(--border)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary-light)';
            e.target.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-subtle)';
            e.target.style.borderColor = 'var(--border)';
          }}
        >
          ← Retourner au catalogue
        </Link>
        <Link 
          to="/mes-commandes" 
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          📦 Suivre ma commande
        </Link>
      </div>
    </div>
  );
});

export default OrderSuccess;
