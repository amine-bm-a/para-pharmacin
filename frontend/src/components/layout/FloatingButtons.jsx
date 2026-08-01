import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Maximize, ArrowUp } from 'lucide-react';

const FloatingButtons = () => {
  const navigate = useNavigate();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const openWhatsAppSupport = () => {
    const message = encodeURIComponent("Bonjour Pharmacie Ben Moussa, j'ai une question concernant un produit ou une commande.");
    window.open(`https://wa.me/212773644284?text=${message}`, '_blank');
  };

  return (
    <div className="fab-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
      {/* WhatsApp Live Chat Button with Pulse Indicator */}
      <button 
        onClick={openWhatsAppSupport}
        title="Chat WhatsApp avec un Pharmacien"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#25D366',
          color: 'white',
          border: 'none',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span title="Pharmacie En Ligne" style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#4CAF50',
          border: '2px solid white'
        }} />
      </button>

      {/* Small action buttons */}
      <button className="fab-small" title="Mon Compte" onClick={() => navigate('/mon-compte')}>
        <User size={18} />
      </button>
      <button className="fab-small" title="Mes Favoris" onClick={() => navigate('/favoris')}>
        <Heart size={18} />
      </button>
      <button className="fab-small" title="Plein Écran" onClick={toggleFullScreen}>
        <Maximize size={18} />
      </button>
      <button className="fab-small" title="Retour en haut" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

export default FloatingButtons;
