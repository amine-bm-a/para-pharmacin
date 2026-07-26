import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios base url to Laravel API (override with VITE_API_URL in .env for production)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Security: add CSRF-like protection via custom header
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Interceptor to handle token expiry (401) automatically
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep axios header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch profile on mount / token change
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await axios.get('/profile');
        if (res.data.success) setUser(res.data.user);
        else handleLogout();
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.post('/login', { email, password });
      if (res.data.success) {
        // 2FA required for admin accounts
        if (res.data.requires_2fa) {
          return {
            success: true,
            requires_2fa: true,
            email: res.data.email,
            dev_2fa_code: res.data.dev_2fa_code ?? null,
          };
        }
        const { access_token, user: userData } = res.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginWith2fa = async (email, code) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.post('/verify-2fa', { email, code });
      if (res.data.success) {
        const { access_token, user: userData } = res.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Code invalide ou expiré.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password, passwordConfirmation, referralCode = null) => {
    setLoading(true); setError(null);
    try {
      const payload = { name, email, phone, password, password_confirmation: passwordConfirmation };
      if (referralCode) payload.referral_code = referralCode.toUpperCase();
      const res = await axios.post('/register', payload);
      if (res.data.success) {
        const { access_token, user: userData } = res.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      let msg = "Erreur d'inscription.";
      if (errors) msg = Object.values(errors).flat().join(' ');
      else msg = err.response?.data?.message || msg;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const logout = async () => {
    try { await axios.post('/logout'); } catch {}
    finally { handleLogout(); }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, loginWith2fa, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
