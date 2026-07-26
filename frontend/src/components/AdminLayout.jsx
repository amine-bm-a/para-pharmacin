import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SidebarAdmin from './SidebarAdmin';
import AdminTopbar from './AdminTopbar';

// Layout for all admin routes – dark sidebar + topbar + content area
export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const fetchPending = async () => {
      try {
        const res = await axios.get('/admin/stats');
        if (res.data.success) {
          setPendingOrders(res.data.stats.pending_prescriptions_count || 0);
        }
      } catch (err) {
        // Non-critical
      }
    };
    fetchPending();
  }, [user, isAdmin]);

  if (loading) {
    return <div className="text-center" style={{ padding: '80px' }}>Chargement...</div>;
  }

  // If not admin, redirect to home (or login)
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <div className="admin-main">
        <AdminTopbar pendingOrders={pendingOrders} unreadMessages={3} />
        <main className="admin-content">
          {/* Nested admin pages will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
