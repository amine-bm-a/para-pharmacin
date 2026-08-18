import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Clock, Package, AlertTriangle, CheckCircle,
  ShoppingBag, ClipboardCheck, ScanBarcode, ArrowRight,
  FileText, Pill, Loader2, CalendarDays, TrendingUp
} from 'lucide-react';

export default function PharmacienDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending_preparation: 0,
    preparing: 0,
    low_stock: 0,
    pending_prescriptions: 0,
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/pharmacien/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{
      textAlign: 'center',
      padding: '120px 40px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement du tableau de bord...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const kpiCards = [
    {
      label: 'À préparer',
      value: stats.pending_preparation,
      icon: <Clock size={22} />,
      accent: 'var(--status-warning)',
      accentBg: 'var(--status-warning-bg)',
      trend: 'Commandes en attente',
      link: '/pharmacien/prepare'
    },
    {
      label: 'En préparation',
      value: stats.preparing,
      icon: <ClipboardCheck size={22} />,
      accent: 'var(--status-info)',
      accentBg: 'var(--status-info-bg)',
      trend: 'Commandes actives',
      link: '/pharmacien/prepare'
    },
    {
      label: 'Ordonnances',
      value: stats.pending_prescriptions,
      icon: <FileText size={22} />,
      accent: 'var(--status-purple)',
      accentBg: 'var(--status-purple-bg)',
      trend: 'Attente de validation',
      link: '/pharmacien/prescriptions'
    },
    {
      label: 'Stock faible',
      value: stats.low_stock,
      icon: <AlertTriangle size={22} />,
      accent: 'var(--status-danger)',
      accentBg: 'var(--status-danger-bg)',
      trend: 'Produits à réapprovisionner',
      link: '/pharmacien/stock'
    },
    {
      label: 'Commandes traitées',
      value: stats.recent_orders?.filter(o => o.status === 'completed').length || 0,
      icon: <CheckCircle size={22} />,
      accent: 'var(--status-success)',
      accentBg: 'var(--status-success-bg)',
      trend: 'Commandes complétées',
      link: '/pharmacien/prepare'
    },
  ];

  const getStatusStyle = (status) => {
    const map = {
      pending:    { bg: 'var(--status-warning-bg)',  color: 'var(--status-warning)',  label: 'En attente' },
      preparing:  { bg: 'var(--status-info-bg)',     color: 'var(--status-info)',     label: 'En préparation' },
      completed:  { bg: 'var(--status-success-bg)',  color: 'var(--status-success)',  label: 'Complétée' },
      cancelled:  { bg: 'var(--status-danger-bg)',   color: 'var(--status-danger)',   label: 'Annulée' },
      shipped:    { bg: 'var(--status-purple-bg)',   color: 'var(--status-purple)',   label: 'Expédiée' },
    };
    return map[status] || { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', label: status };
  };

  return (
    <div className="fade-in">

      {/* Welcome Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
            <Pill size={28} color="var(--primary)" />
            <span>Tableau de bord</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Bienvenue, <strong>{user?.name}</strong> ! Voici un aperçu de votre espace pharmacien.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          <CalendarDays size={16} color="var(--primary)" />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* KPI Cards — flat design */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpiCards.map((card, idx) => (
          <Link key={idx} to={card.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.25s ease',
              border: `1px solid var(--border-light)`,
              borderLeft: `4px solid ${card.accent}`,
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: 'var(--radius-sm)',
                background: card.accentBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.accent, flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: '4px' }}>{card.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{card.trend}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        marginBottom: '32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid var(--border-light)'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} color="var(--primary)" />
          Actions Rapides
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { to: '/pharmacien/prepare',       icon: <ClipboardCheck size={17} />, label: 'Préparer commandes',  color: 'var(--status-info)' },
            { to: '/pharmacien/prescriptions', icon: <FileText size={17} />,       label: 'Valider ordonnances', color: 'var(--status-purple)' },
            { to: '/pharmacien/scan',          icon: <ScanBarcode size={17} />,    label: 'Scanner un colis',    color: 'var(--primary)' },
            { to: '/pharmacien/stock',         icon: <Package size={17} />,        label: 'Gérer le stock',      color: 'var(--status-warning)' },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px',
                background: 'var(--bg-subtle)',
                border: `1.5px solid var(--border-light)`,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: action.color,
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.background = 'var(--bg-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {action.icon}
              {action.label}
              <ArrowRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders — section "Commandes urgentes" en premier si pending */}
      {stats.recent_orders.some(o => o.status === 'pending') && (
        <div style={{
          marginBottom: '24px',
          padding: '16px 24px',
          background: 'var(--status-warning-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--status-warning-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Clock size={18} color="var(--status-warning)" />
          <span style={{ fontWeight: 700, color: 'var(--status-warning)', fontSize: '0.9rem' }}>
            {stats.recent_orders.filter(o => o.status === 'pending').length} commande(s) en attente de préparation
          </span>
          <Link to="/pharmacien/prepare" style={{ marginLeft: 'auto', color: 'var(--status-warning)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Traiter maintenant <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardCheck size={18} color="var(--primary)" />
            Commandes Récentes
          </h3>
          <Link
            to="/pharmacien/orders"
            style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Voir toutes <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recent_orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Aucune commande récente.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                {['Commande #', 'Client', 'Total', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.map(order => {
                const s = getStatusStyle(order.status);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary)' }}>
                      #{order.id}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)' }}>
                      {order.user?.name || 'Anonyme'}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text)' }}>
                      {parseFloat(order.total_amount || order.total || 0).toFixed(2)} MAD
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        background: s.bg, color: s.color,
                        padding: '4px 12px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem', fontWeight: 700,
                        display: 'inline-block'
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
