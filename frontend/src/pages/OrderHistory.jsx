import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Details Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsError, setDetailsError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders list:", err);
      setError("Impossible de charger votre historique de commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = async (orderId) => {
    // Open modal placeholder and fetch full details
    setSelectedOrder({ id: orderId, loading: true });
    setDetailsError('');
    try {
      const res = await axios.get(`/orders/${orderId}`);
      if (res.data.success) {
        setSelectedOrder(res.data.order);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setDetailsError("Impossible de charger les détails de cette commande.");
      setSelectedOrder(null);
    } finally {
      // no-op: loading state is tracked via selectedOrder.loading
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleDownloadPrescription = async (orderId, orderNumber, path) => {
    try {
      const response = await axios.get(`/orders/${orderId}/prescription`, {
        responseType: 'blob'
      });
      
      // Extract file extension
      let ext = 'pdf';
      if (path) {
        const parts = path.split('.');
        if (parts.length > 1) {
          ext = parts[parts.length - 1].toLowerCase();
        }
      }
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordonnance_${orderNumber}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading prescription", err);
      alert("Erreur lors du téléchargement de l'ordonnance. Veuillez réessayer.");
    }
  };

  // Helper translations and colors

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Livrée';
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };


  const getPaymentStatusLabel = (status) => {
    return status === 'paid' ? 'Payé' : 'En attente';
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'delivery': return 'Paiement à la livraison';
      case 'card': return 'Carte bancaire';
      case 'pickup': return 'Retrait en pharmacie';
      default: return method;
    }
  };

  return (
    <div className="container fade-in" style={{ marginTop: '24px', marginBottom: '48px' }}>
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
        <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏠</span> Accueil
        </Link> 
        <span style={{ color: 'var(--border)' }}>/</span> 
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Mes commandes</span>
      </div>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 800, 
        marginBottom: '24px',
        background: 'linear-gradient(135deg, var(--primary), #45a049)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Historique de vos commandes
      </h1>

      {loading ? (
        <div style={{ 
          padding: '60px', 
          textAlign: 'center',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement de vos commandes...</p>
        </div>
      ) : error ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          color: 'var(--danger)',
          fontWeight: 500
        }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ 
          padding: '80px 40px', 
          border: '2px dashed var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          background: 'var(--bg-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>Aucune commande passée</h2>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px', lineHeight: 1.5 }}>
            Vous n'avez pas encore passé de commande sur notre boutique en ligne.
          </p>
          <Link 
            to="/products" 
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              textDecoration: 'none',
              display: 'inline-block'
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
            Parcourir notre catalogue
          </Link>
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>N° Commande</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Total</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Statut</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Paiement</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    style={{ 
                      borderBottom: index < orders.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                      {order.order_number}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text)', fontSize: '0.9rem' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
                      {parseFloat(order.total_amount).toFixed(2)} MAD
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: order.status === 'completed' ? 'var(--success-light)' : order.status === 'pending' || order.status === 'processing' ? 'var(--warning-light)' : 'var(--danger-light)',
                        color: order.status === 'completed' ? 'var(--success)' : order.status === 'pending' || order.status === 'processing' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: order.payment_status === 'paid' ? 'var(--success-light)' : 'var(--warning-light)',
                        color: order.payment_status === 'paid' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => handleOpenDetails(order.id)} 
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--primary)',
                          background: 'white',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, var(--primary), #45a049)';
                          e.target.style.color = 'white';
                          e.target.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = 'var(--primary)';
                          e.target.style.borderColor = 'var(--primary)';
                        }}
                      >
                        Détails 🔎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '16px'
          }}
          onClick={handleCloseDetails}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              padding: '32px',
              position: 'relative',
              border: '1px solid var(--border-light)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={handleCloseDetails}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-subtle)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--danger-light)';
                e.target.style.color = 'var(--danger)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--bg-subtle)';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              ✕
            </button>

            {selectedOrder.loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des détails de la commande...</p>
              </div>
            ) : detailsError ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--danger)', fontWeight: 500 }}>{detailsError}</div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text)' }}>
                  Commande {selectedOrder.order_number}
                </h2>

                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ marginBottom: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>📍 Adresse de livraison</h4>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Adresse :</strong> {selectedOrder.shipping_address}</p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Ville :</strong> {selectedOrder.shipping_city}</p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Code postal :</strong> {selectedOrder.postal_code}</p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Téléphone :</strong> {selectedOrder.phone_number}</p>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ marginBottom: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>💳 Paiement & Statut</h4>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}><strong>Méthode :</strong> {getPaymentMethodLabel(selectedOrder.payment_method)}</p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <strong>Statut paiement :</strong> 
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginLeft: '8px',
                        background: selectedOrder.payment_status === 'paid' ? 'var(--success-light)' : 'var(--warning-light)',
                        color: selectedOrder.payment_status === 'paid' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {getPaymentStatusLabel(selectedOrder.payment_status)}
                      </span>
                    </p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <strong>Statut commande :</strong> 
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginLeft: '8px',
                        background: selectedOrder.status === 'completed' ? 'var(--success-light)' : selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? 'var(--warning-light)' : 'var(--danger-light)',
                        color: selectedOrder.status === 'completed' ? 'var(--success)' : selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <strong>Date :</strong> {new Date(selectedOrder.created_at).toLocaleString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Prescription Info if present */}
                {selectedOrder.prescription_path && (
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-light), white)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      marginBottom: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.15)'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>📄 Ordonnance médicale jointe</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
                        Statut de vérification : <strong style={{ 
                          color: selectedOrder.prescription_status === 'approved' ? 'var(--success)' : selectedOrder.prescription_status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
                        }}>
                          {selectedOrder.prescription_status === 'approved' ? 'Validée par le pharmacien' : selectedOrder.prescription_status === 'rejected' ? 'Refusée' : 'En attente de vérification'}
                        </strong>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDownloadPrescription(selectedOrder.id, selectedOrder.order_number, selectedOrder.prescription_path)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary)',
                        background: 'white',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, var(--primary), #45a049)';
                        e.target.style.color = 'white';
                        e.target.style.borderColor = 'transparent';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = 'var(--primary)';
                        e.target.style.borderColor = 'var(--primary)';
                      }}
                    >
                      Télécharger l'ordonnance 📥
                    </button>
                  </div>
                )}

                {/* Order Items Table */}
                <h4 style={{ marginBottom: '16px', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>📦 Articles commandés</h4>
                <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                        <th style={{ padding: '14px', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Produit</th>
                        <th style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Prix Unitaire</th>
                        <th style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Quantité</th>
                        <th style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr 
                          key={item.id} 
                          style={{ 
                            borderBottom: index < selectedOrder.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-subtle)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img 
                                src={item.product?.image_url} 
                                alt={item.product?.name} 
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} 
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80';
                                }}
                              />
                              <div>
                                <span style={{ fontWeight: 700, display: 'block', color: 'var(--text)', fontSize: '0.9rem' }}>{item.product?.name || 'Produit inconnu'}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.product?.brand}</span>
                                {(() => {
                                  const itemPrescription = selectedOrder.prescriptions?.find(p => p.product_id === item.product_id);
                                  if (itemPrescription) {
                                    return (
                                      <div style={{ marginTop: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontWeight: 600, color: itemPrescription.statut === 'approved' ? 'var(--success)' : itemPrescription.statut === 'rejected' ? 'var(--danger)' : '#f59e0b' }}>
                                          Ordonnance : {itemPrescription.statut === 'approved' ? '✓ Validée' : itemPrescription.statut === 'rejected' ? '✕ Refusée' : '⏳ En attente de validation'}
                                        </span>
                                        {itemPrescription.commentaire_pharmacien && (
                                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                            Motif : "{itemPrescription.commentaire_pharmacien}"
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right', color: 'var(--text)', fontWeight: 500 }}>
                            {parseFloat(item.price).toFixed(2)} MAD
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center', color: 'var(--text)', fontWeight: 500 }}>
                            {item.quantity}
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                            {(item.price * item.quantity).toFixed(2)} MAD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '1.3rem', 
                  fontWeight: 800, 
                  color: 'var(--primary)',
                  padding: '20px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <span>Total de la commande :</span>
                  <span>{parseFloat(selectedOrder.total_amount).toFixed(2)} MAD</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
