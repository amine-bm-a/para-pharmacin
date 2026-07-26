import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext(null);

let notifId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 4000) => {
    const id = ++notifId;
    setNotifications(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (msg, dur) => addNotification(msg, 'success', dur);
  const error = (msg, dur) => addNotification(msg, 'error', dur);
  const info = (msg, dur) => addNotification(msg, 'info', dur);
  const warning = (msg, dur) => addNotification(msg, 'warning', dur);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            style={{
              pointerEvents: 'all',
              background: n.type === 'success' ? '#10b981'
                : n.type === 'error' ? '#ef4444'
                : n.type === 'warning' ? '#f59e0b'
                : '#3b82f6',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              animation: 'slideInUp 0.3s ease',
              minWidth: '250px',
              maxWidth: '380px',
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
