import React, { useState } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  Gift, 
  User, 
  Heart, 
  Check, 
  X, 
  Filter,
  ChevronDown,
  Clock,
  Sparkles
} from 'lucide-react';

const NotificationsCenter = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedNotification, setExpandedNotification] = useState(null);

  const notifications = [
    {
      id: 1,
      type: 'order',
      category: 'Orders',
      title: 'Order Shipped',
      message: 'Your order ORD-2024-002 has been shipped and is on its way to you.',
      time: '2 hours ago',
      unread: true,
      icon: ShoppingBag,
      color: '#2E7D5B',
    },
    {
      id: 2,
      type: 'promotion',
      category: 'Promotions',
      title: 'Special Offer - 20% Off',
      message: 'Get 20% off on all skincare products this weekend only!',
      time: '5 hours ago',
      unread: true,
      icon: Gift,
      color: '#C9A96A',
    },
    {
      id: 3,
      type: 'account',
      category: 'Account',
      title: 'Profile Updated',
      message: 'Your health profile has been successfully updated.',
      time: '1 day ago',
      unread: false,
      icon: User,
      color: '#8FAF9B',
    },
    {
      id: 4,
      type: 'health',
      category: 'Health Tips',
      title: 'Daily Skincare Tip',
      message: 'Remember to apply sunscreen daily, even on cloudy days!',
      time: '2 days ago',
      unread: false,
      icon: Sparkles,
      color: '#2E7D5B',
    },
    {
      id: 5,
      type: 'order',
      category: 'Orders',
      title: 'Order Delivered',
      message: 'Your order ORD-2024-001 has been delivered successfully.',
      time: '3 days ago',
      unread: false,
      icon: Check,
      color: '#2E7D5B',
    },
    {
      id: 6,
      type: 'promotion',
      category: 'Promotions',
      title: 'New Product Alert',
      message: 'Check out our new collection of organic skincare products.',
      time: '4 days ago',
      unread: false,
      icon: Gift,
      color: '#C9A96A',
    },
    {
      id: 7,
      type: 'account',
      category: 'Account',
      title: 'Loyalty Points Earned',
      message: 'You earned 50 points from your recent purchase!',
      time: '5 days ago',
      unread: false,
      icon: Heart,
      color: '#8FAF9B',
    },
  ];

  const filters = [
    { id: 'all', label: 'All Notifications' },
    { id: 'unread', label: 'Unread' },
    { id: 'Orders', label: 'Orders' },
    { id: 'Promotions', label: 'Promotions' },
    { id: 'Account', label: 'Account' },
    { id: 'Health Tips', label: 'Health Tips' },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return notification.unread;
    return notification.category === activeFilter;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    // Implement mark as read logic
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // Implement mark all as read logic
    console.log('Mark all as read');
  };

  const deleteNotification = (id) => {
    // Implement delete logic
    console.log('Delete notification:', id);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      marginBottom: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Bell size={24} style={{ color: '#1A1A1A' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#DC2626',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', margin: 0, marginBottom: 4 }}>
              Notifications
            </h2>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              {unreadCount} unread notifications
            </p>
          </div>
        </div>
        <button
          onClick={markAllAsRead}
          style={{
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
          <Check size={16} />
          Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: activeFilter === filter.id ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
              background: activeFilter === filter.id ? '#2E7D5B' : 'white',
              color: activeFilter === filter.id ? 'white' : '#666',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.background = '#F6F1EB';
                e.currentTarget.style.borderColor = '#2E7D5B';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#E8E8E8';
              }
            }}
          >
            {filter.label}
            {filter.id === 'unread' && (
              <span style={{
                marginLeft: 6,
                background: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : '#DC2626',
                color: activeFilter === filter.id ? 'white' : 'white',
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 11,
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            padding: '60px 40px',
            textAlign: 'center',
            borderRadius: 16,
            background: '#F8F9FA',
            border: '2px dashed #E8E8E8',
          }}>
            <Bell size={48} style={{ color: '#E8E8E8', marginBottom: 16 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
              No notifications
            </h3>
            <p style={{ fontSize: 14, color: '#666' }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            const isExpanded = expandedNotification === notification.id;
            
            return (
              <div
                key={notification.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: notification.unread ? '#F0F9F4' : '#F8F9FA',
                  border: notification.unread ? '1px solid #2E7D5B' : '1px solid #E8E8E8',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {notification.unread && (
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#2E7D5B',
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: notification.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: notification.color }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: notification.color + '20',
                        color: notification.color,
                      }}>
                        {notification.category}
                      </span>
                      <span style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        {notification.time}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                      {notification.title}
                    </h4>

                    <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 8 }}>
                      {notification.message}
                    </p>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {notification.unread && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            padding: '6px 12px',
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
                          <Check size={12} />
                          Mark as Read
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid #E8E8E8',
                          background: 'white',
                          color: '#DC2626',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF2F2';
                          e.currentTarget.style.borderColor = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#E8E8E8';
                        }}
                      >
                        <X size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button style={{
            padding: '12px 32px',
            borderRadius: 10,
            border: '1px solid #E8E8E8',
            background: 'white',
            color: '#666',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
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
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
