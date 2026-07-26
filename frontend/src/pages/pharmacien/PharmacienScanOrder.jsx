import React, { useState } from 'react';
import axios from 'axios';
import { ScanBarcode, AlertCircle, CheckCircle, Package, ArrowRight, ClipboardCheck, User, Search } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function PharmacienScanOrder() {
  const notif = useNotification();
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulation controls
  const [scannedItems, setScannedItems] = useState({});

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');
    setOrder(null);
    setScannedItems({});
    try {
      const res = await axios.post('/pharmacien/scan', { code });
      if (res.data.success) {
        setOrder(res.data.data);
        // Initialize scan progress to 0
        const initialScans = {};
        const items = res.data.data.order_items || res.data.data.items || [];
        items.forEach(item => {
          initialScans[item.id] = 0;
        });
        setScannedItems(initialScans);
        notif.success('Commande chargée avec succès !');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Commande introuvable.');
      notif.error(err.response?.data?.message || 'Commande introuvable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScanItem = (itemId, maxQty) => {
    setScannedItems(prev => {
      const current = prev[itemId] || 0;
      if (current >= maxQty) {
        notif.success('Quantité maximale atteinte pour cet article.');
        return prev;
      }
      const updated = { ...prev, [itemId]: current + 1 };
      notif.success('Article scanné avec succès (+1)');
      return updated;
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    // If wrapping up preparation, verify all items are fully scanned
    const items = order.order_items || order.items || [];
    if (newStatus === 'shipped' || newStatus === 'delivered') {
      let allScanned = true;
      items.forEach(item => {
        if ((scannedItems[item.id] || 0) < item.quantity) {
          allScanned = false;
        }
      });

      if (!allScanned && newStatus === 'shipped') {
        notif.error('Veuillez scanner TOUS les articles avant de marquer la commande comme préparée/expédiée.');
        return;
      }
    }

    try {
      const res = await axios.put(`/pharmacien/prepare/${order.id}`, { status: newStatus });
      if (res.data.success) {
        notif.success(`Statut mis à jour vers: ${newStatus}`);
        setOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      notif.error('Erreur lors de la mise à jour.');
    }
  };

  const getStatusBadgeStyle = (status) => {
    const statusMap = {
      pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: 'En attente' },
      preparing: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: 'En cours de préparation' },
      shipped: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', text: 'Expédiée' },
      delivered: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'Livrée' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', text: 'Annulée' },
    };
    return statusMap[status] || { bg: 'var(--border-light)', color: 'var(--text-muted)', text: status };
  };

  const itemsList = order ? (order.order_items || order.items || []) : [];

  return (
    <div className="fade-in">
      {/* Premium Header Banner */}
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
          <span style={{ fontSize: '2.2rem' }}>🔍</span>
          <span>Scanner / Rechercher Commande</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Recherchez une commande par ID ou scannez son code-barres pour démarrer la vérification.
        </p>
      </div>

      {/* Scanner Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScanBarcode size={18} color="var(--primary)" />
          Saisie du code-barres / Référence
        </h3>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Saisir l'ID commande ou le code de suivi (ex: 1, 2...)"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-subtle)',
                color: 'var(--text)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          <button type="submit" style={{
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '14px 32px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Search size={16} />
            <span>Rechercher</span>
          </button>
        </form>

        {/* Demo Fast-Load Helpers */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Raccourcis démo :</span>
          {[1, 2, 3].map(id => (
            <button
              key={id}
              type="button"
              onClick={() => { setCode(String(id)); setTimeout(() => handleScan(), 50); }}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                color: 'var(--text)',
                fontWeight: 700,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            >
              Commande #{id}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⏳</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '12px' }}>Recherche en cours...</p>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#ef4444',
          background: 'rgba(239, 68, 68, 0.08)',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginBottom: '32px'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 700 }}>{error}</span>
        </div>
      )}

      {order && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Order Header Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '20px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Détails de la Commande</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>
                {order.order_number || `Commande #${order.id}`}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                <span>Client : <strong>{order.user?.name}</strong> | Téléphone : <strong>{order.user?.phone || 'N/A'}</strong></span>
              </p>
            </div>
            <div>
              <span style={{
                background: getStatusBadgeStyle(order.status).bg,
                color: getStatusBadgeStyle(order.status).color,
                padding: '6px 16px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'uppercase'
              }}>
                {getStatusBadgeStyle(order.status).text}
              </span>
            </div>
          </div>

          {/* Items Checklist / Scanner simulation */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={18} color="var(--primary)" />
              <span>Contrôle de Préparation / Scan des articles</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {itemsList.map(item => {
                const scanned = scannedItems[item.id] || 0;
                const isFullyScanned = scanned === item.quantity;
                
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'var(--bg-subtle)',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: isFullyScanned ? '1.5px solid var(--success)' : '1.5px solid var(--border-light)',
                      transition: 'all 0.25s ease',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>
                        {item.product?.name}
                      </div>
                      {item.product?.brand?.name && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Marque : {item.product?.brand?.name}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          color: isFullyScanned ? 'var(--success)' : 'var(--text)'
                        }}>
                          {scanned} / {item.quantity} scannés
                        </span>
                      </div>

                      {order.status === 'preparing' && !isFullyScanned && (
                        <button
                          type="button"
                          onClick={() => handleSimulateScanItem(item.id, item.quantity)}
                          style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          Simuler Scan 🏷️
                        </button>
                      )}

                      {isFullyScanned && (
                        <span style={{ color: 'var(--success)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <CheckCircle size={16} /> Prêt
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons based on Status */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            {order.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('preparing')}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Package size={18} />
                <span>Commencer la préparation</span>
              </button>
            )}

            {order.status === 'preparing' && (
              <button
                onClick={() => handleStatusUpdate('shipped')}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <ScanBarcode size={18} />
                <span>Marquer comme Préparée & Expédiée</span>
              </button>
            )}

            {order.status === 'shipped' && (
              <button
                onClick={() => handleStatusUpdate('delivered')}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <CheckCircle size={18} />
                <span>Confirmer la Livraison finale</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
