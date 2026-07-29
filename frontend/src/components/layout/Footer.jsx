import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Phone, Mail, Clock, User, ShoppingCart } from 'lucide-react';

// Inline SVG icons (safe - no lucide dependency)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Footer() {
  const { isDark } = useTheme();

  // Colors
  const bg = isDark ? '#0d0d1a' : '#ffffff';
  const textMain = isDark ? '#ffffff' : '#2E3A4B';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : '#5D6A85';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';
  const borderDarker = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb';
  const trustBg = isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb';
  const green = '#166534'; // Pro green
  const greenLight = isDark ? 'rgba(22,101,52,0.2)' : '#e8f5ed';

  const socialIconStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px', borderRadius: '50%',
    border: `1.5px solid ${green}`,
    color: green,
    background: 'transparent',
    transition: 'all 0.3s'
  };

  const listContainerStyle = {
    display: 'flex', flexDirection: 'column', gap: '0'
  };

  const listItemStyle = {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px 0',
    borderBottom: `1px solid ${border}`,
    color: textMuted,
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'color 0.2s'
  };

  const listIconStyle = {
    color: green,
    flexShrink: 0
  };

  const sectionTitleStyle = {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: green,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const titleUnderlineStyle = {
    width: '24px',
    height: '2px',
    background: green
  };

  const TiktokIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const WhatsappIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );

  const TruckIcon = ({size=18, style}) => (<svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>);
  const ShieldCheckIcon = ({size=18, style}) => (<svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>);
  const HelpIcon = ({size=18, style}) => (<svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
  const LockIcon = ({size=18, style}) => (<svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);
  const BadgeIcon = ({size=18, style}) => (<svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);

  return (
    <footer style={{
      background: bg,
      color: textMuted,
      fontFamily: 'var(--font-body)',
      marginTop: 'auto',
      transition: 'background 0.5s ease',
      borderTop: `1px solid ${borderDarker}`
    }}>
      <style>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
          gap: 50px;
        }
        .footer-trust-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          align-items: center;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .footer-bottom-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        @media (min-width: 992px) {
          .trust-item:not(:first-child) {
            border-left: 1px solid ${borderDarker};
            padding-left: 30px;
          }
        }
        @media (max-width: 992px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-trust-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .trust-item {
            justify-content: center;
            text-align: center;
          }
          .footer-bottom-grid {
            justify-content: center;
            text-align: center;
          }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>

      {/* ── Main Footer Grid ── */}
      <div className="container" style={{ padding: '60px 20px 40px' }}>
        <div className="footer-main-grid">
          
          {/* Col 1 – Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img src={logo} alt="Parapharmacie Ben Moussa" style={{ height: '90px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: textMain, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Parapharmacie</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: green, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Ben Moussa</div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: textMuted, marginBottom: '24px', maxWidth: '240px' }}>
              Votre santé et votre bien-être, notre priorité au quotidien.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: <InstagramIcon />, href: '#' },
                { icon: <FacebookIcon />, href: '#' },
                { icon: <TiktokIcon />, href: '#' },
                { icon: <WhatsappIcon />, href: '#' }
              ].map((social, i) => (
                <a key={i} href={social.href} style={socialIconStyle}
                  onMouseEnter={e => { e.currentTarget.style.background = green; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = green; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 – Liens Utiles */}
          <div>
            <div style={sectionTitleStyle}>
              LIENS UTILES
              <div style={titleUnderlineStyle} />
            </div>
            <div style={listContainerStyle}>
              <Link to="/livraison" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <TruckIcon size={18} style={listIconStyle} /> Livraison & Retour
              </Link>
              <Link to="/faq" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <HelpIcon size={18} style={listIconStyle} /> FAQ
              </Link>
              <Link to="/contact" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <Mail size={18} style={listIconStyle} /> Contact
              </Link>
              <Link to="/politique-de-confidentialite" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <ShieldCheckIcon size={18} style={listIconStyle} /> Confidentialité (CNDP)
              </Link>
              <Link to="/cgv" style={{...listItemStyle, borderBottom: 'none'}} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <BadgeIcon size={18} style={listIconStyle} /> Conditions Générales (CGV)
              </Link>
            </div>
          </div>

          {/* Col 3 – Mon Compte */}
          <div>
            <div style={sectionTitleStyle}>
              MON COMPTE
              <div style={titleUnderlineStyle} />
            </div>
            <div style={listContainerStyle}>
              <Link to="/mon-compte" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <User size={18} style={listIconStyle} /> Mon compte
              </Link>
              <Link to="/mes-commandes" style={listItemStyle} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <ShoppingCart size={18} style={listIconStyle} /> Mes commandes
              </Link>
              <Link to="/mes-adresses" style={{...listItemStyle, borderBottom: 'none'}} onMouseEnter={e => e.currentTarget.style.color = green} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                <MapPin size={18} style={listIconStyle} /> Mes adresses
              </Link>
            </div>
          </div>

          {/* Col 4 – Contact */}
          <div>
            <div style={sectionTitleStyle}>
              CONTACT
              <div style={titleUnderlineStyle} />
            </div>
            <div style={listContainerStyle}>
              <div style={listItemStyle}>
                <MapPin size={18} style={listIconStyle} /> 
                <span style={{lineHeight: 1.4}}>Rue Abbes, Guéliz<br/>Marrakech, Maroc</span>
              </div>
              <div style={listItemStyle}>
                <Phone size={18} style={listIconStyle} /> +212 5 24 42 38 23
              </div>
              <div style={listItemStyle}>
                <Mail size={18} style={listIconStyle} /> contact@parabenmoussa.ma
              </div>
              <div style={{...listItemStyle, borderBottom: 'none'}}>
                <Clock size={18} style={listIconStyle} /> Lun - Sam : 09h00 - 20h00
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Trust Banner (Light Gray) ── */}
      <div style={{ background: trustBg, borderTop: `1px solid ${borderDarker}`, borderBottom: `1px solid ${borderDarker}` }}>
        <div className="container" style={{ padding: '30px 20px' }}>
          <div className="footer-trust-grid">
            
            <div className="trust-item">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: green, flexShrink: 0 }}>
                <TruckIcon size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: textMain, fontSize: '0.95rem', marginBottom: '2px' }}>Livraison rapide</div>
                <div style={{ color: textMuted, fontSize: '0.85rem' }}>Partout au Maroc en 24h - 48h</div>
              </div>
            </div>

            <div className="trust-item">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: green, flexShrink: 0 }}>
                <LockIcon size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: textMain, fontSize: '0.95rem', marginBottom: '2px' }}>Paiement sécurisé</div>
                <div style={{ color: textMuted, fontSize: '0.85rem' }}>100% sécurisé et crypté</div>
              </div>
            </div>

            <div className="trust-item">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: green, flexShrink: 0 }}>
                <BadgeIcon size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: textMain, fontSize: '0.95rem', marginBottom: '2px' }}>Produits authentiques</div>
                <div style={{ color: textMuted, fontSize: '0.85rem' }}>Sélectionnés avec soin</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer Bottom ── */}
      <div style={{ padding: '24px 0' }}>
        <div className="container footer-bottom-grid">
          <div style={{ color: textMuted, fontSize: '0.85rem', lineHeight: 1.6 }}>
            © {new Date().getFullYear()} Parapharmacie Ben Moussa.<br/>
            Tous droits réservés.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Fake Payment Icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ border: `1px solid ${borderDarker}`, borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 800, color: '#1434CB', background: isDark ? '#fff' : 'transparent' }}>VISA</div>
              <div style={{ border: `1px solid ${borderDarker}`, borderRadius: '4px', padding: '4px 8px', display: 'flex', alignItems: 'center', background: isDark ? '#fff' : 'transparent' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EB001B' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F79E1B', marginLeft: '-4px', mixBlendMode: 'multiply' }}></div>
              </div>
              <div style={{ border: `1px solid ${borderDarker}`, borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 800, color: '#0AA84F', background: isDark ? '#fff' : 'transparent' }}>CMI</div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: borderDarker }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: textMuted, fontSize: '0.85rem' }}>
              <LockIcon size={14} /> Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
