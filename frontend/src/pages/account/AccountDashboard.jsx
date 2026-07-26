import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  FileText, 
  User, 
  MapPin, 
  Gift, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Star,
  TrendingUp,
  CreditCard,
  Download,
  RefreshCw
} from 'lucide-react';

const AccountDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'prescriptions', label: 'My Prescriptions', icon: FileText },
    { id: 'health', label: 'My Health Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const summaryCards = [
    { label: 'Active Orders', value: 3, icon: Package, color: '#8FAF9B', trend: '+2 this week' },
    { label: 'Loyalty Points', value: 2450, icon: Star, color: '#C9A96A', trend: 'Silver Tier' },
    { label: 'Saved Products', value: 12, icon: Heart, color: '#2E7D5B', trend: '+5 this month' },
    { label: 'Last Purchase', value: 'DH 450', icon: ShoppingBag, color: '#8FAF9B', trend: '3 days ago' },
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      products: ['La Roche-Posay Lipikar', 'Vichy Mineral 89', 'Bioderma Sensibio'],
      total: 450,
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'shipped',
      products: ['CeraVe Hydrating Cleanser', 'Avene Cleanance'],
      total: 320,
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-20',
      status: 'preparing',
      products: ['Nuxe Huile Prodigieuse', 'Filorga Time-Filler'],
      total: 580,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#2E7D5B';
      case 'shipped': return '#8FAF9B';
      case 'preparing': return '#C9A96A';
      case 'confirmed': return '#2E7D5B';
      default: return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'preparing': return 'Preparing';
      case 'confirmed': return 'Confirmed';
      default: return status;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: sidebarOpen ? 280 : 80,
        background: 'white',
        borderRight: '1px solid #E8E8E8',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 18,
          }}>
            PB
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>Pharmacie</div>
              <div style={{ fontSize: 12, color: '#666' }}>Benmoussa</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 16px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #2E7D5B, #8FAF9B)' : 'transparent',
                  color: isActive ? 'white' : '#666',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: 4,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F6F1EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</span>
                )}
                {item.badge && sidebarOpen && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#C9A96A',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
        }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid #E8E8E8',
              background: 'white',
              color: '#DC2626',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FEF2F2';
              e.currentTarget.style.borderColor = '#FECACA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E8E8E8';
            }}
          >
            < LogOut size={20} />
            {sidebarOpen && <span style={{ fontWeight: 500, fontSize: 14 }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? 280 : 80,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
      }}>
        {/* Top Navigation */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E8E8E8',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 900,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
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
              onMouseEnter={(e) => e.currentTarget.style.background = '#F6F1EB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Search */}
            <div style={{
              position: 'relative',
              width: 400,
            }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: 14, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} 
              />
              <input
                type="text"
                placeholder="Search products, orders..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: 12,
                  border: '1px solid #E8E8E8',
                  background: '#F8F9FA',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 125, 91, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = '#F8F9FA';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F6F1EB'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Bell size={20} style={{ color: '#666' }} />
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#DC2626',
              }} />
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#F6F1EB'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Heart size={20} style={{ color: '#666' }} />
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#F6F1EB'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <ShoppingBag size={20} style={{ color: '#666' }} />
            </button>

            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}>
              S
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ padding: '32px' }}>
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, #2E7D5B 0%, #8FAF9B 100%)',
            borderRadius: 20,
            padding: '40px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            boxShadow: '0 10px 40px rgba(46, 125, 91, 0.15)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8, fontWeight: 500 }}>
                Good Morning, Sarah 👋
              </div>
              <h1 style={{ 
                fontSize: 32, 
                fontWeight: 800, 
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                Welcome back to your<br />health & beauty space.
              </h1>
              <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 500 }}>
                Your personalized dashboard to manage orders, prescriptions, and health preferences.
              </p>
            </div>
            <div style={{
              width: 200,
              height: 200,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: 80 }}>🌿</div>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 32,
          }}>
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid #E8E8E8',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: card.color + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={24} style={{ color: card.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>{card.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A' }}>
                        {card.value}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingUp size={14} />
                    {card.trend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 32,
            border: '1px solid #E8E8E8',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            marginBottom: 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                Recent Orders
              </h2>
              <button style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid #E8E8E8',
                background: 'white',
                color: '#666',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
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
              >
                View All
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentOrders.map((order, index) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: getStatusColor(order.status) + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {order.status === 'delivered' && <CheckCircle size={20} style={{ color: getStatusColor(order.status) }} />}
                        {order.status === 'shipped' && <Truck size={20} style={{ color: getStatusColor(order.status) }} />}
                        {order.status === 'preparing' && <Clock size={20} style={{ color: getStatusColor(order.status) }} />}
                        {order.status === 'confirmed' && <Package size={20} style={{ color: getStatusColor(order.status) }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{order.id}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{order.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                        DH {order.total}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
                    {order.products.join(' • ')}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid #E8E8E8',
                      background: 'white',
                      color: '#666',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
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
                    >
                      <Truck size={14} />
                      Track
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid #E8E8E8',
                      background: 'white',
                      color: '#666',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
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
                    >
                      <Download size={14} />
                      Invoice
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, #2E7D5B, #8FAF9B)',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
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
                      <RefreshCw size={14} />
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
            {/* Loyalty Program */}
            <div style={{
              background: 'linear-gradient(135deg, #C9A96A 0%, #E8D5A3 100%)',
              borderRadius: 20,
              padding: 32,
              color: 'white',
              boxShadow: '0 10px 40px rgba(201, 169, 106, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Gift size={24} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Loyalty Program</h2>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, opacity: 0.9 }}>Silver Tier</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>2,450 / 5,000 pts</span>
                </div>
                <div style={{
                  height: 8,
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: '49%',
                    background: 'white',
                    borderRadius: 4,
                  }} />
                </div>
              </div>

              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
                Next Reward: <strong>Gold Tier</strong>
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                2,550 more points to unlock exclusive benefits
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: 32,
              border: '1px solid #E8E8E8',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>
                Quick Actions
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <button style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #E8E8E8',
                  background: '#F8F9FA',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8F9FA';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <FileText size={24} style={{ color: '#2E7D5B' }} />
                  <span>Upload Prescription</span>
                </button>
                
                <button style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #E8E8E8',
                  background: '#F8F9FA',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8F9FA';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <MapPin size={24} style={{ color: '#2E7D5B' }} />
                  <span>Add Address</span>
                </button>
                
                <button style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #E8E8E8',
                  background: '#F8F9FA',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8F9FA';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <CreditCard size={24} style={{ color: '#2E7D5B' }} />
                  <span>Payment Methods</span>
                </button>
                
                <button style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid #E8E8E8',
                  background: '#F8F9FA',
                  color: '#1A1A1A',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#2E7D5B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8F9FA';
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <HelpCircle size={24} style={{ color: '#2E7D5B' }} />
                  <span>Get Help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;
