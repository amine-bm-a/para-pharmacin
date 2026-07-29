import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CGV() {
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <Helmet>
        <title>Conditions Générales de Vente (CGV) — Para Ben Moussa</title>
        <meta 
          name="description" 
          content="Conditions Générales de Vente et d'Utilisation de la Grande Pharmacie Ben Moussa (Livraison, Paiement COD & Carte, Retours)." 
        />
      </Helmet>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Conditions Générales de Vente</span>
      </nav>

      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          color: 'var(--text)', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, var(--primary), #2E7D32)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Conditions Générales de Vente (CGV) & d'Utilisation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Dernière mise à jour : 29 Juillet 2026 — Grande Pharmacie Ben Moussa, Marrakech, Maroc.
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>1. Objet</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Les présentes Conditions Générales de Vente régissent l'ensemble des relations entre la <strong>Grande Pharmacie Ben Moussa</strong> et ses clients commandant sur le site parabenmoussa.ma ou l'application mobile associée.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>2. Commandes & Produits de Parapharmacie / Médicaments</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Le client peut passer commande de produits de parapharmacie, dermocosmétique, et compléments alimentaires. Pour tout médicament nécessitant une ordonnance, l'envoi d'un document valide lisible est obligatoire avant toute préparation.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>3. Modes de Paiement</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: '12px' }}>
            Nous proposons plusieurs modes de paiement sécurisés adaptés aux préférences des clients au Maroc :
          </p>
          <ul style={{ lineHeight: 1.8, paddingLeft: '24px', color: 'var(--text)' }}>
            <li><strong>Paiement à la livraison (Cash/COD) :</strong> Règlement en espèces au livreur lors de la réception de la commande.</li>
            <li><strong>Paiement en ligne par Carte Bancaire (CMI) :</strong> Traitement 100% sécurisé via la plateforme CMI (Centre Monétique Interbancaire).</li>
            <li><strong>Retrait en Pharmacie :</strong> Gratuit au comptoir de la pharmacie.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>4. Livraison & Tarifs</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            La livraison à Marrakech est offerte pour toute commande supérieure à 700 MAD (ou forfait 40 MAD). Les délais d'expédition sont généralement de 24h à 48h ouvrées sur l'ensemble du territoire marocain.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>5. Service Client & Réclamations</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Pour toute question ou réclamation concernant une commande, notre équipe pharmaceutique reste disponible du Lundi au Samedi de 8h30 à 20h00 au <strong>+212 7 73 64 42 84</strong> ou par email à <strong>contact@pharmacie-benmoussa.ma</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
