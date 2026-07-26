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

  return (
    <div className="fab-container">
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
