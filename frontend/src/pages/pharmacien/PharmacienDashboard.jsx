import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Clock, Package, AlertTriangle, CheckCircle,
  ShoppingBag, ClipboardCheck, ScanBarcode, ArrowRight, FileText
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
      <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement du tableau de bord...</p>
    </div>
  );

  const kpiCards = [
    {
      label: 'À préparer',
      value: stats.pending_preparation,
      icon: <Clock size={24} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      trend: 'Commandes en attente',
      link: '/pharmacien/prepare'
    },
    {
      label: 'En préparation',
      value: stats.preparing,
      icon: <ClipboardCheck size={24} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      trend: 'Commandes actives',
      link: '/pharmacien/prepare'
    },
    {
      label: 'Ordonnances',
      value: stats.pending_prescriptions,
      icon: <FileText size={24} />,
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
      trend: 'Attente de validation',
      link: '/pharmacien/prescriptions'
    },
    {
      label: 'Stock faible',
      value: stats.low_stock,
      icon: <AlertTriangle size={24} />,
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      trend: 'Produits à réapprovisionner',
      link: '/pharmacien/stock'
    },
    {
      label: 'Commandes traitées',
      value: stats.recent_orders?.filter(o => o.status === 'completed').length || 0,
      icon: <CheckCircle size={24} />,
      gradient: 'linear-gradient(135deg, #2ebb80, #16a085)',
      trend: 'Commandes complétées',
      link: '/pharmacien/prepare'
    },
  ];

  const getStatusStyle = (status) => {
    const map = {
      pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b',  label: 'En attente' },
      preparing:  { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6',  label: 'En préparation' },
      completed:  { bg: 'rgba(46,187,128,0.1)',   color: '#2ebb80',  label: 'Complétée' },
      cancelled:  { bg: 'rgba(239,68,68,0.1)',    color: '#ef4444',  label: 'Annulée' },
      shipped:    { bg: 'rgba(139,92,246,0.1)',   color: '#8b5cf6',  label: 'Expédiée' },
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
            <span style={{ fontSize: '2.2rem' }}>💊</span>
            <span>Tableau de bord</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Bienvenue, <strong>{user?.name}</strong> ! Voici un aperçu de votre espace pharmacien.
          </p>
        </div>
        <div style={{
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {kpiCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.3s ease',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                background: card.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{card.value}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{card.trend}</span>
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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} color="var(--primary)" />
          Actions Rapides
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { to: '/pharmacien/prepare', icon: <ClipboardCheck size={18} />, label: 'Préparer commandes', color: '#3b82f6' },
            { to: '/pharmacien/prescriptions', icon: <FileText size={18} />, label: 'Valider ordonnances', color: '#9333ea' },
            { to: '/pharmacien/scan', icon: <ScanBarcode size={18} />, label: 'Scanner un colis', color: '#2ebb80' },
            { to: '/pharmacien/stock', icon: <Package size={18} />, label: 'Gérer le stock', color: '#f59e0b' },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px',
                background: 'var(--bg-subtle)',
                border: `2px solid ${action.color}20`,
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: action.color,
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${action.color}15`;
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = `${action.color}20`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {action.icon}
              {action.label}
              <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </div>

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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
            <p style={{ fontWeight: 600 }}>Aucune commande récente.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                {['Commande #', 'Client', 'Total', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.78rem', fontWeight: 700,
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
