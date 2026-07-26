import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton, FilterSkeleton } from '../components/LoadingSkeleton';
import { useDebounce } from '../utils/useDebounce';
import { getCachedData, setCachedData } from '../utils/apiCache';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const cancelTokenRef = useRef(null);

  // Filter states from URL params
  const categoryParam  = searchParams.get('category') || '';
  const searchParam    = searchParams.get('search') || '';
  const brandParam     = searchParams.get('brand') || '';

  const [selectedBrands, setSelectedBrands] = useState(brandParam ? brandParam.split(',') : []);
  const [minPrice, setMinPrice]   = useState('');
  const [maxPrice, setMaxPrice]   = useState('');
  const [sortBy, setSortBy]       = useState('popular');
  const [inStock, setInStock]     = useState(false);
  const [promoOnly, setPromoOnly] = useState(false);

  const debouncedSearch = useDebounce(searchParam, 500);

  useEffect(() => {
    axios.get('/categories').then(res => {
      if (res.data.success) setCategories(res.data.categories);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedBrands(brandParam ? brandParam.split(',') : []);
  }, [brandParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (cancelTokenRef.current) cancelTokenRef.current.cancel();
      cancelTokenRef.current = axios.CancelToken.source();

      const cacheKey = `products_${categoryParam}_${debouncedSearch}_${selectedBrands.join(',')}_${minPrice}_${maxPrice}_${sortBy}_${inStock}_${promoOnly}`;
      const cached = getCachedData(cacheKey);
      if (cached) {
        setProducts(cached.products);
        setAvailableBrands(cached.brands || []);
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (categoryParam)          params.append('category', categoryParam);
        if (debouncedSearch)        params.append('search', debouncedSearch);
        if (selectedBrands.length)  params.append('brand', selectedBrands.join(','));
        if (minPrice)               params.append('min_price', minPrice);
        if (maxPrice)               params.append('max_price', maxPrice);
        if (inStock)                params.append('in_stock', '1');
        if (promoOnly)              params.append('promotions', '1');
        params.append('sort', sortBy);

        const res = await axios.get(`/products?${params}`, {
          cancelToken: cancelTokenRef.current.token,
        });

        if (res.data.success) {
          const data = { products: res.data.products, brands: res.data.brands || [] };
          setProducts(data.products);
          setAvailableBrands(data.brands);
          setCachedData(cacheKey, data);
        }
      } catch (err) {
        if (!axios.isCancel(err)) console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => { if (cancelTokenRef.current) cancelTokenRef.current.cancel(); };
  }, [categoryParam, debouncedSearch, selectedBrands, minPrice, maxPrice, sortBy, inStock, promoOnly]);

  const handleCategoryChange = useCallback((slug) => {
    if (slug === '') searchParams.delete('category');
    else searchParams.set('category', slug);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('popular');
    setInStock(false);
    setPromoOnly(false);
    setSearchParams({});
  }, [setSearchParams]);

  // Active filters chip list
  const activeFilters = [
    ...(categoryParam ? [{ key: 'category', label: `Catégorie: ${categories.find(c => c.slug === categoryParam)?.name || categoryParam}` }] : []),
    ...(searchParam ? [{ key: 'search', label: `Recherche: "${searchParam}"` }] : []),
    ...selectedBrands.map(b => ({ key: `brand:${b}`, label: b })),
    ...(minPrice ? [{ key: 'min_price', label: `Min: ${minPrice} MAD` }] : []),
    ...(maxPrice ? [{ key: 'max_price', label: `Max: ${maxPrice} MAD` }] : []),
    ...(inStock ? [{ key: 'in_stock', label: 'En stock' }] : []),
    ...(promoOnly ? [{ key: 'promo', label: 'En promotion' }] : []),
  ];

  const removeFilter = useCallback((key) => {
    if (key === 'category') { searchParams.delete('category'); setSearchParams(searchParams); }
    else if (key === 'search') { searchParams.delete('search'); setSearchParams(searchParams); }
    else if (key.startsWith('brand:')) setSelectedBrands(prev => prev.filter(b => b !== key.replace('brand:', '')));
    else if (key === 'min_price') setMinPrice('');
    else if (key === 'max_price') setMaxPrice('');
    else if (key === 'in_stock') setInStock(false);
    else if (key === 'promo') setPromoOnly(false);
  }, [searchParams, setSearchParams]);

  const toggleStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `2px solid ${active ? 'var(--primary)' : 'var(--border-light, #e2e8f0)'}`,
    background: active ? 'rgba(76,175,80,0.08)' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    width: '100%',
  });

  return (
    <div className="container fade-in" style={{ marginTop: '24px' }}>
      <Helmet>
        <title>
          {searchParam ? `Résultats pour "${searchParam}" | Pharmacie Ben Moussa` : 'Tous nos produits | Pharmacie Ben Moussa'}
        </title>
        <meta
          name="description"
          content={
            searchParam
              ? `Résultats de recherche pour "${searchParam}" — parapharmacie, soins et bien-être livrés partout au Maroc.`
              : 'Parcourez tout le catalogue de produits de parapharmacie, soins et bien-être de Pharmacie Ben Moussa.'
          }
        />
        <link rel="canonical" href={`${window.location.origin}/products`} />
      </Helmet>
      {/* Breadcrumbs */}
      <div style={{
        fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px',
        padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <span>🏠</span>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>Catalogue</span>
        {categoryParam && (
          <>
            <span style={{ color: 'var(--border)' }}>/</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {categories.find(c => c.slug === categoryParam)?.name || categoryParam}
            </span>
          </>
        )}
      </div>

      {/* Active Filters Chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filtres actifs :</span>
          {activeFilters.map(f => (
            <span
              key={f.key}
              onClick={() => removeFilter(f.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px',
                background: 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(69,160,73,0.08))',
                border: '1px solid rgba(76,175,80,0.3)',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={`Retirer le filtre "${f.label}"`}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,175,80,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(69,160,73,0.08))'}
            >
              {f.label}
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>✕</span>
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            style={{
              fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 700,
              background: 'rgba(220,53,69,0.08)', padding: '4px 12px',
              borderRadius: '20px', border: '1px solid rgba(220,53,69,0.3)', cursor: 'pointer',
            }}
          >
            Tout effacer
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* ── Filter Sidebar ── */}
        <aside style={{
          background: 'white', border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)', padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: 'fit-content',
          position: 'sticky', top: '24px'
        }}>
          {loading ? <FilterSkeleton /> : (
            <>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--border-light)'
              }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Filtres</span>
                <button
                  onClick={handleResetFilters}
                  style={{
                    fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 700,
                    background: 'rgba(220,53,69,0.1)', padding: '6px 12px',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)', cursor: 'pointer',
                  }}
                >
                  Réinitialiser
                </button>
              </div>

              {/* Availability toggles */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✅ Disponibilité
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setInStock(v => !v)} style={toggleStyle(inStock)}>
                    <span>{inStock ? '✅' : '⬜'}</span>
                    En stock uniquement
                  </button>
                  <button onClick={() => setPromoOnly(v => !v)} style={toggleStyle(promoOnly)}>
                    <span>{promoOnly ? '🔥' : '⬜'}</span>
                    En promotion
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📁 Catégories
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" id="cat-all" name="category" checked={categoryParam === ''} onChange={() => handleCategoryChange('')}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                    <label htmlFor="cat-all" style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: categoryParam === '' ? 700 : 500, color: categoryParam === '' ? 'var(--primary)' : 'var(--text)' }}>
                      Toutes les catégories
                    </label>
                  </li>
                  {categories.map(cat => (
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={cat.id}>
                      <input type="radio" id={`cat-${cat.id}`} name="category" checked={categoryParam === cat.slug} onChange={() => handleCategoryChange(cat.slug)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                      <label htmlFor={`cat-${cat.id}`} style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: categoryParam === cat.slug ? 700 : 500, color: categoryParam === cat.slug ? 'var(--primary)' : 'var(--text)' }}>
                        {cat.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏷️ Marques
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {availableBrands.map(brand => (
                      <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={brand}>
                        <input type="checkbox" id={`brand-${brand}`} checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                        <label htmlFor={`brand-${brand}`} style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: selectedBrands.includes(brand) ? 700 : 500, color: selectedBrands.includes(brand) ? 'var(--primary)' : 'var(--text)' }}>
                          {brand}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price range */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💰 Prix (MAD)
                </h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <div className="form-wrapper" style={{ flex: 1 }}>
                    <span className="input-icon">📉</span>
                    <input type="number" placeholder="Min" className="form-control" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  </div>
                  <div className="form-wrapper" style={{ flex: 1 }}>
                    <span className="input-icon">📈</span>
                    <input type="number" placeholder="Max" className="form-control" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── Main Catalogue ── */}
        <main>
          <div style={{
            marginBottom: '32px', padding: '20px 24px', background: 'white',
            border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.6rem', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary), #45a049)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {searchParam ? `Résultats pour "${searchParam}"` : 'Tous les produits'}
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {loading ? '…' : `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trier par :</span>
              <div className="form-wrapper">
                <span className="input-icon">⚡</span>
                <select className="form-control" style={{ width: '180px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="popular">Popularité</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-3">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 40px', background: 'white',
              border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Aucun produit trouvé</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1rem', lineHeight: 1.6 }}>
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  marginTop: '24px', padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--primary), #45a049)',
                  border: 'none', borderRadius: 'var(--radius-md)', color: 'white',
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                🔄 Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
