import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Clock, ArrowLeft, Calendar, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/blog/articles');
        if (res.data.success) {
          const fetched = res.data.articles || [];
          setArticles(fetched);

          // Auto-open article from navigation state (from BlogGrid)
          if (location.state?.openArticleId) {
            const target = fetched.find(a => a.id === location.state.openArticleId);
            if (target) setSelectedArticle(target);
          }

          // Auto-open article from ?article= query param (slug or id)
          const params = new URLSearchParams(location.search);
          const articleParam = params.get('article');
          if (articleParam && !location.state?.openArticleId) {
            const target = fetched.find(a =>
              String(a.id) === articleParam || a.slug === articleParam
            );
            if (target) setSelectedArticle(target);
          }
        }
      } catch (err) {
        console.error('Error fetching blog articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [location.state, location.search]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Get unique categories of published articles
  const categories = ['Tous', ...new Set(articles.map(a => a.category).filter(Boolean))];

  // Filtering logic
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (art.content && art.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Tous' || art.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 40px',
      background: 'var(--bg-main, #f9fafb)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'bounce 1s infinite' }}>🍃</div>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Chargement des articles de conseils...</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-main, #f9fafb)', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <div style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-muted)', 
          marginBottom: '32px',
          padding: '12px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>🏠 Accueil</span>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Nos Conseils & Blog</span>
        </div>

        {/* Hero title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 700, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            background: 'rgba(46, 187, 128, 0.1)',
            padding: '6px 16px',
            borderRadius: '50px',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            Espace Conseils
          </span>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 850, 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--secondary, #0d3c26), var(--primary, #2ebb80))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-title, inherit)'
          }}>
            Conseils Beauté, Santé & Bien-être
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Retrouvez les articles et recommandations de nos professionnels de santé pour prendre soin de vous et de vos proches au quotidien.
          </p>
        </div>

        {/* Filter bar and search */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Search field */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light, #e5e7eb)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '50px',
                  border: selectedCategory === cat ? '2px solid var(--primary)' : '2.5px solid #f3f4f6',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, var(--primary), #45a049)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--text, #374151)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat ? '0 4px 15px rgba(76, 175, 80, 0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles list */}
        {filteredArticles.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '30px' 
          }}>
            {filteredArticles.map(art => (
              <article 
                key={art.id} 
                onClick={() => setSelectedArticle(art)}
                style={{ 
                  background: 'white', 
                  borderRadius: '20px', 
                  border: '1px solid var(--border-light, #e5e7eb)', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Cover Image */}
                <div style={{ height: '220px', width: '100%', overflow: 'hidden', background: '#f3f4f6', position: 'relative' }}>
                  {art.image_url ? (
                    <img src={art.image_url} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                      <BookOpen size={48} />
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--secondary, #0d3c26)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {art.category || 'Général'}
                  </span>
                </div>

                {/* Content info */}
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      <span>{formatDate(art.published_at || art.created_at)}</span>
                    </div>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{art.read_time || 5} min de lecture</span>
                    </div>
                  </div>

                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    marginBottom: '14px', 
                    color: 'var(--text, #1e293b)', 
                    fontWeight: 800, 
                    lineHeight: 1.35,
                    fontFamily: 'var(--font-title, inherit)'
                  }}>{art.title}</h3>

                  <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.92rem', 
                    marginBottom: '24px', 
                    flexGrow: 1, 
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {art.content}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: 'var(--primary)', 
                    fontWeight: 700, 
                    fontSize: '0.92rem',
                    marginTop: 'auto'
                  }}>
                    <span>Lire le conseil</span>
                    <span>→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            background: 'white', 
            borderRadius: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '16px', color: 'var(--text)' }}>Aucun conseil disponible</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Essayez d'ajuster vos critères de recherche ou de catégorie.</p>
          </div>
        )}

      </div>

      {/* Article Detail Overlay Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13, 60, 38, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }} onClick={() => setSelectedArticle(null)}>
          <div style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            background: 'white',
            borderRadius: '24px',
            padding: '36px',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} />
                <span>Retour aux articles</span>
              </button>
              <button 
                onClick={() => setSelectedArticle(null)} 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#e5e7eb'}
                onMouseLeave={e => e.target.style.background = '#f3f4f6'}
              >&times;</button>
            </div>

            {/* Modal Title */}
            <span style={{
              background: 'rgba(46, 187, 128, 0.1)',
              color: 'var(--primary)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              {selectedArticle.category || 'Général'}
            </span>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 850, 
              marginBottom: '16px', 
              color: 'var(--text, #0f172a)',
              lineHeight: 1.3,
              fontFamily: 'var(--font-title, inherit)'
            }}>{selectedArticle.title}</h2>
            
            {/* Meta info */}
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                <span>Publié le {formatDate(selectedArticle.published_at || selectedArticle.created_at)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} />
                <span>{selectedArticle.read_time || 5} min de lecture</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} />
                <span>Par l'équipe Pharmacie</span>
              </div>
            </div>

            {/* Main Image */}
            {selectedArticle.image_url && (
              <img 
                src={selectedArticle.image_url} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '350px', 
                  objectFit: 'cover', 
                  borderRadius: '16px', 
                  marginBottom: '28px', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' 
                }} 
              />
            )}

            {/* Article Content Body */}
            <div 
              style={{ 
                fontSize: '1.05rem', 
                lineHeight: '1.8', 
                color: '#334155', 
                whiteSpace: 'pre-line',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '28px',
                fontFamily: 'var(--font-body, inherit)'
              }}
            >
              {selectedArticle.content}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '36px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
              <button 
                onClick={() => setSelectedArticle(null)} 
                style={{
                  padding: '12px 28px',
                  borderRadius: '50px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--primary), #45a049)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.25)'
                }}
              >
                Fermer la lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
