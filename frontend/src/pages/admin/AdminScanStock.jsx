import React, { useState } from 'react';
import axios from 'axios';
import {
  ScanBarcode, AlertCircle, CheckCircle, PackagePlus, Plus, Minus,
  Trash2, RefreshCw, ShoppingBasket
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AdminScanStock() {
  const notif = useNotification();
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [addingIds, setAddingIds] = useState(new Set());
  const [error, setError] = useState('');

  const totalScanned = scannedProducts.reduce((sum, item) => sum + item.count, 0);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!barcode.trim()) return;
    setScanning(true);
    setError('');
    try {
      const res = await axios.post('/admin/stocks/scan', { barcode: barcode.trim() });
      if (res.data.success) {
        const prod = res.data.product;
        setScannedProducts(prev => {
          const existing = prev.find(p => p.product.id === prod.id);
          if (existing) {
            return prev.map(p => p.product.id === prod.id ? { ...p, count: p.count + 1 } : p);
          }
          return [...prev, { product: prod, count: 1 }];
        });
        setBarcode('');
        notif.success(`« ${prod.name} » scanné (+1)`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Aucun produit trouvé avec ce code-barres.';
      setError(msg);
      notif.error(msg);
    } finally {
      setScanning(false);
    }
  };

  const adjustCount = (productId, delta) => {
    setScannedProducts(prev =>
      prev.map(p => {
        if (p.product.id !== productId) return p;
        const newCount = Math.max(0, p.count + delta);
        return { ...p, count: newCount };
      })
    );
  };

  const removeProduct = (productId) => {
    setScannedProducts(prev => prev.filter(p => p.product.id !== productId));
  };

  const handleAddToStock = async (item) => {
    if (item.count < 1) return;
    setAddingIds(prev => new Set(prev).add(item.product.id));
    try {
      const res = await axios.post(`/admin/stocks/${item.product.id}/add`, { quantity: item.count });
      if (res.data.success) {
        setScannedProducts(prev =>
          prev.map(p => p.product.id === item.product.id
            ? { ...p, product: { ...p.product, stock: res.data.product.stock }, count: 0 }
            : p)
        );
        notif.success(res.data.message);
      }
    } catch (err) {
      notif.error(err.response?.data?.message || 'Erreur lors de l\'ajout au stock.');
    } finally {
      setAddingIds(prev => {
        const s = new Set(prev);
        s.delete(item.product.id);
        return s;
      });
    }
  };

  const handleAddAll = async () => {
    const pending = scannedProducts.filter(item => item.count > 0);
    if (pending.length === 0) return;

    setAddingIds(new Set(pending.map(item => item.product.id)));
    for (const item of pending) {
      try {
        const res = await axios.post(`/admin/stocks/${item.product.id}/add`, { quantity: item.count });
        if (res.data.success) {
          setScannedProducts(prev =>
            prev.map(p => p.product.id === item.product.id
              ? { ...p, product: { ...p.product, stock: res.data.product.stock }, count: 0 }
              : p)
          );
        }
      } catch (err) {
        notif.error(err.response?.data?.message || `Erreur pour « ${item.product.name} ».`);
      }
    }
    setAddingIds(new Set());
    notif.success('Tous les produits scannés ont été ajoutés au stock.');
  };

  const resetSession = () => {
    if (scannedProducts.length === 0) return;
    setScannedProducts([]);
    setError('');
    notif.success('Session de scan réinitialisée.');
  };

  return (
    <div className="fade-in">
      {/* Premium Header Banner */}
      <div style={{
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ScanBarcode size={30} color="var(--primary)" />
          <span>Scanner Produit & Ajouter au Stock</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Scannez le code-barres d'un produit pour augmenter sa quantité, puis validez pour ajouter au stock.
        </p>
      </div>

      {/* Scanner Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScanBarcode size={18} color="var(--primary)" />
          Saisie du code-barres
        </h3>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <input
              type="text"
              autoFocus
              placeholder="Scannez ou saisissez le code-barres (ex: 6111147652202)"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-subtle)',
                color: 'var(--text)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={scanning || !barcode.trim()}
            style={{
              background: 'linear-gradient(135deg, var(--primary), #45a049)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '14px 32px',
              fontWeight: 700,
              cursor: scanning ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: !barcode.trim() ? 0.6 : 1
            }}
          >
            <ScanBarcode size={16} />
            <span>{scanning ? 'Scan en cours...' : 'Scanner'}</span>
          </button>
        </form>

        <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          💡 Chaque scan du même produit augmente sa quantité de +1. Les code-barres se configurent dans le formulaire du produit.
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.08)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            marginTop: '20px'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 700 }}>{error}</span>
          </div>
        )}
      </div>

      {/* Session summary */}
      {scannedProducts.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBasket size={22} style={{ color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
                  Session de scan : {scannedProducts.length} produit(s)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {totalScanned} unité(s) à ajouter au stock
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {totalScanned > 0 && (
                <button
                  onClick={handleAddAll}
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 24px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <PackagePlus size={18} />
                  <span>Ajouter tout au stock ({totalScanned})</span>
                </button>
              )}
              <button
                onClick={resetSession}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <RefreshCw size={16} />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {scannedProducts.map(item => {
              const { product, count } = item;
              const isAdding = addingIds.has(product.id);
              return (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
                    border: count > 0 ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    boxShadow: count > 0 ? '0 4px 18px rgba(76, 175, 80, 0.12)' : '0 2px 10px rgba(0,0,0,0.04)',
                    flexWrap: 'wrap',
                    gap: '14px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-light)', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.98rem' }}>{product.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {product.brand ? `${product.brand} · ` : ''}Code : <strong>{product.barcode}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 700 }}>
                        Stock actuel : <span style={{ color: product.stock <= 10 ? 'var(--warning)' : 'var(--primary)' }}>{product.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => adjustCount(product.id, -1)}
                        disabled={count === 0}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-light)',
                          background: 'var(--bg-subtle)',
                          color: 'var(--text)',
                          cursor: count === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: count === 0 ? 0.5 : 1,
                          transition: 'all 0.2s'
                        }}
                      >
                        <Minus size={15} />
                      </button>
                      <div style={{
                        minWidth: '56px',
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: count > 0 ? 'var(--primary)' : 'var(--text)'
                      }}>
                        {count}
                      </div>
                      <button
                        onClick={() => adjustCount(product.id, 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, var(--primary), #45a049)',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {count > 0 && (
                      <button
                        onClick={() => handleAddToStock(item)}
                        disabled={isAdding}
                        style={{
                          background: 'linear-gradient(135deg, var(--primary), #45a049)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 18px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: isAdding ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <PackagePlus size={16} />
                        <span>{isAdding ? 'Ajout...' : 'Ajouter au stock'}</span>
                      </button>
                    )}

                    {count === 0 && (
                      <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={16} /> Ajouté ✓
                      </span>
                    )}

                    <button
                      onClick={() => removeProduct(product.id)}
                      title="Retirer de la session"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-card)',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--danger)'; }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {scannedProducts.length === 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '2px dashed var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '70px 30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '18px' }}>📷</div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '8px' }}>
            Aucun produit scanné pour le moment
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
            Scannez un code-barres ci-dessus pour commencer à constituer votre session d'ajout au stock.
          </div>
        </div>
      )}
    </div>
  );
}