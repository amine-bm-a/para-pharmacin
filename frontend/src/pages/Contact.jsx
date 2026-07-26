import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

export default function Contact() {
  const notif = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/contact', { name, email, subject, message });
      if (res.data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        if (notif) notif.success('Votre message a été envoyé avec succès !');
      }
    } catch (err) {
      console.error('Error sending contact message', err);
      const errMsg = err.response?.data?.message || 'Erreur lors de l\'envoi du message.';
      if (notif) notif.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
      {/* Breadcrumbs */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)', 
        marginBottom: '24px',
        padding: '12px 16px',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🏠</span>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Contactez-nous</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: 800, 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Contactez la Pharmacie
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          Une question sur un produit, une ordonnance ou besoin d'un conseil ? N'hésitez pas à nous envoyer un message ou à nous appeler directement.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginBottom: '60px' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ 
              fontSize: '2rem', 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>📞</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Téléphone</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>+212 5 24 42 38 23</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Du lundi au samedi, 9h00 - 21h30</p>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ 
              fontSize: '2rem', 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>✉️</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Email</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.05rem', marginTop: '4px' }}>contact@pharmacie-benmoussa.ma</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Réponse sous 24h ouvrées</p>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
          >
            <div style={{ 
              fontSize: '2rem', 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>📍</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Adresse physique</h4>
              <p style={{ color: 'var(--text)', marginTop: '4px', fontSize: '0.95rem', fontWeight: 500 }}>Immeuble Nakhil 3, Rue Roda, Guéliz, Marrakech, Maroc</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>En face de l'ancienne prison boulemharz</p>
            </div>
          </div>

          {/* Simulated stylized map */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-light), white)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-light)', 
            padding: '30px', 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
          }}
          >
            <span style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</span>
            <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', fontSize: '1.1rem' }}>Localisation sur Google Maps</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
              Trouvez facilement notre officine à Guéliz, Marrakech. Stationnement disponible en face.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '32px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)' 
        }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Envoyer un message</h3>
          
          {submitted && (
            <div style={{ 
              background: 'var(--success-light)', 
              color: 'var(--success)', 
              padding: '16px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(16, 185, 129, 0.2)', 
              marginBottom: '20px', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
            }}>
              <span>👍</span> Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Nom complet</label>
              <div className="form-wrapper" style={{ position: 'relative' }}>
                <span className="input-icon" style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>👤</span>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Email</label>
              <div className="form-wrapper" style={{ position: 'relative' }}>
                <span className="input-icon" style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>📧</span>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Sujet</label>
              <div className="form-wrapper" style={{ position: 'relative' }}>
                <span className="input-icon" style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>📝</span>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>Message</label>
              <div className="form-wrapper" style={{ position: 'relative' }}>
                <span className="input-icon" style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }}>💬</span>
                <textarea 
                  rows="4" 
                  className="form-control" 
                  style={{ 
                    resize: 'vertical', 
                    borderRadius: 'var(--radius-md)', 
                    paddingLeft: '44px',
                    paddingTop: '12px'
                  }} 
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), #45a049)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                }
              }}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
