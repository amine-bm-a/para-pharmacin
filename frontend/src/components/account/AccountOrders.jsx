import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Loader2 } from 'lucide-react';

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/orders');
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      setError("Impossible de charger vos commandes.");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (orderId) => {
    setDetailsLoading(true);
    try {
      const res = await axios.get(`/orders/${orderId}`);
      if (res.data.success) setSelectedOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered': return { bg: 'var(--status-success-bg)', color: 'var(--status-success)', label: 'Livrée' };
      case 'shipped': return { bg: 'var(--status-purple-bg)', color: 'var(--status-purple)', label: 'Expédiée' };
      case 'preparing':
      case 'processing': return { bg: 'var(--status-info-bg)', color: 'var(--status-info)', label: 'En cours de préparation' };
      case 'pending': return { bg: 'var(--status-warning-bg)', color: 'var(--status-warning)', label: 'En attente' };
      case 'cancelled': return { bg: 'var(--status-danger-bg)', color: 'var(--status-danger)', label: 'Annulée' };
      default: return { bg: 'var(--bg-subtle)', color: 'var(--text-muted)', label: status };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Package size={28} color="var(--primary)" />
          <span>Mes Commandes</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Suivez l'état de vos commandes et consultez votre historique d'achats
        </p>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          color: 'var(--text-muted)'
        }}>
          <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>Chargement de vos commandes...</p>
        </div>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          color: 'var(--danger)',
          fontWeight: 600,
          fontSize: '1rem'
        }}>{error}</div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>📦</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Aucune commande</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
            Vous n'avez pas encore passé de commande sur notre boutique.
          </p>
          <Link 
            to="/products" 
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
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
            🛍️ Découvrir nos produits
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.map((order) => {
            const status = getStatusStyle(order.status);
            return (
              <div key={order.id} style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => openDetails(order.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
              >
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 28px',
                  borderBottom: '2px solid var(--primary)',
                  background: 'var(--bg-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}>
                      📦
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                        {order.order_number}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      padding: '5px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: status.bg,
                      color: status.color,
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      {status.label}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', fontFamily: 'var(--font-title)' }}>
                        {parseFloat(order.total_amount).toFixed(2)} MAD
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== ORDER DETAILS MODAL ===== */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)', position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '2px solid var(--primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                📦 Commande {selectedOrder.order_number}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--border-light)', border: 'none',
                  fontSize: '1rem', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px 32px' }}>
              {detailsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chargement...</div>
              ) : (
                <>
                  {/* Shipping & Payment Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                    <div style={{ 
                      padding: '20px', 
                      background: 'var(--bg-subtle)', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: 800 }}>📍 Livraison</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{selectedOrder.shipping_address}</p>
                      <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{selectedOrder.shipping_city} {selectedOrder.postal_code}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📞 {selectedOrder.phone_number}</p>
                    </div>
                    <div style={{ 
                      padding: '20px', 
                      background: 'var(--bg-subtle)', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: 800 }}>💳 Paiement</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                        {selectedOrder.payment_method === 'delivery' ? 'Paiement à la livraison' : selectedOrder.payment_method === 'card' ? 'Carte bancaire' : selectedOrder.payment_method}
                      </p>
                      <p style={{ fontSize: '0.9rem' }}>
                        Statut : <strong style={{ color: selectedOrder.payment_status === 'paid' ? 'var(--success)' : 'hsl(38, 80%, 40%)' }}>
                          {selectedOrder.payment_status === 'paid' ? 'Payé' : 'En attente'}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Articles commandés</h4>
                  <div style={{ 
                    border: '2px solid var(--border-light)', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden', 
                    marginBottom: '24px',
                    background: 'var(--bg-subtle)'
                  }}>
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--border-light)' : 'none'
                      }}>
                        <img
                          src={item.product?.image_url}
                          alt={item.product?.name}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&q=80'; }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.product?.name || 'Produit'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Qté : {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {(item.price * item.quantity).toFixed(2)} MAD
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '12px',
                    borderTop: '2px solid var(--primary)',
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 28px'
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total :</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
                      {parseFloat(selectedOrder.total_amount).toFixed(2)} MAD
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
