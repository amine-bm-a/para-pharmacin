import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PolitiqueConfidentialite() {
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <Helmet>
        <title>Politique de Confidentialité — Para Ben Moussa</title>
        <meta 
          name="description" 
          content="Politique de confidentialité et protection des données personnelles (Loi 09-08 CNDP Maroc) de la Grande Pharmacie Ben Moussa." 
        />
      </Helmet>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Politique de Confidentialité</span>
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
          Politique de Confidentialité & Protection des Données (CNDP)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Dernière mise à jour : 29 Juillet 2026 — Conforme à la <strong>Loi N° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel du Royaume du Maroc.
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>1. Engagement de la Pharmacie</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            La <strong>Grande Pharmacie Ben Moussa</strong> s'engage fermement à respecter la vie privée et la confidentialité des données personnelles de ses clients et utilisateurs. Toutes les informations recueillies sur notre plateforme sont traitées conformément aux dispositions de la <strong>Loi n° 09-08</strong> promulguée par le Dahir n° 1-09-15 du 18 février 2009.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>2. Collecte des Données Personnelles</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: '12px' }}>
            Dans le cadre de l'utilisation du site et du traitement de vos commandes, nous pouvons collecter les données suivantes :
          </p>
          <ul style={{ lineHeight: 1.8, paddingLeft: '24px', color: 'var(--text)' }}>
            <li><strong>Identité :</strong> Nom, prénom, adresse email, numéro de téléphone.</li>
            <li><strong>Livraison :</strong> Adresse postale, ville, code postal.</li>
            <li><strong>Ordonnances Médicales :</strong> Scans ou photos transmises de manière confidentielle pour la préparation des médicaments prescrits.</li>
            <li><strong>Historique d'achat :</strong> Commandes, points de fidélité et préférences produits.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>3. Finalité du Traitement</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Vos données personnelles sont collectées exclusivement pour :
          </p>
          <ul style={{ lineHeight: 1.8, paddingLeft: '24px', color: 'var(--text)' }}>
            <li>La gestion, validation et livraison de vos commandes.</li>
            <li>La vérification pharmaceutique des ordonnances médicales.</li>
            <li>L'envoi des notifications d'état de commande (Email, SMS & WhatsApp).</li>
            <li>La gestion du programme de fidélité et le service client.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>4. Vos Droits (Accès, Rectification, Opposition)</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Conformément à la Loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition sur les données personnelles vous concernant. Vous pouvez exercer ce droit à tout moment :
          </p>
          <div style={{ background: 'var(--bg-subtle)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginTop: '12px' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>📧 Email : contact@pharmacie-benmoussa.ma</p>
            <p style={{ margin: '6px 0 0', fontWeight: 600 }}>📞 Téléphone / WhatsApp : +212 7 73 64 42 84</p>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '12px' }}>5. Sécurité et Confidentialité des Ordonnances</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text)' }}>
            Toutes les ordonnances transmises via le site sont stockées de manière sécurisée dans un espace privé non accessible au public. Elles sont traitées exclusivement par des docteurs en pharmacie autorisés.
          </p>
        </section>
      </div>
    </div>
  );
}
