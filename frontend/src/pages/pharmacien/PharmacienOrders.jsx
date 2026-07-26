import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Package, Search, RefreshCw, Printer,
  ChevronDown, ChevronUp, User, Phone, MapPin,
  Clock, CheckCircle2, TruckIcon, XCircle, AlertCircle
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const STATUS_MAP = {
  pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', label: 'En attente',          icon: <Clock size={14} /> },
  preparing:  { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', label: 'En préparation',      icon: <AlertCircle size={14} /> },
  shipped:    { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6', label: 'Expédiée',            icon: <TruckIcon size={14} /> },
  delivered:  { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', label: 'Livrée',              icon: <CheckCircle2 size={14} /> },
  cancelled:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', label: 'Annulée',             icon: <XCircle size={14} /> },
};

const FILTER_TABS = [
  { key: 'all',       label: 'Toutes' },
  { key: 'pending',   label: 'En attente' },
  { key: 'preparing', label: 'En préparation' },
  { key: 'shipped',   label: 'Expédiées' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

function PrintLabel({ order }) {
  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=500,height=600');
    const orderItemList = order.order_items || order.items || [];
    const items = orderItemList.map(i =>
      `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${i.product?.name || 'Produit'}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${parseFloat(i.price||0).toFixed(2)} MAD</td>
      </tr>`
    ).join('');

    win.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Étiquette commande #${order.order_number || order.id}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1f2937; }
          .header { text-align: center; border-bottom: 3px solid #2ebb80; padding-bottom: 16px; margin-bottom: 16px; }
          .logo { font-size: 1.4rem; font-weight: 800; color: #0d3c26; }
          .order-num { font-size: 2rem; font-weight: 900; color: #2ebb80; margin: 6px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
          .info-block { background: #f9fafb; border-radius: 8px; padding: 12px; }
          .info-label { font-size: 0.7rem; text-transform: uppercase; color: #9ca3af; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.5px; }
          .info-val { font-size: 0.95rem; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.88rem; }
          th { background: #f3f4f6; padding: 8px 10px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #6b7280; }
          .total { text-align: right; font-size: 1.1rem; font-weight: 800; color: #2ebb80; margin-top: 16px; padding-top: 10px; border-top: 2px solid #e5e7eb; }
          .footer { margin-top: 24px; text-align: center; font-size: 0.75rem; color: #9ca3af; border-top: 1px dashed #e5e7eb; padding-top: 12px; }
          @media print { button { display: none !important; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">💊 Pharmacie Ben Moussa</div>
          <div class="order-num">Commande #${order.order_number || order.id}</div>
          <div>Date : ${new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <div class="info-label">👤 Client</div>
            <div class="info-val">${order.user?.name || 'Client'}</div>
            <div style="color:#6b7280;font-size:0.85rem;">${order.phone_number || ''}</div>
          </div>
          <div class="info-block">
            <div class="info-label">📍 Livraison</div>
            <div class="info-val">${order.shipping_address || '—'}</div>
            <div style="color:#6b7280;font-size:0.85rem;">${order.shipping_city || ''} ${order.postal_code || ''}</div>
          </div>
          <div class="info-block">
            <div class="info-label">💳 Paiement</div>
            <div class="info-val">${order.payment_method === 'delivery' ? 'Paiement à la livraison' : order.payment_method || '—'}</div>
          </div>
          <div class="info-block">
            <div class="info-label">📦 Statut</div>
            <div class="info-val">${STATUS_MAP[order.status]?.label || order.status}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th style="text-align:center">Qté</th>
              <th style="text-align:right">Prix unit.</th>
            </tr>
          </thead>
          <tbody>${items}</tbody>
        </table>

        <div class="total">Total : ${parseFloat(order.total_amount || 0).toFixed(2)} MAD</div>

        <div class="footer">
          Parapharmacie Ben Moussa Abbes — Oujda, Maroc<br/>
          Merci pour votre confiance 💚
        </div>

        <br/><button onclick="window.print()" style="display:block;margin:0 auto;padding:10px 24px;background:#2ebb80;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">🖨️ Imprimer</button>
      </body>
      </html>
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
        padding: '7px 14px',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: 'white', border: 'none', borderRadius: '8px',
        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Printer size={14} />
      Étiquette
    </button>
  );
}

export default function PharmacienOrders() {
  const notif = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get('/pharmacien/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch {
      notif.error('Impossible de charger les commandes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [notif]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      (order.order_number || '').toLowerCase().includes(q) ||
      String(order.id).includes(q) ||
      (order.user?.name || '').toLowerCase().includes(q) ||
      (order.shipping_city || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = FILTER_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'all'
      ? orders.length
      : orders.filter(o => o.status === t.key).length;
    return acc;
  }, {});

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid var(--border)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="fade-in">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .order-row { animation: fadeUp 0.3s ease both; }
      `}</style>

      {/* Header */}
      <div style={{
        marginBottom: '28px', padding: '24px 32px',
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderBottom: '4px solid var(--primary)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={28} color="var(--primary)" />
            Toutes les commandes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Commande, client, ville..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 14px 10px 36px', borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)', background: 'var(--bg-subtle)',
                color: 'var(--text)', fontSize: '0.88rem', outline: 'none', width: '220px'
              }}
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', background: 'var(--bg-subtle)', color: 'var(--text-muted)',
              border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)',
              fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '9px 18px', borderRadius: 'var(--radius-full)',
              background: filterStatus === tab.key ? 'var(--primary)' : 'var(--bg-card)',
              color: filterStatus === tab.key ? 'white' : 'var(--text-muted)',
              border: filterStatus === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-light)',
              fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span style={{
                background: filterStatus === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--bg-subtle)',
                color: filterStatus === tab.key ? 'white' : 'var(--text-muted)',
                borderRadius: '99px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 800
              }}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Aucune commande trouvée</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aucune commande ne correspond à vos critères.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOrders.map((order, idx) => {
            const s = STATUS_MAP[order.status] || { bg: 'var(--bg-subtle)', color: 'var(--text-muted)', label: order.status, icon: null };
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="order-row"
                style={{ animationDelay: `${idx * 0.04}s`, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}
              >
                {/* Order header row */}
                <div
                  onClick={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
                  style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Order ID */}
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                      #{order.order_number || order.id}
                    </span>

                    {/* Status badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: s.bg, color: s.color,
                      padding: '4px 12px', borderRadius: '99px',
                      fontSize: '0.78rem', fontWeight: 700
                    }}>
                      {s.icon} {s.label}
                    </span>

                    {/* Client */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <User size={14} /> {order.user?.name || 'Client'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
                      {parseFloat(order.total_amount || 0).toFixed(2)} MAD
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <PrintLabel order={order} />
                    {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-light)', padding: '20px 24px', background: 'var(--bg-subtle)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                          <Phone size={12} style={{ marginRight: '4px' }} />Téléphone
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{order.phone_number || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                          <MapPin size={12} style={{ marginRight: '4px' }} />Adresse
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                          {order.shipping_address || '—'}, {order.shipping_city || ''} {order.postal_code || ''}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                          💳 Paiement
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                          {order.payment_method === 'delivery' ? 'Livraison' : order.payment_method || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                          📅 Date commande
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                          {new Date(order.created_at).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    {/* Items list */}
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '12px' }}>Produits commandés</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(order.order_items || order.items || []).map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', borderRadius: '10px', padding: '10px 14px', border: '1px solid var(--border-light)' }}>
                          {item.product?.image_url && (
                            <img src={item.product.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{item.product?.name || 'Produit'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qté : {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{parseFloat(item.price || 0).toFixed(2)} MAD</div>
                        </div>
                      ))}
                    </div>
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
