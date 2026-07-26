import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function OrderTracking() {
  const { t } = useLang();
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await axios.get(`/deliveries/track/${id}`);
        if (res.data.success) {
          setDelivery(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des informations de suivi.');
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [id]);

  const steps = [
    { label: 'Commande reçue', value: 'pending', desc: 'Votre commande a bien été enregistrée.', icon: Clock },
    { label: 'En cours de préparation', value: 'preparing', desc: 'Notre pharmacien prépare votre colis.', icon: PackageCheck },
    { label: 'Expédiée', value: 'shipped', desc: 'Le colis a été remis au transporteur.', icon: Truck },
    { label: 'Livrée', value: 'delivered', desc: 'Le colis a été déposé à votre adresse.', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    if (status === 'pending') return 0;
    if (status === 'preparing') return 1;
    if (status === 'shipped' || status === 'out_for_delivery') return 2;
    if (status === 'delivered') return 3;
    return -1;
  };

  const currentStep = delivery ? getStepIndex(delivery.status) : 0;

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-subtle)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '32px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {t('tracking')} #{id}
        </h1>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px', 
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{t('loading')}</p>
          </div>
        ) : error ? (
          <div style={{
            background: 'var(--danger-light)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center',
            color: 'var(--danger)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Delivery Info */}
            <div style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transporteur</span>
                <p style={{ fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text)' }}>{delivery.carrier}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Numéro de suivi</span>
                <p style={{ fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text)' }}>{delivery.tracking_number || 'En attente'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destination</span>
                <p style={{ fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text)' }}>{delivery.city}, {delivery.address}</p>
              </div>
            </div>

            {/* Timeline */}
            <div style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
                {/* Vertical Connector Line */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  background: 'var(--border-light)',
                  zIndex: 0
                }} />

                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isCompleted ? 'linear-gradient(135deg, var(--primary), #45a049)' : 'white',
                        border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border-light)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                        boxShadow: isCurrent ? '0 4px 15px rgba(76, 175, 80, 0.4)' : 'none'
                      }}>
                        <StepIcon size={20} />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: isCompleted ? 'var(--text)' : 'var(--text-muted)',
                          margin: '0 0 4px 0'
                        }}>
                          {step.label}
                        </h3>
                        <p style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          margin: 0
                        }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
