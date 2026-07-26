import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogGrid = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/blog/articles');
        if (res.data.success && res.data.articles && res.data.articles.length > 0) {
          setArticles(res.data.articles.slice(0, 3));
        } else {
          setArticles([]);
        }
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading || articles.length === 0) return null;

  return (
    <section className="py-section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 700, 
            fontSize: '0.88rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            background: 'var(--primary-light)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)'
          }}>
            Le Magazine
          </span>
          <h2 className="section-title" style={{ marginTop: '16px' }}>Conseils Beauté & Santé</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Découvrez nos conseils d'experts pour prendre soin de vous au quotidien.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px' 
        }}>
          {articles.map((article) => (
            <article 
              key={article.id} 
              className="blog-card"
              onClick={() => navigate('/blog', { state: { openArticleId: article.id } })}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.querySelector('.blog-img').style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.querySelector('.blog-img').style.transform = 'scale(1)';
              }}
            >
              {/* Image with zoom effect */}
              <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                <div 
                  className="blog-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("${article.image_url}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.5s ease'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'var(--secondary)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {article.category || 'Général'}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '12px', fontWeight: 500 }}>
                  <span>{formatDate(article.created_at)}</span>
                  <span>•</span>
                  <span>{article.read_time} min de lecture</span>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.4,
                  marginBottom: '16px',
                  fontFamily: 'var(--font-title)'
                }}>
                  {article.title}
                </h3>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <span>Lire l'article</span>
                  <span style={{ transition: 'transform 0.2s' }}>→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all button */}
        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 36px',
              background: 'linear-gradient(135deg, var(--primary), #16a085)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(46,187,128,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(46,187,128,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,187,128,0.3)'; }}
          >
            Voir tous nos conseils →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
