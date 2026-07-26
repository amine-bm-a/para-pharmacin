import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Plus } from 'lucide-react';

/**
 * PWAInstallBanner — "Add to Home Screen" prompt
 *
 * • On Android Chrome: catches the `beforeinstallprompt` event and shows a
 *   custom banner that triggers the native install dialog.
 * • On iOS Safari: shows a manual guidance banner (iOS doesn't fire
 *   beforeinstallprompt but supports PWA install via the Share sheet).
 * • Dismissed banners are remembered in localStorage for 30 days.
 */
export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA?
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Dismissed within last 30 days?
    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 30 * 24 * 60 * 60 * 1000) return;

    // iOS detection
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS guidance banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 3500);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 3500);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Hide if user installs
    const installedHandler = () => setIsInstalled(true);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
    setShowBanner(false);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)',
        }}
        onClick={handleDismiss}
      />

      {/* Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: 'min(92vw, 420px)',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        role="dialog"
        aria-label="Installer l'application"
      >
        {/* Green gradient header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 52, height: 52,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Smartphone size={26} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '.8rem', margin: 0 }}>
              Para Ben Moussa
            </p>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
              Installer l&apos;application
            </p>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', flexShrink: 0,
            }}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {isIOS ? (
            // iOS manual instructions
            <div>
              <p style={{ color: '#374151', fontSize: '.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Ajoutez Para Ben Moussa à votre écran d&apos;accueil pour un accès rapide et une expérience plein écran.
              </p>
              <ol style={{ paddingLeft: '1.25rem', color: '#6b7280', fontSize: '.88rem', lineHeight: 1.8, margin: 0 }}>
                <li>Appuyez sur l&apos;icône <strong>Partager</strong> (carré avec flèche ↑) dans Safari</li>
                <li>Faites défiler et sélectionnez <strong>&quot;Sur l&apos;écran d&apos;accueil&quot;</strong></li>
                <li>Confirmez en appuyant sur <strong>Ajouter</strong></li>
              </ol>
              <div
                style={{
                  marginTop: '1rem',
                  background: '#f0fdf4',
                  borderRadius: '12px',
                  padding: '.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '.5rem',
                  color: '#16a34a', fontSize: '.85rem', fontWeight: 600,
                }}
              >
                <Plus size={16} />
                Puis &quot;Ajouter&quot; en haut à droite
              </div>
            </div>
          ) : (
            // Android / Chrome install button
            <div>
              <p style={{ color: '#374151', fontSize: '.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Installez notre application pour des commandes plus rapides, un accès hors-ligne et des notifications en temps réel.
              </p>
              <div style={{ display: 'flex', gap: '.75rem' }}>
                <button
                  onClick={handleDismiss}
                  style={{
                    flex: 1, padding: '.75rem',
                    border: '1.5px solid #e5e7eb', borderRadius: '12px',
                    background: 'white', cursor: 'pointer',
                    color: '#6b7280', fontWeight: 600, fontSize: '.9rem',
                  }}
                >
                  Plus tard
                </button>
                <button
                  onClick={handleInstall}
                  style={{
                    flex: 2, padding: '.75rem',
                    background: 'linear-gradient(135deg, #16a34a, #059669)',
                    border: 'none', borderRadius: '12px',
                    cursor: 'pointer', color: 'white',
                    fontWeight: 700, fontSize: '.9rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '.4rem',
                  }}
                >
                  <Download size={16} />
                  Installer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation keyframe (injected via style tag) */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
