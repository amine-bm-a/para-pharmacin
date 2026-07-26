import React, { useState, useEffect } from 'react';

const messages = [
  '🚚 LIVRAISON OFFERTE DÈS 500 DH partout au Maroc',
  '🔐 PAIEMENT 100% SÉCURISÉ à la livraison ou en ligne',
  '🛡️ PRODUITS 100% AUTHENTIQUES de parapharmacie premium',
  '💬 CONSEILS ET SUPPORT DE PHARMACIENS PROFESSIONNELS 24/7'
];

const Header = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-banner" style={{
      background: 'var(--secondary)',
      color: 'white',
      padding: '8px 0',
      fontSize: '0.88rem',
      fontWeight: 500,
      textAlign: 'center',
      overflow: 'hidden',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div key={index} style={{
        animation: 'fadeInOut 4s ease-in-out infinite',
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.5px'
      }}>
        {messages[index]}
      </div>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(8px); }
          8% { opacity: 1; transform: translateY(0); }
          92% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default Header;
