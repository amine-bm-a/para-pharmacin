import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ArrowRight, Clock, CheckCircle2,
  User, ChevronDown, ChevronUp, AlertCircle,
  ShoppingBag, CheckSquare, Square, Search, Printer
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

function PrintLabel({ order }) {
  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=500,height=600');
    const items = (order.order_items || order.items || []).map(i =>
      `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${i.product?.name || 'Produit'}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${parseFloat(i.price||0).toFixed(2)} MAD</td>
      </tr>`
    ).join('');

    win.document.write(`
      <!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
      <title>Étiquette #${order.order_number || order.id}</title>
      <style>
        body { font-family:'Segoe UI',sans-serif; padding:24px; color:#1f2937; }
        .header { text-align:center; border-bottom:3px solid #2ebb80; padding-bottom:16px; margin-bottom:16px; }
        .logo { font-size:1.4rem; font-weight:800; color:#0d3c26; }
        .order-num { font-size:2rem; font-weight:900; color:#2ebb80; margin:6px 0; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
        .info-block { background:#f9fafb; border-radius:8px; padding:12px; }
        .info-label { font-size:0.7rem; text-transform:uppercase; color:#9ca3af; font-weight:700; margin-bottom:4px; }
        .info-val { font-size:0.95rem; font-weight:600; }
        table { width:100%; border-collapse:collapse; font-size:0.88rem; }
        th { background:#f3f4f6; padding:8px 10px; text-align:left; font-size:0.75rem; text-transform:uppercase; color:#6b7280; }
        .total { text-align:right; font-size:1.1rem; font-weight:800; color:#2ebb80; margin-top:16px; padding-top:10px; border-top:2px solid #e5e7eb; }
        .footer { margin-top:24px; text-align:center; font-size:0.75rem; color:#9ca3af; border-top:1px dashed #e5e7eb; padding-top:12px; }
        @media print { button { display:none !important; } }
      </style></head><body>
      <div class="header">
        <div class="logo">💊 Pharmacie Ben Moussa</div>
        <div class="order-num">Commande #${order.order_number || order.id}</div>
        <div>Date : ${new Date(order.created_at).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})}</div>
      </div>
      <div class="info-grid">
        <div class="info-block"><div class="info-label">👤 Client</div><div class="info-val">${order.user?.name||'Client'}</div><div style="color:#6b7280;font-size:0.85rem;">${order.phone_number||''}</div></div>
        <div class="info-block"><div class="info-label">📍 Livraison</div><div class="info-val">${order.shipping_address||'—'}</div><div style="color:#6b7280;font-size:0.85rem;">${order.shipping_city||''} ${order.postal_code||''}</div></div>
        <div class="info-block"><div class="info-label">💳 Paiement</div><div class="info-val">${order.payment_method==='delivery'?'Livraison':order.payment_method||'—'}</div></div>
        <div class="info-block"><div class="info-label">📦 Statut</div><div class="info-val">${order.status}</div></div>
      </div>
      <table><thead><tr><th>Produit</th><th style="text-align:center">Qté</th><th style="text-align:right">Prix</th></tr></thead><tbody>${items}</tbody></table>
      <div class="total">Total : ${parseFloat(order.total_amount||0).toFixed(2)} MAD</div>
      <div class="footer">Parapharmacie Ben Moussa Abbes — Oujda, Maroc<br/>Merci pour votre confiance 💚</div>
      <br/><button onclick="window.print()" style="display:block;margin:0 auto;padding:10px 24px;background:#2ebb80;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">🖨️ Imprimer</button>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  return (
    <button
      onClick={e => { e.stopPropagation(); handlePrint(); }}
      title="Imprimer l'étiquette"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: 'white', border: 'none', borderRadius: '8px',
        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(99,102,241,0.3)', transition: 'all 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Printer size={14} /> Étiquette
    </button>
  );
}

export default function PharmacienPrepareOrder() {
  const notif = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for checking items during manual prep
  const [checkedItems, setCheckedItems] = useState({});

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('/pharmacien/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (e) {
      console.error(e);
      notif.error('Erreur lors de la récupération des commandes.');
    } finally {
      setLoading(false);
    }
  }, [notif]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStartPreparing = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await axios.put(`/pharmacien/prepare/${id}`, { status: 'preparing' });
      if (res.data.success) {
        notif.success('Préparation commencée !');
        fetchOrders();
        setExpandedOrderId(id); // auto-expand to show checklist
      }
    } catch (e) {
      notif.error('Erreur lors du changement de statut.');
    }
  };

  const handleMarkShipped = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await axios.put(`/pharmacien/prepare/${id}`, { status: 'shipped' });
      if (res.data.success) {
        notif.success('Commande marquée comme préparée et expédiée !');
        fetchOrders();
      }
    } catch (e) {
      notif.error('Erreur de mise à jour.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const toggleItemCheck = (orderId, itemId, e) => {
    if (e) e.stopPropagation();
    setCheckedItems(prev => {
      const orderChecks = prev[orderId] || {};
      const updated = {
        ...prev,
        [orderId]: {
          ...orderChecks,
          [itemId]: !orderChecks[itemId]
        }
      };
      return updated;
    });
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

  // Filters and search logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    const clientName = order.user?.name || '';
    const orderNum = order.order_number || '';
    const orderIdStr = String(order.id);
    const query = searchQuery.toLowerCase();

    const matchesSearch = clientName.toLowerCase().includes(query) ||
                          orderNum.toLowerCase().includes(query) ||
                          orderIdStr.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fade-in">
      {/* Premium Welcome/Title Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
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
            <span style={{ fontSize: '2.2rem' }}>📋</span>
            <span>Préparation des commandes</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Gérez, vérifiez et préparez les commandes clients en cours.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher par commande, client..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-light)',
              background: 'var(--bg-subtle)',
              color: 'var(--text)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {[
          { key: 'all', label: 'Toutes les commandes' },
          { key: 'pending', label: 'En attente' },
          { key: 'preparing', label: 'En préparation' },
          { key: 'shipped', label: 'Expédiées' },
          { key: 'delivered', label: 'Livrées' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              background: filterStatus === tab.key ? 'var(--primary)' : 'var(--bg-card)',
              color: filterStatus === tab.key ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: filterStatus === tab.key ? '0 4px 12px rgba(76, 175, 80, 0.2)' : '0 2px 8px rgba(0,0,0,0.03)',
              border: filterStatus === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-light)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '120px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⏳</div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des commandes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          padding: '80px 40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)'
        }}>
          <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Aucune commande trouvée</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Aucune commande ne correspond à vos filtres ou critères de recherche.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const isPending = order.status === 'pending';
            const isPreparing = order.status === 'preparing';
            const badge = getStatusBadgeStyle(order.status);
            
            const orderChecks = checkedItems[order.id] || {};
            const itemsList = order.order_items || [];
            const allItemsChecked = itemsList.length > 0 && itemsList.every(item => orderChecks[item.id]);

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isExpanded ? '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    padding: '22px 28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--bg-subtle)' : 'transparent',
                    transition: 'background 0.2s',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: isPreparing ? 'rgba(59, 130, 246, 0.1)' : isPending ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPreparing ? '#3b82f6' : isPending ? '#f59e0b' : '#10b981',
                      flexShrink: 0
                    }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                          #{order.order_number || `Commande ${order.id}`}
                        </h4>
                        <span style={{
                          background: badge.bg,
                          color: badge.color,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {badge.text}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} />
                        <span><strong>{order.user?.name || 'Anonyme'}</strong> ({order.user?.email || 'N/A'})</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem', marginRight: '10px' }}>
                      {parseFloat(order.total_amount).toFixed(2)} MAD
                    </span>

                    {isPending && (
                      <button
                        onClick={(e) => handleStartPreparing(order.id, e)}
                        style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'transform 0.2s',
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>Préparer</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={(e) => handleMarkShipped(order.id, e)}
                        disabled={!allItemsChecked}
                        style={{
                          background: allItemsChecked ? '#3b82f6' : 'var(--border)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: allItemsChecked ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                          boxShadow: allItemsChecked ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                        }}
                        onMouseEnter={e => { if (allItemsChecked) e.currentTarget.style.transform = 'scale(1.03)'; }}
                        onMouseLeave={e => { if (allItemsChecked) e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Expédier</span>
                      </button>
                    )}

                    {/* Print label button */}
                    <PrintLabel order={order} />

                    <button
                      onClick={() => toggleExpand(order.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div style={{
                    padding: '24px 28px',
                    borderTop: '1px solid var(--border-light)',
                    background: 'var(--bg-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                        📋 Liste des articles à emballer :
                      </h5>
                      {isPreparing && (
                        <span style={{ fontSize: '0.8rem', color: allItemsChecked ? 'var(--success)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {allItemsChecked ? '✓ Prêt à expédier !' : 'Cochez chaque produit pour valider'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {itemsList.map(item => {
                        const isChecked = orderChecks[item.id] || false;
                        return (
                          <div
                            key={item.id}
                            onClick={(e) => isPreparing && toggleItemCheck(order.id, item.id, e)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'var(--bg-card)',
                              padding: '14px 20px',
                              borderRadius: '10px',
                              border: isChecked ? '1.5px solid var(--success)' : '1px solid var(--border-light)',
                              cursor: isPreparing ? 'pointer' : 'default',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {isPreparing && (
                                <div style={{ color: isChecked ? 'var(--success)' : 'var(--text-muted)' }}>
                                  {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                                </div>
                              )}
                              <div>
                                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem', textDecoration: isChecked ? 'line-through opacity 0.6' : 'none' }}>
                                  {item.product?.name}
                                </span>
                                {item.product?.brand?.name && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    Marque : {item.product?.brand?.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span style={{
                              background: 'var(--bg-subtle)',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              color: 'var(--text-muted)',
                              fontSize: '0.85rem',
                              fontWeight: 700
                            }}>
                              Quantité : {item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {isPreparing && !allItemsChecked && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.08)',
                        padding: '12px 18px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <AlertCircle size={16} />
                        <span>Veuillez vérifier et cocher chaque produit avant d'expédier cette commande.</span>
                      </div>
                    )}

                    {!isPreparing && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <AlertCircle size={16} />
                        <span>
                          Astuce : Utilisez la page <strong>Scanner Commande</strong> pour scanner et valider l'exactitude des produits avec le code-barres.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
