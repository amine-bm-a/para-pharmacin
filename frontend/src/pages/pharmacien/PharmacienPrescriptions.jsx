import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import {
  FileText, Check, X, Eye, User, ShoppingBag,
  ExternalLink, FileWarning, Loader2
} from 'lucide-react';

export default function PharmacienPrescriptions() {
  const notif = useNotification();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewingFileUrl, setViewingFileUrl] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/pharmacien/prescriptions/pending');
      if (res.data.success) {
        setPrescriptions(res.data.prescriptions || []);
      }
    } catch (e) {
      console.error(e);
      notif.error('Impossible de charger les ordonnances en attente.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleOpenViewer = async (presc) => {
    setSelectedPrescription(presc);
    setRejectComment('');
    setViewingFileUrl(null);
    try {
      const res = await axios.get(`/orders/${presc.order_id}/prescription`, { responseType: 'blob' });
      const blobUrl = URL.createObjectURL(res.data);
      setViewingFileUrl(blobUrl);
    } catch (e) {
      console.error('Error fetching file blob', e);
      notif.error('Erreur lors de la récupération du fichier d\'ordonnance.');
    }
  };

  const handleDecision = async (status) => {
    if (!selectedPrescription) return;

    if (status === 'rejected' && !rejectComment.trim()) {
      notif.error('Un commentaire de rejet est obligatoire pour expliquer le motif au client.');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await axios.put(`/pharmacien/prescriptions/${selectedPrescription.id}/validate`, {
        statut: status,
        commentaire_pharmacien: status === 'rejected' ? rejectComment : 'Ordonnance validée avec succès.',
      });

      if (res.data.success) {
        notif.success(status === 'approved' ? 'Ordonnance validée !' : 'Ordonnance rejetée avec motif.');
        setSelectedPrescription(null);
        setViewingFileUrl(null);
        fetchPrescriptions();
      }
    } catch (e) {
      console.error(e);
      notif.error('Erreur lors de la soumission de la décision.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Title Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FileText size={28} color="var(--primary)" />
          <span>Validation des Ordonnances</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Examinez les ordonnances médicales soumises par les clients pour autoriser la préparation des commandes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPrescription ? '1fr 480px' : '1fr', gap: '32px', transition: 'all 0.3s' }}>
        
        {/* Left Side: Pending list */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
          padding: '24px',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" />
            Ordonnances en attente ({prescriptions.length})
          </h3>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Loader2 size={32} className="spin" style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Recherche d'ordonnances...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileWarning size={36} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '12px' }} />
              <p style={{ fontWeight: 600, margin: 0 }}>Toutes les ordonnances ont été validées !</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {prescriptions.map(presc => (
                <div
                  key={presc.id}
                  onClick={() => handleOpenViewer(presc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: selectedPrescription?.id === presc.id ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    border: `2px solid ${selectedPrescription?.id === presc.id ? 'var(--primary)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (selectedPrescription?.id !== presc.id) {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedPrescription?.id !== presc.id) {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--status-purple-bg)', color: 'var(--status-purple)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.78rem'
                    }}>
                      RX
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text)', marginBottom: '2px' }}>
                        {presc.product?.name}
                      </strong>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} /> {presc.order?.user?.name || 'Client anonyme'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShoppingBag size={12} /> Cmd #{presc.order?.order_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button style={{
                    padding: '8px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Eye size={14} /> Inspecter
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Verification Panel */}
        {selectedPrescription && (
          <aside style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-light)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'sticky',
            top: '24px',
            height: 'calc(100vh - 120px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Vérification de l'ordonnance</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID Prescription: #{selectedPrescription.id}</span>
              </div>
              <button
                onClick={() => { setSelectedPrescription(null); setViewingFileUrl(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Prescription File Preview */}
            <div style={{
              flex: 1,
              background: '#f8fafc',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: '260px',
              position: 'relative'
            }}>
              {!viewingFileUrl ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Loader2 size={24} className="spin" style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chargement du document...</span>
                </div>
              ) : selectedPrescription.fichier?.endsWith('.pdf') ? (
                <object
                  data={viewingFileUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                >
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Le visualiseur PDF ne peut pas s'afficher directement.
                    </p>
                    <a
                      href={viewingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      Ouvrir dans un nouvel onglet <ExternalLink size={14} />
                    </a>
                  </div>
                </object>
              ) : (
                <img
                  src={viewingFileUrl}
                  alt="Ordonnance client"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
                  onClick={() => window.open(viewingFileUrl, '_blank')}
                />
              )}
            </div>

            {/* Decision Fields */}
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} color="var(--text-muted)" /> Commentaire du pharmacien (Obligatoire en cas de rejet)
              </label>
              <textarea
                className="form-control"
                placeholder="Spécifiez la raison du rejet ou ajoutez des instructions spécifiques..."
                value={rejectComment}
                onChange={e => setRejectComment(e.target.value)}
                style={{ height: '80px', resize: 'none', padding: '10px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
              <button
                onClick={() => handleDecision('approved')}
                disabled={submitLoading}
                style={{
                  padding: '12px',
                  background: 'var(--primary)',
                  border: 'none', borderRadius: 'var(--radius-sm)', color: 'white',
                  fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: 'var(--shadow-hover)'
                }}
              >
                <Check size={16} /> Valider l'ordonnance
              </button>
              <button
                onClick={() => handleDecision('rejected')}
                disabled={submitLoading}
                style={{
                  padding: '12px',
                  background: 'var(--status-danger)',
                  border: 'none', borderRadius: 'var(--radius-sm)', color: 'white',
                  fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: 'var(--status-danger-bg) 0 4px 12px'
                }}
              >
                <X size={16} /> Rejeter
              </button>
            </div>

            {/* Warning block */}
            <div style={{
              background: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <FileWarning size={16} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong>Attention :</strong> Le rejet d'une ordonnance entraînera automatiquement l'annulation de la commande parente et enverra une notification in-app, SMS et e-mail au client contenant votre motif.
              </p>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
