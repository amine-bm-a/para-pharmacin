import React from 'react';

const DeliveryStep = React.memo(function DeliveryStep({
  name, setName, email, setEmail, phone, setPhone,
  address, setAddress, city, setCity, zip, setZip,
  savedAddresses, needsPrescription, prescriptionFile, setPrescriptionFile,
  handleNextStep
}) {
  return (
    <div className="fade-in">
      <h3 style={{ 
        fontSize: '1.3rem',
        fontWeight: 800,
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid var(--border-light)',
        color: 'var(--text)'
      }}>📍 Étape 1 : Informations de livraison</h3>

      <div className="checkout-grid">
        {savedAddresses.length > 0 && (
          <div className="form-group full" style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 650, color: 'var(--primary)', fontSize: '0.88rem' }}>📍 Utiliser une adresse enregistrée</label>
            <select 
              className="form-control"
              style={{ background: 'var(--primary-light)', borderColor: 'var(--primary-transparent)', padding: '10px 14px', height: 'auto', color: 'var(--primary)', fontWeight: 600 }}
              onChange={(e) => {
                const selected = savedAddresses.find(a => a.id === parseInt(e.target.value));
                if (selected) {
                  setAddress(selected.address);
                  setCity(selected.city);
                  setZip(selected.postalCode);
                  setPhone(selected.phone);
                }
              }}
              defaultValue={savedAddresses.find(a => a.isDefault)?.id || ""}
            >
              <option value="" disabled>Choisir parmi vos adresses...</option>
              {savedAddresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.label}: {addr.address}, {addr.city} {addr.isDefault ? '— [Par défaut]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group full" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Nom complet</label>
          <div className="form-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Email</label>
          <div className="form-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Téléphone</label>
          <div className="form-wrapper">
            <span className="input-icon">📱</span>
            <input
              type="tel"
              className="form-control"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group full" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Adresse complète</label>
          <div className="form-wrapper">
            <span className="input-icon">📍</span>
            <input
              type="text"
              className="form-control"
              placeholder="N° de rue, nom de rue, quartier..."
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Ville</label>
          <div className="form-wrapper">
            <span className="input-icon">🏙️</span>
            <input
              type="text"
              className="form-control"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Code Postal</label>
          <div className="form-wrapper">
            <span className="input-icon">📮</span>
            <input
              type="text"
              className="form-control"
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>
      </div>

      {needsPrescription && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))', 
          border: '2px solid #ffc107', 
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📄 Ordonnance médicale requise
          </h4>
          <p style={{ fontSize: '0.88rem', marginBottom: '12px', lineHeight: 1.5 }}>
            Un produit nécessite une ordonnance. Merci de joindre une photo nette ou un scan de votre ordonnance.
          </p>
          <div className="form-wrapper">
            <span className="input-icon">📎</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="form-control"
              onChange={(e) => setPrescriptionFile(e.target.files[0] || null)}
              required={needsPrescription}
            />
          </div>
          {prescriptionFile && (
            <div style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--primary)', fontWeight: 600 }}>
              ✓ Fichier sélectionné : {prescriptionFile.name}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleNextStep}
          style={{
            padding: '14px 28px', background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
        >
          Continuer vers le Paiement ➔
        </button>
      </div>
    </div>
  );
});

export default DeliveryStep;
