import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';

export default function CategoryPage() {
  const { t } = useLang();
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await axios.get('/categories');
        const allCats = catRes.data.data || [];
        const currentCat = allCats.find(c => c.slug === slug);
        setCategory(currentCat);

        // Fetch products matching category
        const prodRes = await axios.get('/products');
        const allProds = prodRes.data.data?.data || prodRes.data.data || [];
        const filtered = allProds.filter(p => p.category_id === currentCat?.id);
        setProducts(filtered);

        // Collect unique brands in category
        const uniqueBrands = [...new Set(filtered.map(p => p.brand?.name).filter(Boolean))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Filter & Sort
  const processedProducts = products
    .filter(p => {
      const matchBrand = !selectedBrand || p.brand?.name === selectedBrand;
      const actualPrice = p.discount_price || p.price;
      const matchPrice = actualPrice <= priceRange;
      return matchBrand && matchPrice;
    })
    .sort((a, b) => {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;
      if (sortOrder === 'price_asc') return priceA - priceB;
      if (sortOrder === 'price_desc') return priceB - priceA;
      if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  return (
    <div style={{ padding: '60px 0', minHeight: '65vh', background: 'var(--bg-subtle)' }}>
      <Helmet>
        <title>{category ? `${category.name} | Pharmacie Ben Moussa` : 'Catégorie | Pharmacie Ben Moussa'}</title>
        <meta
          name="description"
          content={
            category
              ? (category.description || `Découvrez notre sélection de produits ${category.name} en ligne, livrés partout au Maroc.`).slice(0, 160)
              : 'Découvrez nos catégories de produits de parapharmacie.'
          }
        />
        <link rel="canonical" href={`${window.location.origin}/categories/${slug}`} />
      </Helmet>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '40px',
          background: 'linear-gradient(135deg, var(--primary), #45a049)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {category ? category.name : t('category')}
        </h1>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px', 
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{t('loading')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
            {/* Sidebar Filters */}
            <aside style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              height: 'fit-content',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '20px', fontWeight: 800 }}>
                {t('filterBy')}
              </h3>

              {/* Brand Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  {t('brands')}
                </label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text)'
                  }}
                >
                  <option value="">{t('allProducts')}</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Max {t('price')}</span>
                  <span>{priceRange} DH</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="10"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              {/* Sort filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  {t('sortBy')}
                </label>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text)'
                  }}
                >
                  <option value="">Par défaut</option>
                  <option value="price_asc">{t('priceAsc')}</option>
                  <option value="price_desc">{t('priceDesc')}</option>
                  <option value="newest">{t('newest')}</option>
                </select>
              </div>
            </aside>

            {/* Product Grid */}
            <main>
              {processedProducts.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '80px 40px', 
                  background: 'white', 
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--border-light)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('noResults')}</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '24px'
                }}>
                  {processedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
