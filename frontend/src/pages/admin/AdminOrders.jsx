import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderPaymentStatus, setOrderPaymentStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartUpdateOrder = (order) => {
    setUpdatingOrderId(order.id);
    setOrderStatus(order.status);
    setOrderPaymentStatus(order.payment_status);
  };

  const handleSaveOrderStatus = async (id) => {
    try {
      const res = await axios.put(`/admin/orders/${id}`, {
        status: orderStatus,
        payment_status: orderPaymentStatus,
      });
      if (res.data.success) {
        setUpdatingOrderId(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order status', err);
    }
  };

  const handlePrescriptionDecision = async (orderId, decision) => {
    const label = decision === 'approved' ? 'valider' : 'rejeter';
    if (!window.confirm(`Confirmez-vous vouloir ${label} cette ordonnance ?`)) return;
    try {
      const res = await axios.put(`/admin/orders/${orderId}/prescription`, {
        prescription_status: decision,
      });
      if (res.data.success) fetchOrders();
    } catch (err) {
      console.error('Error updating prescription status', err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour de l'ordonnance.");
    }
  };

  const handleViewPrescription = async (orderId) => {
    try {
      const res = await axios.get(`/orders/${orderId}/prescription`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error fetching prescription file', err);
      alert("Impossible d'ouvrir l'ordonnance.");
    }
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des commandes...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ 
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>📦</span>
            <span>Gestion des Commandes</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Suivez et traitez toutes les commandes de vos clients
          </p>
        </div>
      </div>

      <div style={{ 
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ 
              background: 'var(--bg-subtle)',
              borderBottom: '2px solid var(--primary)'
            }}>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>N° Commande</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Client & Contact</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Adresse & Ville</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Montant & Articles</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Mode de Paiement</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Ordonnance</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Statut</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr 
                  key={o.id}
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{o.order_number}</strong>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{o.user?.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>📞 {o.phone_number}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '0.85rem' }}>{o.shipping_address}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>📍 {o.shipping_city} ({o.postal_code})</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div><strong style={{ fontSize: '1rem', color: 'var(--text)' }}>{parseFloat(o.total_amount).toFixed(2)} MAD</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.items?.map(it => `${it.product?.name} x${it.quantity}`).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)'
                    }}>
                      {o.payment_method === 'delivery' ? '💵 À la livraison' : o.payment_method === 'card' ? '💳 Carte bancaire' : '🏪 Retrait pharmacie'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {o.prescription_path ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                        <button
                          onClick={() => handleViewPrescription(o.id)}
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--primary)',
                            background: 'var(--bg-card)',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--primary)';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-card)';
                            e.target.style.color = 'var(--primary)';
                          }}
                        >
                          📄 Voir
                        </button>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: o.prescription_status === 'approved' ? 'var(--success-light)' :
                                     o.prescription_status === 'rejected' ? 'var(--danger-light)' : 'hsl(38, 80%, 92%)',
                          color: o.prescription_status === 'approved' ? 'var(--success)' :
                                 o.prescription_status === 'rejected' ? 'var(--danger)' : 'hsl(38, 80%, 40%)'
                        }}>
                          {o.prescription_status === 'approved' ? '✅ Validée' :
                           o.prescription_status === 'rejected' ? '❌ Rejetée' : '⏳ En attente'}
                        </span>
                        {o.prescription_status === 'pending' && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <button 
                              onClick={() => handlePrescriptionDecision(o.id, 'approved')} 
                              style={{ 
                                padding: '4px 10px', 
                                fontSize: '0.75rem', 
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--success)',
                                background: 'var(--bg-card)',
                                color: 'var(--success)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'var(--success)';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-card)';
                                e.target.style.color = 'var(--success)';
                              }}
                            >✅</button>
                            <button 
                              onClick={() => handlePrescriptionDecision(o.id, 'rejected')} 
                              style={{ 
                                padding: '4px 10px', 
                                fontSize: '0.75rem', 
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--danger)',
                                background: 'var(--bg-card)',
                                color: 'var(--danger)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'var(--danger)';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-card)';
                                e.target.style.color = 'var(--danger)';
                              }}
                            >❌</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {updatingOrderId === o.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <select 
                          value={orderStatus} 
                          onChange={(e) => setOrderStatus(e.target.value)} 
                          className="form-control" 
                          style={{ 
                            padding: '8px 12px', 
                            fontSize: '0.85rem', 
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid var(--border)'
                          }}
                        >
                          <option value="pending">⏳ En attente</option>
                          <option value="preparing">🔄 En préparation</option>
                          <option value="shipped">🚚 Expédiée</option>
                          <option value="delivered">✅ Livrée</option>
                          <option value="cancelled">❌ Annulée</option>
                        </select>
                        <select 
                          value={orderPaymentStatus} 
                          onChange={(e) => setOrderPaymentStatus(e.target.value)} 
                          className="form-control" 
                          style={{ 
                            padding: '8px 12px', 
                            fontSize: '0.85rem', 
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid var(--border)'
                          }}
                        >
                          <option value="pending">⏳ Non Payé</option>
                          <option value="paid">✅ Payé</option>
                          <option value="failed">❌ Échoué</option>
                        </select>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: (o.status === 'completed' || o.status === 'delivered') ? 'var(--success-light)' :
                                     (o.status === 'shipped') ? 'rgba(59,130,246,0.15)' :
                                     (o.status === 'preparing' || o.status === 'processing') ? 'hsl(38, 80%, 92%)' :
                                     (o.status === 'pending') ? 'hsl(38, 80%, 92%)' : 'var(--danger-light)',
                          color: (o.status === 'completed' || o.status === 'delivered') ? 'var(--success)' :
                                 (o.status === 'shipped') ? '#2563eb' :
                                 (o.status === 'preparing' || o.status === 'processing') ? 'hsl(38, 80%, 40%)' :
                                 (o.status === 'pending') ? 'hsl(38, 80%, 40%)' : 'var(--danger)'
                        }}>
                          {(o.status === 'completed' || o.status === 'delivered') ? '✅ Livrée' :
                           (o.status === 'shipped') ? '🚚 Expédiée' :
                           (o.status === 'preparing' || o.status === 'processing') ? '🔄 En préparation' :
                           (o.status === 'pending') ? '⏳ En attente' : '❌ Annulée'}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: o.payment_status === 'paid' ? 'var(--success-light)' : 'var(--danger-light)',
                          color: o.payment_status === 'paid' ? 'var(--success)' : 'var(--danger)',
                          opacity: 0.9
                        }}>
                          {o.payment_status === 'paid' ? '✅ Payé' : '❌ Non payé'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {updatingOrderId === o.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleSaveOrderStatus(o.id)} 
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.8rem', 
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--primary), #45a049)',
                            color: 'white',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                          }}
                        >Sauver ✅</button>
                        <button 
                          onClick={() => setUpdatingOrderId(null)} 
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.8rem', 
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--border)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-muted)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = 'var(--danger)';
                            e.target.style.color = 'var(--danger)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = 'var(--border)';
                            e.target.style.color = 'var(--text-muted)';
                          }}
                        >Annuler ❌</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStartUpdateOrder(o)} 
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '0.8rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--primary)',
                          background: 'var(--bg-card)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--primary)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--bg-card)';
                          e.target.style.color = 'var(--primary)';
                        }}
                      >Statut ⚙️</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ 
                  padding: '80px 40px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>📦</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Aucune commande enregistrée</div>
                  <div style={{ fontSize: '0.9rem' }}>Les nouvelles commandes apparaîtront ici</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
