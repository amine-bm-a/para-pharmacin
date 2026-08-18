import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_BASE_URL } from '../../utils/textUtils';
import { 
  Upload, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';

const PrescriptionCenter = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/prescriptions');
      if (res.data.success) {
        setPrescriptions(res.data.prescriptions || []);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleFileUpload = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file) return;

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('prescription_file', file);

      const res = await axios.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessage('Votre ordonnance a bien été soumise et est en cours de vérification par nos pharmaciens.');
        setSelectedFile(null);
        fetchPrescriptions();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'ordonnance.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'validated': return '#2E7D5B';
      case 'rejected': return '#DC2626';
      default: return '#C9A96A';
    }
  };

  const getStatusLabel = (status, customLabel) => {
    if (customLabel) return customLabel;
    switch (status) {
      case 'approved':
      case 'validated': return 'Validée';
      case 'rejected': return 'Rejetée';
      default: return 'En attente de révision';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'validated': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setSelectedFile(droppedFile);
      handleFileUpload(droppedFile);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
            Gestion des Ordonnances
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            Téléchargez et suivez la validation de vos ordonnances médicales en temps réel.
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '14px 18px', background: '#F0F9F4', border: '1px solid #2E7D5B', borderRadius: 12, color: '#2E7D5B', fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1px solid #DC2626', borderRadius: 12, color: '#DC2626', fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #2E7D5B' : '2px dashed #E8E8E8',
          borderRadius: 16,
          padding: '40px 24px',
          textAlign: 'center',
          background: dragActive ? '#F0F9F4' : '#F8F9FA',
          transition: 'all 0.3s ease',
          marginBottom: 32,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
              handleFileUpload(e.target.files[0]);
            }
          }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0, cursor: 'pointer', width: '100%', height: '100%'
          }}
        />

        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'white',
          border: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Upload size={32} style={{ color: '#2E7D5B' }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
          {uploading ? 'Envoi de votre ordonnance...' : selectedFile ? selectedFile.name : 'Déposer une ordonnance'}
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          Glissez-déposez votre scan ou cliquez pour choisir un fichier
        </p>
        <div style={{ fontSize: 12, color: '#999' }}>
          Formats acceptés : PDF, JPG, PNG (Taille max : 10 Mo)
        </div>
      </div>

      {/* Prescription History */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>
          Historique des Ordonnances
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Chargement de l'historique...
          </div>
        ) : prescriptions.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px', borderRadius: 16,
            background: '#F8F9FA', border: '1px dashed #E8E8E8'
          }}>
            <FileText size={40} style={{ color: '#999', marginBottom: 12 }} />
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#333' }}>
              Aucune ordonnance trouvée
            </h4>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Vous n'avez pas encore soumis d'ordonnance. Utilisez la zone ci-dessus pour envoyer votre premier fichier.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {prescriptions.map((presc) => (
              <div
                key={presc.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: '#F8F9FA',
                  border: '1px solid #E8E8E8',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: getStatusColor(presc.status) + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={24} style={{ color: getStatusColor(presc.status) }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                        {presc.fileName}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: getStatusColor(presc.status) + '20',
                        color: getStatusColor(presc.status),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        {getStatusIcon(presc.status)}
                        {getStatusLabel(presc.status, presc.status_label)}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                      <span>Date d'envoi : {presc.date}</span>
                      {presc.order_number && (
                        <span> • Commande associé : <strong>#{presc.order_number}</strong></span>
                      )}
                    </div>

                    {presc.comment && (
                      <div style={{ fontSize: 13, color: '#2E7D5B', fontStyle: 'italic', marginTop: 4 }}>
                        💬 Note du pharmacien : {presc.comment}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {presc.fichier && (
                      <a
                        href={`${BACKEND_BASE_URL}/api/prescriptions/${presc.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          border: '1px solid #2E7D5B',
                          background: 'white',
                          color: '#2E7D5B',
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Download size={16} /> Fichier
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div style={{
        marginTop: 28,
        padding: 16,
        borderRadius: 12,
        background: '#F0F9F4',
        border: '1px solid #2E7D5B30',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <AlertCircle size={20} style={{ color: '#2E7D5B' }} />
        <div style={{ fontSize: 13, color: '#2E7D5B', flex: 1 }}>
          <strong>Note de confidentialité :</strong> Vos ordonnances sont transmises de manière sécurisée et traitées en toute confidentialité par les pharmaciens diplômés de la Pharmacie Ben Moussa.
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCenter;
