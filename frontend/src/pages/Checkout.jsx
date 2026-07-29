import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Submission State
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);

  // Form Fields State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Marrakech');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('delivery'); // delivery, card, pickup
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Saved Addresses State for clients
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load profile information and default addresses when user is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');

      const saved = localStorage.getItem(`addresses_${user.id}`);
      if (saved) {
        const list = JSON.parse(saved);
        setSavedAddresses(list);
        const defaultAddr = list.find(a => a.isDefault);
        if (defaultAddr) {
          setAddress(defaultAddr.address || '');
          setCity(defaultAddr.city || 'Marrakech');
          setZip(defaultAddr.postalCode || '');
          setPhone(defaultAddr.phone || user.phone || '');
        }
      }
    }
  }, [user]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Loyalty points
  const [loyaltyInfo, setLoyaltyInfo]             = useState(null);
  const [pointsToSpend, setPointsToSpend]         = useState(0);
  const [useLoyaltyPoints, setUseLoyaltyPoints]   = useState(false);

  useEffect(() => {
    if (user) {
      axios.get('/loyalty/info').then(res => {
        if (res.data.success) setLoyaltyInfo(res.data);
      }).catch(() => {});
    }
  }, [user]);

  const subtotal = getCartTotal();
  const isMarrakech = city.trim().toLowerCase() === 'marrakech';
  const shipping = paymentMethod === 'pickup' ? 0 : (isMarrakech || subtotal >= 700 ? 0 : 40);
  // Loyalty discount: pointsToSpend / 100 * 5 MAD
  const loyaltyDiscount = useLoyaltyPoints ? (Math.floor(pointsToSpend / 100) * 5) : 0;
  const total = Math.max(0, subtotal + shipping - loyaltyDiscount);

  // True if the cart contains at least one medication that legally
  // requires a doctor's prescription before it can be ordered.
  const needsPrescription = cartItems.some((item) => item.product.requires_prescription);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (needsPrescription && !prescriptionFile) {
      setError("Un ou plusieurs produits de votre panier nécessitent une ordonnance. Merci de la joindre ci-dessous.");
      return;
    }

    // Stock availability check
    const outOfStockItems = cartItems.filter(item => item.product?.stock !== undefined && item.quantity > item.product.stock);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map(i => i.product.name).join(', ');
      setError(`Stock insuffisant pour : ${names}. Veuillez ajuster les quantités dans votre panier.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('shipping_address', address);
      formData.append('shipping_city', city);
      formData.append('postal_code', zip);
      formData.append('phone_number', phone);
      formData.append('payment_method', paymentMethod);
      cartItems.forEach((item, i) => {
        formData.append(`items[${i}][product_id]`, item.product.id);
        formData.append(`items[${i}][quantity]`, item.quantity);
      });
      if (prescriptionFile) {
        formData.append('prescription_file', prescriptionFile);
      }
      if (useLoyaltyPoints && pointsToSpend > 0) {
        formData.append('loyalty_points_to_spend', pointsToSpend);
      }

      const response = await axios.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        if (response.data.requires_redirect && response.data.payment_params) {
          // Clear cart locally first so customer doesn't return with a full cart
          clearCart();
          
          // Dynamically create HTML Form for CMI redirect
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.data.cmi_url || 'https://testpayment.cmi.co.ma/fim/est3Dgate';
          
          Object.entries(response.data.payment_params).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
          return;
        }

        setOrderSuccess(response.data.order);
        clearCart();
      }
    } catch (err) {
      console.error("Checkout order submission error", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de votre commande.");
    } finally {
      setLoading(false);
    }
  };

  // Success view if order is completed
  if (orderSuccess) {
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
  }

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
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Accueil</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <Link to="/cart" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Panier</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Commande</span>
      </div>

        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '32px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Finaliser votre commande</h1>

      {!user && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))', 
          padding: '20px 24px', 
          borderRadius: 'var(--radius-md)', 
          border: '2px solid var(--primary)', 
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '2rem' }}>🔑</span>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Vous devez être connecté pour passer une commande.{' '}
            <Link 
              to="/login?redirect=checkout" 
              style={{ 
                fontWeight: 700, 
                textDecoration: 'none',
                padding: '8px 16px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                marginLeft: '12px',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#45a049';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        {/* Left Form */}
        <div style={{ 
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid var(--border-light)',
            color: 'var(--text)'
          }}>Informations de livraison</h3>
          
          {error && (
            <div style={{ 
              color: 'var(--danger)', 
              marginBottom: '20px',
              padding: '12px 16px',
              background: 'var(--danger-light)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

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
        </div>

        {needsPrescription && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))', 
            border: '2px solid #ffc107', 
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginTop: '24px'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              fontWeight: 800,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 0 16px 0'
            }}>📄 Ordonnance médicale requise</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
              Votre panier contient un ou plusieurs médicaments soumis à ordonnance. Merci de joindre une photo nette ou un scan (JPG, PNG ou PDF, max 5 Mo) de votre ordonnance valide. Un pharmacien vérifiera ce document avant la préparation de votre commande.
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
              <div style={{ 
                fontSize: '0.85rem', 
                marginTop: '12px', 
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✓</span>
                <span>Fichier sélectionné : {prescriptionFile.name}</span>
              </div>
            )}
          </div>
        )}
        <aside style={{ 
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          height: 'fit-content',
          position: 'sticky',
          top: '24px'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid var(--border-light)',
            color: 'var(--text)'
          }}>Résumé de la commande</h3>
          
          {/* Items Listing */}
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            marginBottom: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            padding: '4px'
          }}>
            {cartItems.map((item) => (
              <div 
                key={item.product.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }} 
                  />
                  <div style={{ maxWidth: '140px' }}>
                    <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '2px' }}>{item.product.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qté: {item.quantity}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                  {((item.product.discount_price ? parseFloat(item.product.discount_price) : parseFloat(item.product.price)) * item.quantity).toFixed(2)} MAD
                </span>
              </div>
            ))}
          </div>

          {/* ── Loyalty Points ── */}
          {loyaltyInfo && loyaltyInfo.balance > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1.5px solid #86efac',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={useLoyaltyPoints}
                  onChange={e => {
                    setUseLoyaltyPoints(e.target.checked);
                    if (!e.target.checked) setPointsToSpend(0);
                    else setPointsToSpend(Math.min(loyaltyInfo.balance, Math.floor(loyaltyInfo.balance / 100) * 100));
                  }}
                  style={{ width: '17px', height: '17px', accentColor: '#22c55e', flexShrink: 0 }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d' }}>
                  ⭐ Utiliser mes points de fidélité
                  <span style={{ display: 'block', fontWeight: 500, fontSize: '0.78rem', color: '#16a34a', marginTop: '1px' }}>
                    Solde : {loyaltyInfo.balance} pts (= {loyaltyInfo.discount_value_mad.toFixed(2)} MAD max)
                  </span>
                </span>
              </label>

              {useLoyaltyPoints && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#15803d', marginBottom: '6px' }}>
                    <span>{pointsToSpend} pts utilisés</span>
                    <span>-{(Math.floor(pointsToSpend / 100) * 5).toFixed(2)} MAD</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.floor(loyaltyInfo.balance / 100) * 100}
                    step={100}
                    value={pointsToSpend}
                    onChange={e => setPointsToSpend(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#22c55e' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>0 pts</span>
                    <span>{Math.floor(loyaltyInfo.balance / 100) * 100} pts</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '16px',
            fontSize: '0.95rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Sous-total</span>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{subtotal.toFixed(2)} MAD</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '16px',
            fontSize: '0.95rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Frais de livraison</span>
            <span style={{ 
              fontWeight: 700,
              color: shipping === 0 ? 'var(--primary)' : 'var(--text)',
              fontSize: '1rem'
            }}>
              {shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} MAD`}
            </span>
          </div>

          {loyaltyDiscount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '0.95rem',
            }}>
              <span style={{ color: '#15803d', fontWeight: 600 }}>⭐ Réduction fidélité</span>
              <span style={{ fontWeight: 700, color: '#15803d', fontSize: '1rem' }}>-{loyaltyDiscount.toFixed(2)} MAD</span>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            paddingTop: '20px',
            borderTop: '2px solid var(--border)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
            <span style={{ 
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--primary)'
            }}>{total.toFixed(2)} MAD</span>
          </div>

          <button
            type="submit"
            disabled={loading || !user}
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), #45a049)',
              border: 'none',
              cursor: loading || !user ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              if (!loading && user) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && user) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                Traitement en cours...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                💳 Payer et valider la commande
              </span>
            )}
          </button>

          {/* Payment Security */}
          <div style={{ 
            marginTop: '24px', 
            borderTop: '1px solid var(--border)', 
            paddingTop: '20px', 
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Paiement 100% sécurisé</p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px', 
              fontSize: '1.8rem',
              opacity: 0.8
            }}>
              <span title="Visa">💳</span>
              <span title="Mastercard">💳</span>
              <span title="CMI">💳</span>
              <span title="PayPal">🅿️</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>VISA / Mastercard / CMI / PayPal</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
