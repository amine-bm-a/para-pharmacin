import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, DollarSign, Package, Users, AlertCircle, 
  Plus, ListChecks, Archive, Tag, TrendingUp, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DONUT_COLORS = ['#2ebb80', '#3b82f6', '#f59e0b', '#8b5cf6', '#f472b6'];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/stats');
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
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

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: 100, color: 'var(--text-muted)' }}>
      Impossible de charger les statistiques.
    </div>
  );

  const totalCategorySales = (stats.category_sales || []).reduce((sum, c) => sum + parseFloat(c.total_sales), 0);

  return (
    <div className="fade-in">
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
            <span style={{ fontSize: '2.2rem' }}>📊</span>
            <span>Tableau de bord</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Bienvenue, Admin ! Voici un aperçu de votre boutique.
          </p>
        </div>
        <div style={{
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-light)';
        }}
        >
          📅 Ce mois-ci ▾
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #2ebb80, #16a085)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <DollarSign size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Ventes totales</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{parseFloat(stats.revenue).toLocaleString('fr-FR')} MAD</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              +18.6% vs semaine précédente
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Commandes</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{stats.orders_count}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              +12.4% vs semaine précédente
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #f97316, #ea580c)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <Users size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Clients</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{stats.clients_count}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              +8.7% vs semaine précédente
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <Package size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Produits</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{stats.products_count}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              +15.8% vs semaine précédente
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-light)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <AlertCircle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Stock faible</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>{stats.low_stock_products?.length || 0}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>
              à surveiller
            </span>
          </div>
        </div>
      </div>

      {/* ── Sales Chart + Recent Orders ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Sales Evolution */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--primary)',
            background: 'var(--bg-subtle)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📈 Évolution des ventes</h3>
          </div>
          <div style={{ padding: '24px' }}>
          {stats.sales_chart && stats.sales_chart.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '16px 0' }}>
              {stats.sales_chart.map((day) => {
                const maxVal = Math.max(...stats.sales_chart.map(d => parseFloat(d.total) || 1));
                const percentHeight = ((parseFloat(day.total) || 0) / maxVal) * 80;
                return (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }} key={day.date}>
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.max(percentHeight, 8)}%`,
                        background: 'linear-gradient(135deg, var(--primary), #45a049)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      title={`${parseFloat(day.total).toFixed(2)} MAD`}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>📊</div>
              Aucune vente enregistrée récemment.
            </div>
          )}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--primary)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Commandes récentes</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>Voir toutes →</Link>
          </div>
          <div style={{ padding: '24px' }}>
          {stats.recent_orders && stats.recent_orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {stats.recent_orders.slice(0, 5).map((order) => (
                <div key={order.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: '1px solid var(--border-light)',
                  gap: 10,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--primary)' }}>
                      {order.order_number}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {order.client_name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {parseFloat(order.total).toFixed(2)} MAD
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: order.status === 'completed' ? 'var(--success-light)' :
                               order.status === 'pending' ? 'hsl(38, 80%, 92%)' :
                               order.status === 'processing' ? 'var(--primary-light)' : 'var(--danger-light)',
                      color: order.status === 'completed' ? 'var(--success)' :
                             order.status === 'pending' ? 'hsl(38, 80%, 40%)' :
                             order.status === 'processing' ? 'var(--primary)' : 'var(--danger)'
                    }}>
                      {order.status === 'completed' ? 'Livré' :
                       order.status === 'pending' ? 'En attente' :
                       order.status === 'processing' ? 'En cours' : 'Annulé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>📦</div>
              Aucune commande pour le moment.
            </div>
          )}
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Link to="/admin/orders" style={{
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--primary-dark)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--primary)';
            }}
            >
              Voir toutes les commandes <ArrowUpRight size={14} />
            </Link>
          </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Best Products + Sales Distribution + Low Stock ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Best Products */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--primary)',
            background: 'var(--bg-subtle)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🏆 Meilleurs produits</h3>
          </div>
          <div style={{ padding: '24px' }}>
          {stats.recent_orders && stats.recent_orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(stats.top_products || stats.low_stock_products || []).slice(0, 5).map((p, idx) => (
                <div key={p.id || idx} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-light), var(--primary))', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                    flexShrink: 0
                  }}>{idx + 1}</span>
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={{
                      width: 36, height: 36, borderRadius: 8,
                      objectFit: 'cover', flexShrink: 0
                    }} />
                  )}
                  <span style={{
                    fontSize: '0.84rem', fontWeight: 500,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    flex: 1
                  }}>{p.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>🏆</div>
              Aucune donnée.
            </div>
          )}
          </div>
        </div>

        {/* Sales Distribution / Donut */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--primary)',
            background: 'var(--bg-subtle)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🍩 Répartition des ventes</h3>
          </div>
          <div style={{ padding: '24px' }}>
          {stats.category_sales && stats.category_sales.length > 0 ? (
            <div>
              {/* Simple visual total */}
              <div style={{
                textAlign: 'center', padding: '16px 0 20px',
                borderBottom: '1px solid var(--border-light)', marginBottom: 12
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
                  {totalCategorySales.toLocaleString('fr-FR')} MAD
                </div>
              </div>

              {stats.category_sales.map((cat, idx) => {
                const percent = totalCategorySales > 0 ? ((parseFloat(cat.total_sales) / totalCategorySales) * 100).toFixed(0) : 0;
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                  key={cat.category_name}>
                    <span style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: DONUT_COLORS[idx % DONUT_COLORS.length],
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>{cat.category_name}</span>
                    <strong style={{ fontSize: '0.85rem' }}>{percent}% ({parseFloat(cat.total_sales).toLocaleString('fr-FR')} MAD)</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>🍩</div>
              Aucune donnée de catégorie.
            </div>
          )}
          </div>
        </div>

        {/* Low Stock */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--primary)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>⚠️ Stock faible</h3>
            <Link to="/admin/stocks" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>Voir tous</Link>
          </div>
          <div style={{ padding: '24px' }}>
          {stats.low_stock_products && stats.low_stock_products.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {stats.low_stock_products.slice(0, 5).map((p) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
                >
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={{
                      width: 36, height: 36, objectFit: 'cover',
                      borderRadius: 8, flexShrink: 0
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.84rem', fontWeight: 500,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{p.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--danger)', fontWeight: 600 }}>
                      Stock restant : {p.stock}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>✅</div>
              Aucun produit en stock faible. 👍
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ── Prescription Alert ── */}
      {stats.pending_prescriptions_count > 0 && (
        <div style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderLeft: '4px solid var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'hsl(354, 70%, 98%)',
          marginBottom: '32px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              {stats.pending_prescriptions_count} ordonnance(s) en attente de validation
            </span>
          </div>
          <Link to="/admin/orders" style={{
            fontWeight: 600, fontSize: '0.85rem', color: 'var(--danger)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--danger-dark)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--danger)';
          }}
          >
            Vérifier maintenant <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Link to="/admin/products" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text)',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <Plus size={18} style={{ color: 'var(--primary)' }} /> Ajouter un produit
        </Link>
        <Link to="/admin/orders" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text)',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <ListChecks size={18} style={{ color: 'var(--primary)' }} /> Valider les ordonnances
        </Link>
        <Link to="/admin/stocks" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text)',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <Archive size={18} style={{ color: 'var(--primary)' }} /> Mettre à jour le stock
        </Link>
        <Link to="/admin/promotions" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text)',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }}
        >
          <Tag size={18} style={{ color: 'var(--primary)' }} /> Lancer une promotion
        </Link>
      </div>
    </div>
  );
}
