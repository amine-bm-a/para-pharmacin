import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLang } from '../context/LangContext';

const FAQS = [
  {
    q: 'Comment passer une commande ?',
    a: 'Pour commander, ajoutez simplement les produits souhaités à votre panier, puis suivez les étapes de paiement de la page Checkout. Si un produit nécessite une ordonnance, vous serez invité à la télécharger lors du paiement.'
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Les commandes sont traitées et expédiées sous 24h. Les délais de livraison varient de 24h à 72h ouvrables sur tout le Maroc selon votre ville de destination.'
  },
  {
    q: 'La livraison est-elle payante ?',
    a: 'La livraison est gratuite pour toute commande supérieure ou égale à 500 DH. En dessous de ce montant, les frais de livraison standard s\'élèvent à 35 DH.'
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Une fois votre commande expédiée, vous recevrez une notification contenant un numéro de suivi. Vous pourrez alors suivre votre colis sur la page de Suivi de Commande.'
  },
  {
    q: 'Puis-je retourner un produit ?',
    a: 'Oui, conformément à notre politique de retour, vous disposez d\'un délai de 7 jours après réception de votre commande pour retourner les produits non ouverts dans leur emballage d\'origine.'
  }
];

export default function FAQ() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}>
            <HelpCircle size={28} color="white" />
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            margin: 0,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('faq')}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Retrouvez les réponses aux questions les plus fréquemment posées.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    background: isOpen ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '16px',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
