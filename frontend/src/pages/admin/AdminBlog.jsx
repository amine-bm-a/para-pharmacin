import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { BookOpen, Plus, Trash2, Edit3, Image as ImageIcon, Clock } from 'lucide-react';

export default function AdminBlog() {
  const notif = useNotification();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tous');

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [isPublished, setIsPublished] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/blog/admin');
      if (res.data.success) {
        setArticles(res.data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching blog articles', err);
      if (notif) notif.error('Erreur lors du chargement des articles.');
    } finally {
      setLoading(false);
    }
  }, [notif]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Santé');
    setContent('');
    setImageUrl('');
    setReadTime(5);
    setIsPublished(false);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setTitle(art.title);
    setCategory(art.category || 'Général');
    setContent(art.content);
    setImageUrl(art.image_url || '');
    setReadTime(art.read_time || 5);
    setIsPublished(!!art.published_at);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      title,
      category,
      content,
      image_url: imageUrl,
      read_time: parseInt(readTime, 10) || 5,
      is_published: isPublished
    };

    try {
      let res;
      if (editingArticle) {
        res = await axios.put(`/admin/blog/articles/${editingArticle.id}`, payload);
      } else {
        res = await axios.post('/admin/blog/articles', payload);
      }

      if (res.data.success) {
        if (notif) notif.success(editingArticle ? 'Article modifié !' : 'Article créé !');
        setModalOpen(false);
        fetchArticles();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const handleDelete = async (art) => {
    if (window.confirm(`Supprimer l'article "${art.title}" ?`)) {
      try {
        const res = await axios.delete(`/admin/blog/articles/${art.id}`);
        if (res.data.success) {
          if (notif) notif.success('Article supprimé avec succès.');
          fetchArticles();
        }
      } catch (err) {
        if (notif) notif.error("Erreur lors de la suppression.");
      }
    }
  };

  // Get unique categories for filtering
  const categories = ['Tous', ...new Set(articles.map(a => a.category).filter(Boolean))];

  // Filter & Search
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                          (art.category && art.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'Tous' || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      margin: '30px'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des articles...</p>
    </div>
  );

  return (
    <div style={{ padding: '30px' }} className="fade-in">
      {/* Header card */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={28} color="var(--primary)" />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Gestion du Blog
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Publiez et gérez les conseils santé et bien-être de la pharmacie.
            </p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd} 
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease'
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
          <Plus size={18} />
          <span>Écrire un article</span>
        </button>
      </div>

      {/* Controls: Search and Filters */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <input 
          type="text" 
          placeholder="Rechercher par titre ou catégorie..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            width: '100%',
            maxWidth: '300px',
            fontSize: '0.9rem'
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filterCategory === cat ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                background: filterCategory === cat ? 'var(--primary-light, #e8f5e9)' : 'white',
                color: filterCategory === cat ? 'var(--primary, #2ebb80)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Couverture</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Titre</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Catégorie</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lecture</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Statut</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date d'ajout</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <tr key={art.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        width: '70px',
                        height: '45px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: '#f3f4f6',
                        border: '1px solid #e5e7eb'
                      }}>
                        {art.image_url ? (
                          <img src={art.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ImageIcon size={16} color="#9ca3af" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 650, color: 'var(--text)', fontSize: '0.9rem', maxWidth: '300px' }}>
                      {art.title}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '0.8rem'
                      }}>{art.category || 'Général'}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        <span>{art.read_time || 5} min</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: art.published_at ? '#e8f5e9' : '#fff3cd',
                        color: art.published_at ? '#2e7d32' : '#d97706'
                      }}>
                        {art.published_at ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(art.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            color: '#374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                        >
                          <Edit3 size={14} />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDelete(art)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: 'white',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                        >
                          <Trash2 size={14} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun article trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setModalOpen(false)}>
          <div style={{
            maxWidth: '750px',
            width: '100%',
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                {editingArticle ? "Modifier l'article" : "Écrire un nouvel article"}
              </h2>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >&times;</button>
            </div>

            {formError && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fee2e2', 
                color: '#ef4444', 
                borderRadius: '8px', 
                marginBottom: '20px',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                    Titre de l'article
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="ex: Les bienfaits de l'Eau Thermale"
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                    Catégorie
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="ex: Dermatologie, Nutrition..."
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                    URL de l'image de couverture
                  </label>
                  <input 
                    type="text" 
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                    Temps de lecture (minutes)
                  </label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block', color: 'var(--text)' }}>
                  Contenu de l'article (Markdown supporté)
                </label>
                <textarea 
                  required 
                  rows="12"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Écrivez le contenu de votre conseil..."
                  style={{ 
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="is_published"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_published" style={{ fontSize: '0.9rem', fontWeight: 650, color: 'var(--text)', cursor: 'pointer' }}>
                  Publier immédiatement (rendre visible en ligne)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'white',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary), #45a049)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  {editingArticle ? "Enregistrer" : "Créer l'article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
