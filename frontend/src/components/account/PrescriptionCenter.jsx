import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Eye,
  Trash2
} from 'lucide-react';

const PrescriptionCenter = () => {
  const [dragActive, setDragActive] = useState(false);

  const prescriptions = [
    {
      id: 'RX-2024-001',
      date: '2024-01-15',
      doctor: 'Dr. Benmoussa',
      status: 'approved',
      products: ['Amoxicillin 500mg', 'Ibuprofen 400mg'],
      notes: 'Take with food',
    },
    {
      id: 'RX-2024-002',
      date: '2024-01-18',
      doctor: 'Dr. Alami',
      status: 'pending',
      products: ['Vitamin D3', 'Omega-3'],
      notes: 'Daily supplements',
    },
    {
      id: 'RX-2024-003',
      date: '2024-01-20',
      doctor: 'Dr. Benmoussa',
      status: 'rejected',
      products: ['Prescription medication'],
      notes: 'Requires additional documentation',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#2E7D5B';
      case 'pending': return '#C9A96A';
      case 'rejected': return '#DC2626';
      default: return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
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
    // Handle file upload logic here
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
            Prescription Center
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            Upload and manage your prescriptions
          </p>
        </div>
        <button style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 91, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <Plus size={18} />
          New Prescription
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #2E7D5B' : '2px dashed #E8E8E8',
          borderRadius: 16,
          padding: '48px',
          textAlign: 'center',
          background: dragActive ? '#F0F9F4' : '#F8F9FA',
          transition: 'all 0.3s ease',
          marginBottom: 32,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!dragActive) {
            e.currentTarget.style.borderColor = '#2E7D5B';
            e.currentTarget.style.background = '#F0F9F4';
          }
        }}
        onMouseLeave={(e) => {
          if (!dragActive) {
            e.currentTarget.style.borderColor = '#E8E8E8';
            e.currentTarget.style.background = '#F8F9FA';
          }
        }}
      >
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
          Upload Prescription
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          Drag and drop your prescription file here, or click to browse
        </p>
        <div style={{ fontSize: 12, color: '#999' }}>
          Supported formats: PDF, JPG, PNG (Max 10MB)
        </div>
      </div>

      {/* Prescription History */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>
          Prescription History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {prescriptions.map((prescription, index) => (
            <div
              key={index}
              style={{
                padding: 20,
                borderRadius: 16,
                background: '#F8F9FA',
                border: '1px solid #E8E8E8',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#2E7D5B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F8F9FA';
                e.currentTarget.style.borderColor = '#E8E8E8';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: getStatusColor(prescription.status) + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <FileText size={24} style={{ color: getStatusColor(prescription.status) }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                      {prescription.id}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: getStatusColor(prescription.status) + '20',
                      color: getStatusColor(prescription.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      {getStatusIcon(prescription.status)}
                      {getStatusLabel(prescription.status)}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Doctor:</span> {prescription.doctor} • 
                    <span style={{ fontWeight: 600 }}> Date:</span> {prescription.date}
                  </div>

                  <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Products:</span> {prescription.products.join(', ')}
                  </div>

                  {prescription.notes && (
                    <div style={{ fontSize: 13, color: '#666', fontStyle: 'italic' }}>
                      <span style={{ fontWeight: 600 }}>Notes:</span> {prescription.notes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F6F1EB';
                    e.currentTarget.style.borderColor = '#2E7D5B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#E8E8E8';
                  }}
                  title="View"
                  >
                    <Eye size={18} style={{ color: '#666' }} />
                  </button>
                  
                  <button style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F6F1EB';
                    e.currentTarget.style.borderColor = '#2E7D5B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#E8E8E8';
                  }}
                  title="Download"
                  >
                    <Download size={18} style={{ color: '#666' }} />
                  </button>

                  <button style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: '1px solid #E8E8E8',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEF2F2';
                    e.currentTarget.style.borderColor = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#E8E8E8';
                  }}
                  title="Delete"
                  >
                    <Trash2 size={18} style={{ color: '#DC2626' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        marginTop: 24,
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
          <strong>Privacy Note:</strong> Your prescriptions are securely stored and only accessible by authorized pharmacists.
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCenter;
