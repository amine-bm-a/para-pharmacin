import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Pill, Loader2 } from 'lucide-react';
import { BACKEND_BASE_URL } from '../utils/textUtils';

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const cancelRef = useRef(null);

  const debouncedQuery = useDebounce(query, 250);

  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${BACKEND_BASE_URL}/storage/${imgUrl}`;
  };

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (cancelRef.current) cancelRef.current.cancel();
    cancelRef.current = axios.CancelToken.source();

    setLoading(true);
    axios
      .get('/products/search/autocomplete', {
        params: { q: debouncedQuery },
        cancelToken: cancelRef.current.token,
      })
      .then((res) => {
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
          setIsOpen(res.data.suggestions.length > 0);
          setActiveIndex(-1);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) console.error('Autocomplete error:', err);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    const val = activeIndex >= 0 ? suggestions[activeIndex]?.name : query;
    if (val?.trim()) {
      navigate(`/products?search=${encodeURIComponent(val.trim())}`);
      setIsOpen(false);
      setQuery(val.trim());
    }
  }, [activeIndex, suggestions, query, navigate]);

  const handleSelect = useCallback((product) => {
    setQuery(product.name);
    setIsOpen(false);
    navigate(`/products/${product.slug}`);
  }, [navigate]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  }, [isOpen, suggestions, activeIndex, handleSelect]);

  const formatPrice = (p) => `${Number(p).toFixed(2)} MAD`;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1, maxWidth: '560px' }}>
      <form onSubmit={handleSubmit} className="search-bar-container" style={{ margin: 0 }}>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Rechercher un produit, une marque, une catégorie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {loading ? (
          <span className="search-icon">
            <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
          </span>
        ) : (
          <span className="search-icon">
            <Search size={18} color="var(--text-muted)" />
          </span>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: '1px solid rgba(76,175,80,0.2)',
            zIndex: 9998,
            overflow: 'hidden',
            listStyle: 'none',
            padding: '8px 0',
            margin: 0,
          }}
        >
          {/* Header */}
          <li style={{
            padding: '6px 16px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '4px',
          }}>
            {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''}
          </li>

          {suggestions.map((product, i) => {
            const active = i === activeIndex;
            const hasDiscount = product.discount_price && product.discount_price < product.price;

            return (
              <li
                key={product.id}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={() => handleSelect(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: active ? 'linear-gradient(135deg, rgba(76,175,80,0.08), rgba(69,160,73,0.05))' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary, #4caf50)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Product image thumbnail */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {product.image_url ? (
                    <img
                      src={getImageSrc(product.image_url)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Pill size={20} color="var(--primary)" />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1e293b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {product.name}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
                    {product.brand && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                        {product.brand}
                      </span>
                    )}
                    {product.category && (
                      <>
                        <span style={{ color: '#cbd5e1', fontSize: '0.65rem' }}>•</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{product.category}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {hasDiscount ? (
                    <>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>
                        {formatPrice(product.discount_price)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        {formatPrice(product.price)}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary, #4caf50)' }}>
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>
              </li>
            );
          })}

          {/* "See all results" footer */}
          <li
            role="option"
            onMouseDown={handleSubmit}
            style={{
              padding: '10px 16px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: 'var(--primary, #4caf50)',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Search size={16} color="var(--primary)" />
            Voir tous les résultats pour <strong style={{ marginLeft: '4px' }}>"{query}"</strong>
          </li>
        </ul>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
