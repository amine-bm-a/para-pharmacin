import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';

export default function PageBebe() {
  const { isDark } = useTheme();
  
  // Products and original filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Specific Baby Filter Fields
  const [ageGroup, setAgeGroup] = useState(''); // nourrisson (0-6m), bebe (6-24m), enfant (2y+)
  const [skinType, setSkinType] = useState(''); // normal, sensible, atopique, irrité
  const [babyCategory, setBabyCategory] = useState(''); // change, toilette, alimentation, soin, accessoires
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(600);
  const [sortOrder, setSortOrder] = useState('popular');
  const [brandsList, setBrandsList] = useState([]);

  useEffect(() => {
    const fetchBabyProducts = async () => {
      setLoading(true);
      try {
        // Fetch products and filter them on client side for the Baby category
        const res = await axios.get('/products');
        const allProds = res.data.data?.data || res.data.data || [];
        
        // Filter products belonging to Baby (either containing "bebe", "maman", category_id matching baby etc.)
        const babyProds = allProds.filter(p => {
          const categorySlug = p.category?.slug?.toLowerCase() || '';
          const name = p.name?.toLowerCase() || '';
          const description = p.description?.toLowerCase() || '';
          
          return (
            categorySlug.includes('bebe') ||
            categorySlug.includes('maman') ||
            name.includes('bébé') ||
            name.includes('bebe') ||
            name.includes('nourrisson') ||
            name.includes('maman') ||
            description.includes('bébé') ||
            description.includes('nourrisson')
          );
        });

        setProducts(babyProds);
        
        // Collect brands
        const uniqueBrands = [...new Set(babyProds.map(p => p.brand?.name).filter(Boolean))];
        setBrandsList(uniqueBrands);
      } catch (err) {
        console.error("Error fetching baby products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBabyProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter(p => {
    const name = p.name?.toLowerCase() || '';
    const desc = p.description?.toLowerCase() || '';
    
    // Age Group Filter
    if (ageGroup === 'nourrisson') {
      if (!name.includes('nourrisson') && !desc.includes('nourrisson') && !name.includes('0-6') && !desc.includes('0-6') && !name.includes('naissance')) return false;
    } else if (ageGroup === 'bebe') {
      if (!name.includes('bébé') && !name.includes('bebe') && !desc.includes('bébé') && !desc.includes('bebe')) return false;
    } else if (ageGroup === 'enfant') {
      if (!name.includes('enfant') && !desc.includes('enfant') && !name.includes('junior')) return false;
    }

    // Skin Sensitivity Filter
    if (skinType === 'sensible') {
      if (!name.includes('sensible') && !desc.includes('sensible') && !name.includes('toler') && !desc.includes('toler')) return false;
    } else if (skinType === 'atopique') {
      if (!name.includes('atopique') && !desc.includes('atopique') && !name.includes('eczema') && !desc.includes('eczema')) return false;
    } else if (skinType === 'irrite') {
      if (!name.includes('irrit') && !desc.includes('irrit') && !name.includes('cica') && !desc.includes('cica')) return false;
    }

    // Specific Product Category Filter
    if (babyCategory === 'change') {
      if (!name.includes('change') && !desc.includes('change') && !name.includes('couche') && !name.includes('liniment')) return false;
    } else if (babyCategory === 'toilette') {
      if (!name.includes('gel') && !name.includes('eau') && !name.includes('lingett') && !name.includes('shamp')) return false;
    } else if (babyCategory === 'alimentation') {
      if (!name.includes('lait') && !name.includes('biberon') && !name.includes('tétine') && !desc.includes('lait')) return false;
    } else if (babyCategory === 'soin') {
      if (!name.includes('crème') && !name.includes('creme') && !name.includes('huile') && !name.includes('baume')) return false;
    }

    // Brand Filter
    if (selectedBrand && p.brand?.name !== selectedBrand) return false;

    // Price Filter
    const actualPrice = p.discount_price || p.price;
    if (actualPrice > priceRange) return false;

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discount_price || a.price;
    const priceB = b.discount_price || b.price;
    
    if (sortOrder === 'price_asc') return priceA - priceB;
    if (sortOrder === 'price_desc') return priceB - priceA;
    if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return 0; // default (popular)
  });

  return (
    <div style={{ padding: '40px 0', minHeight: '80vh', background: 'var(--bg-subtle)' }}>
      <div className="container">
        {/* Banner header for Baby page */}
        <div style={{
          background: 'linear-gradient(135deg, #a5f3fc 0%, #06b6d4 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
          color: '#0f172a',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ zIndex: 2, position: 'relative', maxWidth: '600px' }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.4)', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Espace Maman & Bébé 👶</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px', color: '#0f172a' }}>Tout pour votre bout de chou</h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.5, color: '#334155' }}>
              Découvrez notre sélection rigoureuse de laits infantiles, soins hypoallergéniques, couches, soins de change et accessoires testés dermatologiquement.
            </p>
          </div>
          <div style={{
            position: 'absolute',
            right: '40px',
            bottom: '-20px',
            fontSize: '12rem',
            opacity: 0.15,
            pointerEvents: 'none'
          }}>👶</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          {/* Advanced filter sidebar */}
          <aside style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1.5px solid var(--border)', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>👶 Filtres Bébé</span>
              <button 
                onClick={() => {
                  setAgeGroup('');
                  setSkinType('');
                  setBabyCategory('');
                  setSelectedBrand('');
                  setPriceRange(600);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >Réinitialiser</button>
            </div>

            {/* Sub-Category Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px' }}>Type de Produit</label>
              <select
                value={babyCategory}
                onChange={e => setBabyCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text)'
                }}
              >
                <option value="">Tous les types</option>
                <option value="change">Change & Couches</option>
                <option value="toilette">Toilette & Lingettes</option>
                <option value="soin">Soins & Hydratation</option>
                <option value="alimentation">Lait & Alimentation</option>
              </select>
            </div>

            {/* Age Group Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px' }}>Âge</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="age" checked={ageGroup === ''} onChange={() => setAgeGroup('')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Tous âges</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="age" checked={ageGroup === 'nourrisson'} onChange={() => setAgeGroup('nourrisson')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Nourrisson (0 - 6 mois)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="age" checked={ageGroup === 'bebe'} onChange={() => setAgeGroup('bebe')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Bébé (6 - 24 mois)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="age" checked={ageGroup === 'enfant'} onChange={() => setAgeGroup('enfant')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Enfant (2 ans +)</span>
                </label>
              </div>
            </div>

            {/* Skin sensitivity/type Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px' }}>Sensibilité Peau</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="skin" checked={skinType === ''} onChange={() => setSkinType('')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Toutes peaux</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="skin" checked={skinType === 'sensible'} onChange={() => setSkinType('sensible')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Peau Sensible</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="skin" checked={skinType === 'atopique'} onChange={() => setSkinType('atopique')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Peau Atopique (Eczéma)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="skin" checked={skinType === 'irrite'} onChange={() => setSkinType('irrite')} style={{ accentColor: 'var(--primary)' }} />
                  <span>Peau Irritée / Rougeurs</span>
                </label>
              </div>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px' }}>Marque</label>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text)'
                }}
              >
                <option value="">Toutes les marques</option>
                {brandsList.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.88rem', marginBottom: '10px' }}>
                <span>Budget Max</span>
                <span style={{ color: 'var(--primary)' }}>{priceRange} MAD</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </aside>

          {/* Product grid / content */}
          <main>
            {/* Sort toolbar */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 24px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {sortedProducts.length} produit{sortedProducts.length !== 1 ? 's' : ''} disponible{sortedProducts.length !== 1 ? 's' : ''}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Trier par :</span>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text)',
                    fontWeight: 600
                  }}
                >
                  <option value="popular">Popularité</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: 'var(--bg-card)',
                border: '1.5px dashed var(--border)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <span style={{ fontSize: '4rem' }}>👶🔍</span>
                <h3 style={{ margin: '16px 0 8px', fontWeight: 800 }}>Aucun produit trouvé</h3>
                <p style={{ color: 'var(--text-muted)' }}>Essayez d'élargir vos filtres ou de modifier votre sélection.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
