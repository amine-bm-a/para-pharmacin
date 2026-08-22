import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  ScanBarcode, AlertCircle, Trash2, RefreshCw, ShoppingBasket, Info, ExternalLink, Globe, Database, Tag, PackagePlus, Search, Pill
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import useBarcodeScanner from '../hooks/useBarcodeScanner';

function InfoItem({ label, value }) {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(', ') : String(value);
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.5, fontWeight: 500, wordBreak: 'break-word' }}>{display}</div>
    </div>
  );
}

const DB_LABELS = {
  food: 'Open Food Facts (alimentaire)',
  beauty: 'Open Beauty Facts (cosmétique / parapharmacie)',
  petfood: 'Open Pet Food Facts (alimentation animale)',
  products: 'Open Products Facts (produits non alimentaires)',
};

export default function ProductScanner({ onProductCreated, onNotFoundAdd }) {
  const notif = useNotification();
  const inputRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [ammpsKeyword, setAmmpsKeyword] = useState('');
  const [ammpsResults, setAmmpsResults] = useState([]);
  const [ammpsLoading, setAmmpsLoading] = useState(false);
  const [ammpsError, setAmmpsError] = useState('');
  const [ammpsSearched, setAmmpsSearched] = useState(false);
  const [ammpsAdding, setAmmpsAdding] = useState(false);

  const totalScanned = scannedProducts.reduce((sum, item) => sum + item.count, 0);

  const refocusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const runScan = async (code) => {
    if (!code || !code.trim()) return;
    setScanning(true);
    setError('');
    setAmmpsResults([]);
    setAmmpsError('');
    setAmmpsSearched(false);
    try {
      const res = await axios.post('/admin/stocks/scan', { barcode: code.trim() });
      if (res.data.success) {
        const prod = res.data.product;
        setSelectedProduct(prod);
        setSelectedSource(res.data.source);

        if (res.data.source === 'local') {
          setScannedProducts(prev => {
            const existing = prev.find(p => p.product.id === prod.id);
            if (existing) {
              return prev.map(p => p.product.id === prod.id
                ? { ...p, count: p.count + (res.data.added_quantity || 1), product: prod }
                : p);
            }
            return [...prev, { product: prod, count: res.data.added_quantity || 1 }];
          });
          notif.success(res.data.auto_created
            ? `Produit ajouté au catalogue + stock +1 : « ${prod.name} »`
            : `« ${prod.name} » scanné — stock +1`);
        } else {
          notif.success(`Produit trouvé dans la base mondiale : « ${prod.name} »`);
        }
        setBarcode('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Aucun produit trouvé avec ce code-barres.';
      setError(msg);
      notif.error(msg);
      setSelectedProduct(null);
      setSelectedSource(null);
    } finally {
      setScanning(false);
      refocusInput();
    }
  };

  // Support hardware barcode scanners (keyboard wedge) even when the input
  // does not have focus. Manual typing inside the input still works normally.
  useBarcodeScanner(runScan, { targetSelector: '.barcode-scanner-input' });

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    await runScan(barcode);
  };

  const searchAmmps = async (e) => {
    if (e) e.preventDefault();
    const kw = ammpsKeyword.trim();
    if (!kw) return;
    setAmmpsLoading(true);
    setAmmpsError('');
    setAmmpsResults([]);
    setAmmpsSearched(kw);
    try {
      const res = await axios.get('/admin/ammps-search', { params: { search: kw } });
      if (res.data.success) {
        setAmmpsResults(res.data.medicines || []);
      } else {
        setAmmpsError(res.data.message || 'Erreur de recherche dans le registre AMMPS.');
      }
    } catch (err) {
      setAmmpsError(err.response?.data?.message || 'Impossible de contacter le registre AMMPS.');
    } finally {
      setAmmpsLoading(false);
    }
  };

  const addAmmpsMedicine = async (medicine) => {
    setAmmpsAdding(true);
    try {
      const res = await axios.post('/admin/ammps/add', { barcode: barcode || null, medicine });
      if (res.data.success) {
        const prod = res.data.product;
        setSelectedProduct(prod);
        setSelectedSource('local');
        setScannedProducts(prev => {
          const existing = prev.find(p => p.product.id === prod.id);
          if (existing) {
            return prev.map(p => p.product.id === prod.id
              ? { ...p, count: p.count + (res.data.added_quantity || 1), product: prod }
              : p);
          }
          return [...prev, { product: prod, count: res.data.added_quantity || 1 }];
        });
        setError('');
        setAmmpsResults([]);
        setAmmpsSearched(false);
        setBarcode('');
        notif.success(`Médicament ajouté au catalogue + stock : « ${prod.name} »`);
      } else {
        notif.error(res.data.message || "Impossible d'ajouter le médicament.");
      }
    } catch (err) {
      notif.error(err.response?.data?.message || "Erreur lors de l'ajout du médicament.");
    } finally {
      setAmmpsAdding(false);
      refocusInput();
    }
  };

  const removeProduct = (productId) => {
    setScannedProducts(prev => prev.filter(p => p.product.id !== productId));
    refocusInput();
  };

  const resetSession = () => {
    setScannedProducts([]);
    setSelectedProduct(null);
    setSelectedSource(null);
    setError('');
    notif.success('Session de scan réinitialisée.');
    refocusInput();
  };

  const isLocal = selectedSource === 'local';

  const selectedPrice = selectedProduct
    ? (() => {
        const base = parseFloat(selectedProduct.price || 0);
        const discounted = selectedProduct.discount_price ? parseFloat(selectedProduct.discount_price) : NaN;
        const final = discounted > 0 ? discounted : base;
        return { base, final, hasPrice: final > 0, isDiscounted: final > 0 && final < base };
      })()
    : null;

  return (
    <div>
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
              ref={inputRef}
              type="text"
              autoFocus
              className="barcode-scanner-input"
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
          💡 Compatible avec le lecteur de code-barres USB. Si le produit n'est pas dans votre catalogue, les informations réelles sont cherchées dans la base mondiale (Open Food Facts / Open Beauty Facts).
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
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, flex: 1, minWidth: '200px' }}>{error}</span>
            {onNotFoundAdd && barcode && (
              <button
                type="button"
                onClick={() => onNotFoundAdd(barcode)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                  padding: '10px 18px', fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px'
                }}
              >
                <PackagePlus size={16} /> Ajouter ce produit manuellement
              </button>
            )}
          </div>
        )}

        {/* Name-based medicine lookup — always available, no scan needed */}
        <div style={{
          marginTop: '18px',
          background: 'var(--bg-card)',
          border: '1.5px solid #3b82f6',
          borderRadius: '14px',
          padding: '18px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '4px' }}>
            <Pill size={18} color="#3b82f6" />
            Rechercher un médicament par son nom
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Pas besoin d'un code-barres : recherchez le médicament dans le registre officiel marocain (AMMPS)
            pour l'ajouter directement au catalogue avec son prix officiel (PPV), sa marque et sa fiche pré-remplie.
            Si un code-barres est saisi ci-dessus, il sera associé au produit.
          </p>
            <form onSubmit={searchAmmps} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="ammps-search-input"
                placeholder="Ex : CARDIOASPIRINE, PARACETAMOL..."
                value={ammpsKeyword}
                onChange={e => setAmmpsKeyword(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-light)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={ammpsLoading || !ammpsKeyword.trim()}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                  padding: '11px 20px', fontWeight: 700, fontSize: '0.85rem',
                  cursor: ammpsLoading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '7px'
                }}
              >
                <Search size={15} /> {ammpsLoading ? 'Recherche...' : 'Rechercher sur AMMPS'}
              </button>
            </form>

            {ammpsError && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>{ammpsError}</div>
            )}

            {ammpsSearched && ammpsResults.length === 0 && !ammpsLoading && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Aucun médicament marocain trouvé pour « {ammpsSearched} ».
              </div>
            )}

            {ammpsResults.length > 0 && (
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {ammpsResults.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '12px 16px'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.92rem' }}>
                        {m.name}{m.dosage ? ` — ${m.dosage}` : ''}
                        {m.is_rx && (
                          <span style={{
                            marginLeft: '8px', fontSize: '0.68rem', fontWeight: 700,
                            background: 'rgba(239,68,68,0.12)', color: 'var(--danger)',
                            padding: '2px 8px', borderRadius: '50px', verticalAlign: 'middle'
                          }}>📋 Ordonnance</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                        {[m.ppv ? `PPV ${m.ppv.toFixed(2)} DH` : null, m.dci, m.forme, m.epi, m.statut].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={ammpsAdding}
                      onClick={() => addAmmpsMedicine(m)}
                      style={{
                        background: 'linear-gradient(135deg, var(--primary), #45a049)',
                        color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                        padding: '9px 16px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '7px', opacity: ammpsAdding ? 0.6 : 1
                      }}
                    >
                      <PackagePlus size={15} /> {ammpsAdding ? 'Ajout...' : 'Ajouter au catalogue (+1)'}
                    </button>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Product info card — maximum info about the last scanned product */}
      {selectedProduct && (
        <div style={{
          background: 'var(--bg-card)',
          border: `1.5px solid ${isLocal ? 'var(--primary)' : '#3b82f6'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          marginBottom: '32px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: isLocal ? 'rgba(76, 175, 80, 0.08)' : 'rgba(59, 130, 246, 0.08)',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Info size={20} color={isLocal ? 'var(--primary)' : '#3b82f6'} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>Fiche produit</span>
            </div>
            {isLocal ? (
              <span style={{
                padding: '5px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(76, 175, 80, 0.12)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Database size={13} /> Dans votre catalogue
              </span>
            ) : (
              <span style={{
                padding: '5px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Globe size={13} /> Base mondiale{selectedProduct.database ? ` — ${selectedProduct.database}` : ''}
              </span>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '28px 24px' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {/* Image */}
              <div style={{ flexShrink: 0 }}>
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}
                  />
                ) : (
                  <div style={{
                    width: '150px', height: '150px', borderRadius: '16px',
                    background: 'var(--bg-subtle)', border: '1px dashed var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', fontSize: '3rem'
                  }}>💊</div>
                )}
              </div>

              {/* Identity */}
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px' }}>
                  {selectedProduct.name}
                </h2>
                {selectedProduct.brand && (
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                    <Tag size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    {selectedProduct.brand}
                  </div>
                )}
                <div style={{
                  fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700,
                  background: 'var(--bg-subtle)', border: '1px solid var(--border-light)',
                  borderRadius: '8px', padding: '6px 14px', display: 'inline-block', marginTop: '4px'
                }}>
                  {selectedProduct.barcode}
                </div>

                {isLocal ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                    <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prix</div>
                      {selectedPrice.hasPrice ? (
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {selectedPrice.final.toFixed(2)} MAD
                          {selectedPrice.isDiscounted && (
                            <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '8px' }}>
                              {selectedPrice.base.toFixed(2)} MAD
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning)' }}>
                          Prix non défini
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stock</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedProduct.stock <= 10 ? 'var(--warning)' : 'var(--primary)' }}>
                        {selectedProduct.stock}
                      </div>
                    </div>
                    {selectedProduct.requires_prescription && (
                      <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase' }}>Ordonnance</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--danger)' }}>Requise</div>
                      </div>
                    )}
                    {selectedProduct.is_featured && (
                      <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Vedette</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>⭐ Featured</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                    {selectedProduct.quantity && (
                      <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contenance</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>{selectedProduct.quantity}</div>
                      </div>
                    )}
                    {selectedProduct.nutrition_grades && (
                      <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nutri-score</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>{String(selectedProduct.nutrition_grades).toUpperCase()}</div>
                      </div>
                    )}
                    {selectedProduct.ecoscore_grade && (
                      <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eco-score</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>{String(selectedProduct.ecoscore_grade).toUpperCase()}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed fields */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 40px' }}>
              {isLocal ? (
                <>
                  <div>
                    <InfoItem label="Catégorie" value={selectedProduct.category} />
                    <InfoItem label="Marque" value={selectedProduct.brand_name || selectedProduct.brand} />
                    <InfoItem label="Référence (slug)" value={selectedProduct.slug} />
                    <InfoItem label="Description" value={selectedProduct.description} />
                  </div>
                  <div>
                    <InfoItem label="Ingrédients" value={selectedProduct.ingredients} />
                    <InfoItem label="Conseils d'utilisation" value={selectedProduct.usage_instructions} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <InfoItem label="Base de données" value={selectedProduct.database ? DB_LABELS[selectedProduct.database] : null} />
                    <InfoItem label="Dénomination (générique)" value={selectedProduct.generic_name} />
                    <InfoItem label="Catégorie" value={selectedProduct.category} />
                    <InfoItem label="Fabricant / Producteur" value={selectedProduct.producer} />
                    <InfoItem label="Emballage" value={selectedProduct.packaging} />
                  </div>
                  <div>
                    <InfoItem label="Ingrédients" value={selectedProduct.ingredients} />
                    <InfoItem label="Labels" value={selectedProduct.labels} />
                    <InfoItem label="NOVA (transformation)" value={selectedProduct.nova_group ? `Groupe ${selectedProduct.nova_group}` : null} />
                  </div>
                </>
              )}
            </div>

            {!isLocal && (
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.06)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1, minWidth: '220px' }}>
                  Ce produit n'existe pas encore dans votre catalogue, vous ne pouvez donc pas l'ajouter au stock. Ajoutez-le d'abord avec son code-barres.
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {onProductCreated ? (
                    <button
                      type="button"
                      onClick={onProductCreated}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white', textDecoration: 'none', border: 'none',
                        borderRadius: 'var(--radius-md)', padding: '10px 18px', fontWeight: 700,
                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer'
                      }}
                    >
                      <PackagePlus size={16} /> Ajouter au catalogue
                    </button>
                  ) : (
                    <a
                      href="/admin/products"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white', textDecoration: 'none', border: 'none',
                        borderRadius: 'var(--radius-md)', padding: '10px 18px', fontWeight: 700,
                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '7px'
                      }}
                    >
                      <PackagePlus size={16} /> Ajouter au catalogue
                    </a>
                  )}
                  {selectedProduct.product_url && (
                    <a
                      href={selectedProduct.product_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'var(--bg-card)', border: '1.5px solid #3b82f6', color: '#2563eb',
                        textDecoration: 'none', borderRadius: 'var(--radius-md)', padding: '10px 18px',
                        fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '7px'
                      }}
                    >
                      <ExternalLink size={16} /> Voir la fiche mondiale
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  {totalScanned} unité(s) ajoutée(s) automatiquement au stock
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
              const rawFinal = product.discount_price ? parseFloat(product.discount_price) : NaN;
              const itemPrice = rawFinal > 0 ? rawFinal : parseFloat(product.price || 0);
              return (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    boxShadow: '0 4px 18px rgba(76, 175, 80, 0.12)',
                    flexWrap: 'wrap',
                    gap: '14px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                        style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-light)', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        border: '1px solid var(--border-light)', background: 'var(--bg-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', flexShrink: 0
                      }}>💊</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.98rem' }}>{product.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {product.brand ? `${product.brand} · ` : ''}Code : <strong>{product.barcode}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 700 }}>
                        {itemPrice > 0
                          ? <>Prix : <span style={{ color: 'var(--primary)' }}>{itemPrice.toFixed(2)} MAD</span></>
                          : 'Prix : non défini'}
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 700 }}>
                        Stock actuel : <span style={{ color: product.stock <= 10 ? 'var(--warning)' : 'var(--primary)' }}>{product.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '50px',
                      background: 'rgba(76, 175, 80, 0.12)',
                      color: 'var(--primary)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <PackagePlus size={15} /> +{count} scanné(s) — ajouté(s)
                    </span>

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

      {scannedProducts.length === 0 && !selectedProduct && (
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
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
            Scannez un code-barres pour afficher toutes les informations du produit. S'il n'est pas dans votre catalogue, les données réelles seront récupérées depuis la base mondiale.
          </div>
        </div>
      )}
    </div>
  );
}