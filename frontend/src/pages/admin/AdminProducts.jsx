import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodUsage, setProdUsage] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodRequiresPrescription, setProdRequiresPrescription] = useState(false);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodImageFile, setProdImageFile] = useState(null);
  const [prodImagePreview, setProdImagePreview] = useState('');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, catRes, brandsRes] = await Promise.all([
        axios.get('/admin/products'),
        axios.get('/categories'),
        axios.get('/admin/brands'),
      ]);
      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) setProdCategory(catRes.data.categories[0].id);
      }
      if (brandsRes.data.success) setBrands(brandsRes.data.brands);
    } catch (err) {
      console.error('Error fetching products data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrandId('');
    setProdBrand('');
    setProdPrice('');
    setProdStock('');
    setProdDesc('');
    setProdIngredients('');
    setProdUsage('');
    setProdFeatured(false);
    setProdImageUrl('');
    setProdImageFile(null);
    setProdImagePreview('');
    setProdDiscountPrice('');
    setProdRequiresPrescription(false);
    if (categories.length > 0) setProdCategory(categories[0].id);
    setFormError('');
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdBrandId(product.brand_id || '');
    setProdBrand(product.brand);
    setProdPrice(product.price);
    setProdStock(product.stock);
    setProdDesc(product.description);
    setProdIngredients(product.ingredients || '');
    setProdUsage(product.usage_instructions || '');
    setProdFeatured(product.is_featured);
    setProdRequiresPrescription(!!product.requires_prescription);
    setProdImageUrl(product.image_url || '');
    setProdImageFile(null);
    setProdImagePreview(product.image_url || '');
    setProdDiscountPrice(product.discount_price || '');
    setProdCategory(product.category_id);
    setFormError('');
    setProductModalOpen(true);
  };

  const handleBrandSelect = (e) => {
    const id = e.target.value;
    setProdBrandId(id);
    const found = brands.find(b => String(b.id) === String(id));
    if (found) setProdBrand(found.name);
  };

  // Compress image using canvas before upload
  const compressImage = (file, maxWidthPx = 800, quality = 0.78) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidthPx) { h = Math.round((h * maxWidthPx) / w); w = maxWidthPx; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality);
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setProdImageFile(compressed);
    setProdImagePreview(URL.createObjectURL(compressed));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData();
    formData.append('name', prodName);
    formData.append('category_id', prodCategory);
    if (prodBrandId) formData.append('brand_id', prodBrandId);
    formData.append('brand', prodBrand);
    formData.append('price', prodPrice);
    formData.append('stock', prodStock);
    formData.append('description', prodDesc);
    if (prodIngredients) formData.append('ingredients', prodIngredients);
    if (prodUsage) formData.append('usage_instructions', prodUsage);
    formData.append('is_featured', prodFeatured ? '1' : '0');
    formData.append('requires_prescription', prodRequiresPrescription ? '1' : '0');
    if (prodDiscountPrice !== '') formData.append('discount_price', prodDiscountPrice);
    if (prodImageFile) {
      formData.append('image', prodImageFile);
    } else if (prodImageUrl) {
      formData.append('image_url', prodImageUrl);
    }
    // Laravel PUT workaround with FormData
    if (editingProduct) formData.append('_method', 'PUT');

    try {
      let res;
      if (editingProduct) {
        res = await axios.post(`/admin/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (res.data.success) {
        setProductModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur de validation des données du produit.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const res = await axios.delete(`/admin/products/${id}`);
        if (res.data.success) fetchData();
      } catch (err) {
        console.error('Error deleting product', err);
      }
    }
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des produits...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ 
        marginBottom: '32px',
        padding: '24px 32px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>💊</span>
            <span>Gestion des Produits</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Gérez votre catalogue de produits
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal} 
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          + Ajouter un produit
        </button>
      </div>

      <div style={{ 
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ 
              background: 'var(--bg-subtle)',
              borderBottom: '2px solid var(--primary)'
            }}>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Produit</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Catégorie</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Marque</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Prix</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Stock</th>
              <th style={{ 
                padding: '16px 20px', 
                textAlign: 'left', 
                fontWeight: 700, 
                fontSize: '0.85rem',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr 
                  key={p.id}
                  style={{ 
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image_url} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{p.name}</strong>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          {p.is_featured && <span style={{ fontSize: '0.7rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>⭐ Featured</span>}
                          {p.requires_prescription && <span style={{ fontSize: '0.7rem', background: 'var(--danger-light)', color: 'var(--danger)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>📋 Ordonnance</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>{p.category?.name}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>{p.brand}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {p.discount_price ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>{parseFloat(p.discount_price).toFixed(2)} MAD</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{parseFloat(p.price).toFixed(2)} MAD</span>
                      </div>
                    ) : (
                      <strong style={{ fontSize: '0.95rem' }}>{parseFloat(p.price).toFixed(2)} MAD</strong>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: p.stock < 10 ? 'var(--danger-light)' : 'var(--success-light)',
                      color: p.stock < 10 ? 'var(--danger)' : 'var(--success)'
                    }}>{p.stock} units</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenEditModal(p)} 
                        style={{ 
                          padding: '6px 14px', 
                          fontSize: '0.8rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--primary)',
                          background: 'var(--bg-card)',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--primary)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--bg-card)';
                          e.target.style.color = 'var(--primary)';
                        }}
                      >Éditer ✏️</button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)} 
                        style={{ 
                          padding: '6px 14px', 
                          fontSize: '0.8rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--danger)',
                          background: 'var(--bg-card)',
                          color: 'var(--danger)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--danger)';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--bg-card)';
                          e.target.style.color = 'var(--danger)';
                        }}
                      >Supprimer 🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ 
                  padding: '80px 40px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>💊</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Aucun produit dans la boutique</div>
                  <div style={{ fontSize: '0.9rem' }}>Ajoutez votre premier produit pour commencer</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {productModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '2px solid var(--primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingProduct ? '✏️ Modifier le Produit' : '➕ Ajouter un Produit'}</h2>
              <button 
                onClick={() => setProductModalOpen(false)} 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--border-light)',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--danger)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--border-light)';
                  e.target.style.color = 'var(--text-muted)';
                }}
              >&times;</button>
            </div>
            <div style={{ padding: '32px' }}>

            {formError && <p style={{ color: 'var(--danger)', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>{formError}</p>}

            <form onSubmit={handleProductSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Nom du Produit</label>
                <div className="form-wrapper">
                  <span className="input-icon">💊</span>
                  <input type="text" required className="form-control" value={prodName} onChange={(e) => setProdName(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Marque</label>
                  <select className="form-control" style={{ height: '52px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)' }} value={prodBrandId} onChange={handleBrandSelect}>
                    <option value="">— Sélectionner une marque —</option>
                    {brands.map((b) => (
                      <option value={b.id} key={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Catégorie</label>
                  <select className="form-control" style={{ height: '52px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)' }} value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option value={c.id} key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Nom de marque (texte libre, si pas dans la liste) <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— requis ✓</span></label>
                <div className="form-wrapper">
                  <span className="input-icon">🏷️</span>
                  <input type="text" required className="form-control" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Prix (MAD)</label>
                  <div className="form-wrapper">
                    <span className="input-icon">💰</span>
                    <input type="number" step="0.01" required className="form-control" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Prix Promo (MAD) <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>— optionnel</span></label>
                  <div className="form-wrapper">
                    <span className="input-icon">🏷️</span>
                    <input type="number" step="0.01" min="0" placeholder="Laisser vide..." className="form-control" value={prodDiscountPrice} onChange={(e) => setProdDiscountPrice(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Stock</label>
                  <div className="form-wrapper">
                    <span className="input-icon">📦</span>
                    <input type="number" required className="form-control" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Description</label>
                <div className="form-wrapper">
                  <span className="input-icon">📝</span>
                  <textarea required rows="3" className="form-control no-icon" style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', paddingLeft: '16px' }} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Ingrédients</label>
                <div className="form-wrapper">
                  <span className="input-icon">🧪</span>
                  <textarea rows="2" className="form-control no-icon" style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', paddingLeft: '16px' }} value={prodIngredients} onChange={(e) => setProdIngredients(e.target.value)}></textarea>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Conseils d'utilisation</label>
                <div className="form-wrapper">
                  <span className="input-icon">💡</span>
                  <textarea rows="2" className="form-control no-icon" style={{ resize: 'vertical', borderRadius: 'var(--radius-md)', paddingLeft: '16px' }} value={prodUsage} onChange={(e) => setProdUsage(e.target.value)}></textarea>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>📷 Image du produit</label>

                {/* Preview zone */}
                {prodImagePreview && (
                  <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <img
                      src={prodImagePreview}
                      alt="Aperçu"
                      style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px', border: '2px solid var(--border-light)', padding: '8px', background: 'var(--bg-subtle)' }}
                    />
                  </div>
                )}

                {/* File input */}
                <label
                  htmlFor="prod-image-file"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 18px', borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--primary)', background: 'var(--primary-light)',
                    cursor: 'pointer', color: 'var(--primary)', fontWeight: 700,
                    fontSize: '0.9rem', marginBottom: '8px', transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>📂</span>
                  <span>{prodImageFile ? `✓ ${prodImageFile.name}` : 'Choisir une image depuis le PC'}</span>
                  <input
                    id="prod-image-file"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  JPG, PNG, WEBP — max 5 Mo. L'image sera compressée automatiquement.
                </p>

                {/* OR URL fallback */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OU</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                </div>
                <div className="form-wrapper">
                  <span className="input-icon">🔗</span>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    className="form-control"
                    value={prodImageFile ? '' : prodImageUrl}
                    disabled={!!prodImageFile}
                    onChange={(e) => { setProdImageUrl(e.target.value); setProdImagePreview(e.target.value); }}
                  />
                </div>
                {prodImageFile && (
                  <button
                    type="button"
                    onClick={() => { setProdImageFile(null); setProdImagePreview(editingProduct?.image_url || ''); }}
                    style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ✕ Supprimer le fichier sélectionné
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
                <input type="checkbox" id="featured-check" checked={prodFeatured} onChange={(e) => setProdFeatured(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                <label htmlFor="featured-check" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>⭐ Marquer comme produit vedette (Mettre en avant sur la page d'accueil)</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }}>
                <input type="checkbox" id="prescription-check" checked={prodRequiresPrescription} onChange={(e) => setProdRequiresPrescription(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                <label htmlFor="prescription-check" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>📋 Médicament soumis à ordonnance (le client devra joindre une ordonnance pour commander)</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setProductModalOpen(false)} 
                  style={{ 
                    padding: '10px 24px', 
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--danger)';
                    e.target.style.color = 'var(--danger)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.color = 'var(--text-muted)';
                  }}
                >Annuler</button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '10px 24px', 
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }}
                >{editingProduct ? '💾 Sauvegarder' : '➕ Créer le produit'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
