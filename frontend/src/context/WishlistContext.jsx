import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const storageKey = user?.id ? `wishlist_${user.id}` : 'wishlist_guest';

  const [wishlist, setWishlist] = useState(() => {
    try {
      const key = user?.id ? `wishlist_${user.id}` : 'wishlist_guest';
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend when logged in
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/wishlist');
      if (res.data.success && Array.isArray(res.data.data)) {
        setWishlist(res.data.data);
        localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Error fetching backend wishlist', err);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      // Load guest wishlist
      try {
        const local = JSON.parse(localStorage.getItem('wishlist_guest') || '[]');
        setWishlist(local);
      } catch {
        setWishlist([]);
      }
    }
  }, [token, user?.id, fetchWishlist]);

  // Keep localStorage synced whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch {
      // Ignore quota errors
    }
  }, [wishlist, storageKey]);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    return wishlist.some(item => Number(item.id) === Number(productId));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    if (!product || !product.id) return;
    if (!isInWishlist(product.id)) {
      const updated = [...wishlist, product];
      setWishlist(updated);
      if (token) {
        axios.post(`/wishlist/${product.id}`).catch(err => console.error('Wishlist add backend error', err));
      }
    }
  }, [wishlist, isInWishlist, token]);

  const removeFromWishlist = useCallback((productId) => {
    if (!productId) return;
    const updated = wishlist.filter(item => Number(item.id) !== Number(productId));
    setWishlist(updated);
    if (token) {
      axios.delete(`/wishlist/${productId}`).catch(err => console.error('Wishlist remove backend error', err));
    }
  }, [wishlist, token]);

  const toggleWishlist = useCallback((product) => {
    if (!product || !product.id) return false;
    const liked = isInWishlist(product.id);
    if (liked) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    return { wishlist: [], loading: false, isInWishlist: () => false, addToWishlist: () => {}, removeFromWishlist: () => {}, toggleWishlist: () => false, clearWishlist: () => {} };
  }
  return ctx;
};

