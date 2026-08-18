import React from 'react';

const ReviewStep = React.memo(function ReviewStep({ name, phone, address, city, zip, paymentMethod, setCurrentStep, handlePrevStep }) {
  return (
    <div className="fade-in">
      <h3 style={{ 
        fontSize: '1.3rem',
        fontWeight: 800,
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid var(--border-light)',
        color: 'var(--text)'
      }}>📋 Étape 3 : Confirmation & Récapitulatif</h3>

      <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>📍 Informations de livraison</h4>
          <button type="button" onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Modifier</button>
        </div>
        <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Nom :</strong> {name}</p>
        <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Téléphone :</strong> {phone}</p>
        <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Adresse :</strong> {address}, {city} {zip}</p>
      </div>

      <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>💳 Mode de paiement choisi</h4>
          <button type="button" onClick={() => setCurrentStep(2)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Modifier</button>
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
          {paymentMethod === 'delivery' ? '💵 Cash à la livraison' : paymentMethod === 'card' ? '💳 Carte Bancaire' : '🏪 Retrait en pharmacie'}
        </p>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={{
            padding: '12px 24px', background: 'var(--bg-subtle)',
            color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
          }}
        >
          ← Retour au paiement
        </button>
      </div>
    </div>
  );
});

export default ReviewStep;
