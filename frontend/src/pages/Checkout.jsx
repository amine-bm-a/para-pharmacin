import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderSuccess from './checkout/OrderSuccess';
import DeliveryStep from './checkout/DeliveryStep';
import PaymentStep from './checkout/PaymentStep';
import ReviewStep from './checkout/ReviewStep';
import OrderSummary from './checkout/OrderSummary';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Marrakech');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('delivery');
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(true);
  const [saveCardChecked, setSaveCardChecked] = useState(false);
  const [cardBalance, setCardBalance] = useState(500);
  const [simulateInsufficientBalance, setSimulateInsufficientBalance] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);

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

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const validateStep1 = () => {
    if (!name.trim()) { setError("Veuillez renseigner votre nom complet."); return false; }
    if (!email.trim()) { setError("Veuillez renseigner votre adresse email."); return false; }
    if (!phone.trim()) { setError("Veuillez renseigner votre numéro de téléphone."); return false; }
    if (paymentMethod !== 'pickup' && !address.trim()) { setError("Veuillez renseigner votre adresse de livraison complète."); return false; }
    if (needsPrescription && !prescriptionFile) {
      setError("Un ou plusieurs produits de votre panier nécessitent une ordonnance. Merci de la joindre.");
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'card' && showAddCard) {
      const cleanCard = cardNumber.replace(/\D/g, '');
      if (cleanCard.length < 16) { setError("⚠️ Numéro de carte invalide. 16 chiffres requis."); return false; }
      if (!cardName.trim()) { setError("⚠️ Veuillez indiquer le nom sur la carte bancaire."); return false; }
      if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) { setError("⚠️ Date d'expiration invalide (format MM/AA requis)."); return false; }
      if (!cardCvv || cardCvv.length < 3) { setError("⚠️ Code CVV invalide (3 ou 4 chiffres)."); return false; }
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [pointsToSpend, setPointsToSpend] = useState(0);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code || couponLoading) return;
    setCouponLoading(true);
    setCouponMsg('');
    try {
      const res = await axios.post('/coupons/validate', { code, amount: subtotal });
      if (res.data.success) {
        setAppliedCoupon({ code: res.data.coupon.code, discount: parseFloat(res.data.discount) });
        setCouponMsg(`✅ Code « ${res.data.coupon.code} » appliqué : -${parseFloat(res.data.discount).toFixed(2)} MAD`);
      } else {
        setCouponMsg(res.data.message || 'Code promo invalide.');
      }
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Code promo invalide ou expiré.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMsg('');
  };

  useEffect(() => {
    if (user) {
      axios.get('/loyalty/info').then(res => {
        if (res.data.success) setLoyaltyInfo(res.data);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`saved_cards_${user.id}`);
      if (saved) {
        try {
          const cards = JSON.parse(saved);
          setSavedCards(cards);
          if (cards.length > 0) {
            setSelectedCard(cards[0].id);
            setShowAddCard(false);
          }
        } catch (e) { /* ignore parse errors */ }
      }
    }
  }, [user]);

  const getCardType = (number) => {
    const n = number.replace(/\D/g, '');
    if (n.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
    return null;
  };

  const subtotal = getCartTotal();
  const isMarrakech = city.trim().toLowerCase() === 'marrakech';
  const shipping = paymentMethod === 'pickup' ? 0 : (isMarrakech || subtotal >= 700 ? 0 : 40);
  const loyaltyDiscount = useLoyaltyPoints ? (Math.floor(pointsToSpend / 100) * 5) : 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shipping - loyaltyDiscount - couponDiscount);
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

    const outOfStockItems = cartItems.filter(item => item.product?.stock !== undefined && item.quantity > item.product.stock);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map(i => i.product.name).join(', ');
      setError(`Stock insuffisant pour : ${names}. Veuillez ajuster les quantités dans votre panier.`);
      return;
    }

    if (paymentMethod === 'card') {
      if (showAddCard) {
        const cleanCard = cardNumber.replace(/\D/g, '');
        if (cleanCard.length < 16) {
          setError("⚠️ Numéro de carte invalide. Veuillez saisir les 16 chiffres de votre carte bancaire.");
          return;
        }
        if (!cardName.trim()) {
          setError("⚠️ Veuillez indiquer le nom figurant sur la carte bancaire.");
          return;
        }
        if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
          setError("⚠️ Date d'expiration invalide (format MM/AA requis).");
          return;
        }
        if (!cardCvv || cardCvv.length < 3) {
          setError("⚠️ Code de sécurité CVV invalide (3 ou 4 chiffres requis).");
          return;
        }
      }

      const availableFunds = simulateInsufficientBalance ? 0 : parseFloat(cardBalance);
      if (isNaN(availableFunds) || availableFunds < total) {
        const availStr = (isNaN(availableFunds) ? 0 : availableFunds).toFixed(2);
        setError(`❌ Paiement refusé par votre banque : Solde bancaire insuffisant (Code 51 — Solde Insuffisant). Votre solde disponible (${availStr} MAD) ne couvre pas le total de la commande (${total.toFixed(2)} MAD). Veuillez approvisionner votre carte ou choisir un autre mode de paiement.`);
        return;
      }
    }

    if (paymentMethod === 'card' && saveCardChecked && showAddCard && cardNumber && cardName && cardExpiry && user) {
      const newCard = {
        id: Date.now(),
        last4: cardNumber.replace(/\D/g, '').slice(-4),
        name: cardName,
        expiry: cardExpiry,
        type: getCardType(cardNumber),
      };
      const existing = [...savedCards, newCard];
      setSavedCards(existing);
      localStorage.setItem(`saved_cards_${user.id}`, JSON.stringify(existing));
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
      if (paymentMethod === 'card') {
        formData.append('card_number', cardNumber.replace(/\D/g, ''));
        formData.append('card_balance', simulateInsufficientBalance ? 0 : cardBalance);
      }
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
      if (appliedCoupon) {
        formData.append('coupon_code', appliedCoupon.code);
      }

      const activeToken = token || localStorage.getItem('token');
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const response = await axios.post('/orders', formData, { headers });

      if (response.data.success) {
        if (response.data.requires_redirect && response.data.payment_params) {
          clearCart();
          
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
      if (err.response?.status === 401) {
        logout();
        setError("Votre session de connexion a expiré. Redirection vers la page de connexion...");
        setTimeout(() => {
          navigate('/login?redirect=checkout');
        }, 1500);
        return;
      }
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de votre commande.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <OrderSuccess
        orderSuccess={orderSuccess}
        name={name}
        address={address}
        city={city}
        zip={zip}
        phone={phone}
        paymentMethod={paymentMethod}
      />
    );
  }

  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
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

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '32px', padding: '16px 24px', background: 'white',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '60px', right: '60px',
          height: '4px', background: 'var(--border-light)', transform: 'translateY(-50%)', zIndex: 1
        }}>
          <div style={{
            height: '100%',
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            background: 'var(--primary)', transition: 'width 0.4s ease'
          }} />
        </div>

        <div
          onClick={() => currentStep > 1 && setCurrentStep(1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2,
            background: 'white', padding: '0 8px', cursor: currentStep > 1 ? 'pointer' : 'default'
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: currentStep >= 1 ? 'var(--primary)' : 'var(--bg-subtle)',
            color: currentStep >= 1 ? 'white' : 'var(--text-muted)',
            fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            1
          </div>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: currentStep === 1 ? 'var(--primary)' : 'var(--text)', display: 'block' }}>📍 1. Livraison</span>
          </div>
        </div>

        <div
          onClick={() => (currentStep > 2 || (currentStep === 1 && validateStep1())) && setCurrentStep(2)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2,
            background: 'white', padding: '0 8px', cursor: 'pointer'
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: currentStep >= 2 ? 'var(--primary)' : 'var(--bg-subtle)',
            color: currentStep >= 2 ? 'white' : 'var(--text-muted)',
            fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            2
          </div>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: currentStep === 2 ? 'var(--primary)' : 'var(--text)', display: 'block' }}>💳 2. Paiement</span>
          </div>
        </div>

        <div
          onClick={() => currentStep >= 2 && validateStep2() && setCurrentStep(3)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2,
            background: 'white', padding: '0 8px', cursor: currentStep === 3 ? 'default' : 'pointer'
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: currentStep === 3 ? 'var(--primary)' : 'var(--bg-subtle)',
            color: currentStep === 3 ? 'white' : 'var(--text-muted)',
            fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            3
          </div>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: currentStep === 3 ? 'var(--primary)' : 'var(--text)', display: 'block' }}>📋 3. Validation</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        <div style={{ 
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          {error && (
            <div ref={errorRef} style={{ 
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

          {currentStep === 1 && (
            <DeliveryStep
              name={name} setName={setName}
              email={email} setEmail={setEmail}
              phone={phone} setPhone={setPhone}
              address={address} setAddress={setAddress}
              city={city} setCity={setCity}
              zip={zip} setZip={setZip}
              savedAddresses={savedAddresses}
              needsPrescription={needsPrescription}
              prescriptionFile={prescriptionFile} setPrescriptionFile={setPrescriptionFile}
              handleNextStep={handleNextStep}
            />
          )}

          <PaymentStep
            paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
            cardNumber={cardNumber} setCardNumber={setCardNumber}
            cardName={cardName} setCardName={setCardName}
            cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
            cardCvv={cardCvv} setCardCvv={setCardCvv}
            isCardFlipped={isCardFlipped} setIsCardFlipped={setIsCardFlipped}
            savedCards={savedCards} setSavedCards={setSavedCards}
            selectedCard={selectedCard} setSelectedCard={setSelectedCard}
            showAddCard={showAddCard} setShowAddCard={setShowAddCard}
            saveCardChecked={saveCardChecked} setSaveCardChecked={setSaveCardChecked}
            cardBalance={cardBalance} setCardBalance={setCardBalance}
            simulateInsufficientBalance={simulateInsufficientBalance} setSimulateInsufficientBalance={setSimulateInsufficientBalance}
            user={user} total={total}
            handlePrevStep={handlePrevStep} handleNextStep={handleNextStep}
          />

          {currentStep === 3 && (
            <ReviewStep
              name={name} phone={phone}
              address={address} city={city} zip={zip}
              paymentMethod={paymentMethod}
              setCurrentStep={setCurrentStep}
              handlePrevStep={handlePrevStep}
            />
          )}
        </div>

        <OrderSummary
          cartItems={cartItems}
          loyaltyInfo={loyaltyInfo}
          useLoyaltyPoints={useLoyaltyPoints} setUseLoyaltyPoints={setUseLoyaltyPoints}
          pointsToSpend={pointsToSpend} setPointsToSpend={setPointsToSpend}
          subtotal={subtotal} shipping={shipping}
          loyaltyDiscount={loyaltyDiscount} total={total}
          couponInput={couponInput} setCouponInput={setCouponInput}
          appliedCoupon={appliedCoupon} couponLoading={couponLoading}
          couponMsg={couponMsg} handleApplyCoupon={handleApplyCoupon} removeCoupon={removeCoupon}
          loading={loading} user={user}
          error={error} setError={setError}
        />
      </form>
    </div>
  );
}
