/**
 * UserNotifContext.jsx
 * 
 * Manages persistent database notifications (from the backend `user_notifications` table).
 * Polls every 30s for unread count. Provides full notifications list when opened.
 * 
 * This is SEPARATE from NotificationContext (which handles UI toasts only).
 */
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserNotifContext = createContext(null);

export const UserNotifProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Fetch unread count only (lightweight)
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get('/notifications/unread-count');
      if (res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (e) {
      // Silently ignore — don't spam console on auth errors
    }
  }, [user]);

  // Fetch all notifications (on demand — when user opens panel)
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        // Update unread count from the list
        const unread = res.data.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) { /* ignore */ }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) { /* ignore */ }
  }, []);

  // Delete a notification
  const deleteNotif = useCallback(async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(prev => {
        const notif = prev.find(n => n.id === id);
        if (notif && !notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
        return prev.filter(n => n.id !== id);
      });
    } catch (e) { /* ignore */ }
  }, []);

  // Start/stop polling based on auth state
  useEffect(() => {
    if (user) {
      fetchUnreadCount(); // immediate fetch on login
      intervalRef.current = setInterval(fetchUnreadCount, 30000); // poll every 30s
    } else {
      setUnreadCount(0);
      setNotifications([]);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, fetchUnreadCount]);

  return (
    <UserNotifContext.Provider value={{
      unreadCount,
      notifications,
      loading,
      fetchNotifications,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotif,
    }}>
      {children}
    </UserNotifContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserNotif = () => useContext(UserNotifContext);
