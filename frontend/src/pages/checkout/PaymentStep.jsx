import React from 'react';

const formatCardNumber = (value) => {
  const v = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }
  return parts.join(' ');
};

const formatExpiry = (value) => {
  const v = value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
  return v;
};

const getCardType = (number) => {
  const n = number.replace(/\D/g, '');
  if (n.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  return null;
};

const getCardGradient = (type) => {
  if (type === 'visa') return 'linear-gradient(135deg, #1a1f71, #2563eb, #1e40af)';
  if (type === 'mastercard') return 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)';
  return 'linear-gradient(135deg, #1e293b, #334155, #475569)';
};

const PaymentStep = React.memo(function PaymentStep({
  paymentMethod, setPaymentMethod,
  cardNumber, setCardNumber, cardName, setCardName,
  cardExpiry, setCardExpiry, cardCvv, setCardCvv,
  isCardFlipped, setIsCardFlipped,
  savedCards, setSavedCards, selectedCard, setSelectedCard,
  showAddCard, setShowAddCard, saveCardChecked, setSaveCardChecked,
  cardBalance, setCardBalance, simulateInsufficientBalance, setSimulateInsufficientBalance,
  user, total, handlePrevStep, handleNextStep
}) {
  const handleDeleteCard = (cardId) => {
    const updated = savedCards.filter(c => c.id !== cardId);
    setSavedCards(updated);
    if (user) {
      localStorage.setItem(`saved_cards_${user.id}`, JSON.stringify(updated));
    }
    if (selectedCard === cardId) {
      setSelectedCard(updated.length > 0 ? updated[0].id : null);
    }
    if (updated.length === 0) setShowAddCard(true);
  };

  return (
    <>
      <h3 style={{ 
        fontSize: '1.3rem',
        fontWeight: 800,
        marginTop: '32px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid var(--border-light)',
        color: 'var(--text)'
      }}>Mode de livraison & Paiement</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          background: paymentMethod === 'delivery' ? 'var(--primary-light)' : 'var(--bg-subtle)',
          border: `2px solid ${paymentMethod === 'delivery' ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (paymentMethod !== 'delivery') {
            e.currentTarget.style.borderColor = 'var(--primary-light)';
          }
        }}
        onMouseLeave={(e) => {
          if (paymentMethod !== 'delivery') {
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
        >
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === 'delivery'}
            onChange={() => setPaymentMethod('delivery')}
            style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--primary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>💵 Paiement à la livraison (Cash à la livraison)</span>
              <span style={{ 
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: '#E8F5E9',
                color: '#2E7D32',
                fontWeight: 700
              }}>★ Populaire au Maroc</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payez en espèces directement au livreur à la réception de votre commande.</p>
          </div>
        </label>
        
        <label style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          background: paymentMethod === 'card' ? 'var(--primary-light)' : 'var(--bg-subtle)',
          border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (paymentMethod !== 'card') {
            e.currentTarget.style.borderColor = 'var(--primary-light)';
          }
        }}
        onMouseLeave={(e) => {
          if (paymentMethod !== 'card') {
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
        >
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--primary)' }}
          />
          <div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>💳 Paiement en ligne par carte bancaire</span>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Traitement immédiat 100% sécurisé (VISA, Mastercard, CMI).</p>
          </div>
        </label>
        
        <label style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          background: paymentMethod === 'pickup' ? 'var(--primary-light)' : 'var(--bg-subtle)',
          border: `2px solid ${paymentMethod === 'pickup' ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (paymentMethod !== 'pickup') {
            e.currentTarget.style.borderColor = 'var(--primary-light)';
          }
        }}
        onMouseLeave={(e) => {
          if (paymentMethod !== 'pickup') {
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
        >
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === 'pickup'}
            onChange={() => setPaymentMethod('pickup')}
            style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--primary)' }}
          />
          <div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>🏪 Retrait en pharmacie (Gratuit)</span>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Récupérez votre commande directement au comptoir de la pharmacie.</p>
          </div>
        </label>
      </div>

      {paymentMethod === 'card' && (
        <div style={{
          marginTop: '28px',
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(99, 102, 241, 0.03))',
          border: '2px solid rgba(37, 99, 235, 0.15)',
          borderRadius: 'var(--radius-lg)',
          transition: 'all 0.3s ease',
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            marginBottom: '24px',
            paddingBottom: '14px',
            borderBottom: '2px solid rgba(37, 99, 235, 0.12)',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a1f71, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}>💳</span>
            Informations de la carte bancaire
          </h3>

          {savedCards.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>Cartes enregistrées</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedCards.map(card => (
                  <label key={card.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    background: selectedCard === card.id && !showAddCard ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(30, 64, 175, 0.06))' : 'white',
                    border: `2px solid ${selectedCard === card.id && !showAddCard ? '#2563eb' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: selectedCard === card.id && !showAddCard ? '0 4px 12px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => { if (selectedCard !== card.id || showAddCard) e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; }}
                  onMouseLeave={(e) => { if (selectedCard !== card.id || showAddCard) e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <input
                      type="radio"
                      name="savedCard"
                      checked={selectedCard === card.id && !showAddCard}
                      onChange={() => { setSelectedCard(card.id); setShowAddCard(false); }}
                      style={{ width: '18px', height: '18px', accentColor: '#2563eb', flexShrink: 0 }}
                    />
                    <div style={{
                      width: '52px',
                      height: '34px',
                      borderRadius: '6px',
                      background: getCardGradient(card.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: card.type === 'visa' ? '0.6rem' : '0.55rem',
                      fontWeight: 900,
                      letterSpacing: '1.5px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>
                      {card.type === 'visa' ? 'VISA' : card.type === 'mastercard' ? '●● MC' : '••••'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '1.5px', fontFamily: "'Courier New', monospace" }}>
                        •••• •••• •••• {card.last4}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {card.name} — Exp. {card.expiry}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteCard(card.id); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                      title="Supprimer cette carte"
                    >🗑️</button>
                  </label>
                ))}
              </div>

              {!showAddCard && (
                <button
                  type="button"
                  onClick={() => { setShowAddCard(true); setSelectedCard(null); }}
                  style={{
                    marginTop: '12px',
                    background: 'none',
                    border: '2px dashed rgba(37, 99, 235, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 20px',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.background = 'rgba(37, 99, 235, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Ajouter une nouvelle carte
                </button>
              )}
            </div>
          )}

          {showAddCard && (
            <div>
              <div style={{
                perspective: '1000px',
                marginBottom: '28px',
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  height: '220px',
                  margin: '0 auto',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: getCardGradient(getCardType(cardNumber)),
                    padding: '28px',
                    color: 'white',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-80px',
                      left: '-40px',
                      width: '250px',
                      height: '250px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      pointerEvents: 'none',
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '50px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #f0c040, #d4a012, #f0c040)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '36px',
                          height: '26px',
                          border: '1.5px solid rgba(180,140,20,0.4)',
                          borderRadius: '4px',
                        }} />
                      </div>
                      <div style={{ fontSize: '1.4rem', opacity: 0.5 }}>📶</div>
                    </div>

                    <div style={{
                      fontSize: '1.35rem',
                      letterSpacing: '3px',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 600,
                      position: 'relative',
                      zIndex: 1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}>
                      {cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px', letterSpacing: '1.5px' }}>Titulaire de la carte</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {cardName || 'NOM PRÉNOM'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px', letterSpacing: '1.5px' }}>Expire</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>
                          {cardExpiry || 'MM/AA'}
                        </div>
                      </div>
                      <div style={{
                        fontSize: getCardType(cardNumber) === 'visa' ? '1.3rem' : '0.9rem',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        opacity: 0.9,
                        fontFamily: "'Arial', sans-serif",
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}>
                        {getCardType(cardNumber) === 'visa' ? 'VISA' : getCardType(cardNumber) === 'mastercard' ? '●● MC' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: getCardGradient(getCardType(cardNumber)),
                    color: 'white',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '50px',
                      background: 'rgba(0,0,0,0.7)',
                      marginTop: '30px',
                    }} />
                    <div style={{
                      margin: '24px 28px 0',
                    }}>
                      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px', letterSpacing: '1.5px' }}>Code de sécurité (CVV)</div>
                      <div style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: '#1e293b',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: '6px',
                        textAlign: 'right',
                        maxWidth: '120px',
                        marginLeft: 'auto',
                      }}>
                        {cardCvv || '•••'}
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '28px',
                      right: '28px',
                      fontSize: '0.65rem',
                      opacity: 0.4,
                      lineHeight: 1.5,
                    }}>
                      Cette carte est la propriété de l&apos;émetteur. Son utilisation est soumise aux conditions générales du contrat porteur.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Numéro de carte</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: '14px', fontSize: '1.1rem', zIndex: 1, pointerEvents: 'none' }}>💳</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      onFocus={() => setIsCardFlipped(false)}
                      maxLength={19}
                      style={{
                        paddingLeft: '44px',
                        paddingRight: getCardType(cardNumber) ? '70px' : '14px',
                        letterSpacing: '2px',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '1.05rem',
                      }}
                    />
                    {getCardType(cardNumber) && (
                      <span style={{
                        position: 'absolute',
                        right: '14px',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        color: getCardType(cardNumber) === 'visa' ? '#1a1f71' : '#1a1a2e',
                        letterSpacing: '1.5px',
                        background: 'rgba(0,0,0,0.06)',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                      }}>
                        {getCardType(cardNumber) === 'visa' ? 'VISA' : 'MASTERCARD'}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Nom sur la carte</label>
                  <div className="form-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom tel qu'affiché sur la carte"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      onFocus={() => setIsCardFlipped(false)}
                      style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Date d'expiration</label>
                    <div className="form-wrapper">
                      <span className="input-icon">📅</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCardExpiry(formatExpiry(raw));
                        }}
                        onFocus={() => setIsCardFlipped(false)}
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>CVV</label>
                    <div className="form-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        maxLength={4}
                        style={{ letterSpacing: '4px' }}
                      />
                    </div>
                  </div>
                </div>

                {user && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    background: saveCardChecked ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(30, 64, 175, 0.04))' : 'white',
                    border: `1.5px solid ${saveCardChecked ? 'rgba(37, 99, 235, 0.3)' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                    <input
                      type="checkbox"
                      checked={saveCardChecked}
                      onChange={(e) => setSaveCardChecked(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#2563eb', flexShrink: 0 }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                        Sauvegarder cette carte pour la prochaine fois
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        🔒 Seuls les 4 derniers chiffres sont conservés pour votre sécurité
                      </span>
                    </div>
                  </label>
                )}

                <div style={{
                  marginTop: '18px',
                  padding: '18px',
                  background: (simulateInsufficientBalance || parseFloat(cardBalance) < total) ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)',
                  border: `1.5px dashed ${(simulateInsufficientBalance || parseFloat(cardBalance) < total) ? '#ef4444' : '#22c55e'}`,
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>
                      🏦 Solde bancaire disponible de la carte
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: (simulateInsufficientBalance || parseFloat(cardBalance) < total) ? '#fee2e2' : '#dcfce7',
                      color: (simulateInsufficientBalance || parseFloat(cardBalance) < total) ? '#dc2626' : '#15803d',
                    }}>
                      {(simulateInsufficientBalance || parseFloat(cardBalance) < total) ? '⚠️ Solde Insuffisant' : '✓ Solde Suffisant'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <input
                      type="number"
                      value={simulateInsufficientBalance ? 0 : cardBalance}
                      disabled={simulateInsufficientBalance}
                      onChange={(e) => setCardBalance(e.target.value)}
                      placeholder="Solde en MAD"
                      style={{
                        width: '130px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>MAD</span>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                      <button
                        type="button"
                        onClick={() => { setCardBalance(30); setSimulateInsufficientBalance(false); }}
                        style={{
                          padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', cursor: 'pointer',
                          border: '1px solid #ef4444', background: cardBalance == 30 && !simulateInsufficientBalance ? '#ef4444' : 'white',
                          color: cardBalance == 30 && !simulateInsufficientBalance ? 'white' : '#ef4444',
                        }}
                      >
                        30 MAD (Test Manque)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCardBalance(500); setSimulateInsufficientBalance(false); }}
                        style={{
                          padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', cursor: 'pointer',
                          border: '1px solid #22c55e', background: cardBalance == 500 && !simulateInsufficientBalance ? '#22c55e' : 'white',
                          color: cardBalance == 500 && !simulateInsufficientBalance ? 'white' : '#15803d',
                        }}
                      >
                        500 MAD (OK)
                      </button>
                    </div>
                  </div>

                  {(simulateInsufficientBalance || parseFloat(cardBalance) < total) ? (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>
                      ❌ Manque d&apos;argent : Le solde disponible ({(simulateInsufficientBalance ? 0 : parseFloat(cardBalance) || 0).toFixed(2)} MAD) est inférieur au total ({total.toFixed(2)} MAD). Le paiement sera refusé.
                    </p>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                      ✓ Votre solde bancaire permet de régler cette commande de {total.toFixed(2)} MAD.
                    </p>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '22px',
                padding: '14px 16px',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🔒 SSL 256-bit
                </span>
                <span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>|</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🛡️ 3D Secure
                </span>
                <span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>|</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  ✓ PCI DSS
                </span>
                <span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>|</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🏦 CMI Maroc
                </span>
              </div>
            </div>
          )}

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePrevStep}
              style={{
                padding: '12px 24px', background: 'var(--bg-subtle)',
                color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              ← Retour à la livraison
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                padding: '14px 28px', background: 'linear-gradient(135deg, var(--primary), #45a049)',
                color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
              }}
            >
              Continuer vers le Récapitulatif ➔
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default PaymentStep;
