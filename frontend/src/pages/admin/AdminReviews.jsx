import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/reviews');
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (review) => {
    if (window.confirm('Supprimer cet avis client ?')) {
      try {
        const res = await axios.delete(`/admin/reviews/${review.id}`);
        if (res.data.success) fetchReviews();
      } catch (err) {
        console.error('Error deleting review', err);
      }
    }
  };

  const filtered = ratingFilter
    ? reviews.filter((r) => r.rating === parseInt(ratingFilter))
    : reviews;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  if (loading) return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement des avis...</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary), #45a049)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>Avis clients</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>Consultez et modérez les avis laissés sur vos produits</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0
          }}>⭐</div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Note moyenne</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{avgRating} / 5</div>
          </div>
        </div>
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0
          }}>💬</div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total avis</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{reviews.length}</div>
          </div>
        </div>
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0
          }}>⚠️</div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Avis 1-2 étoiles</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{reviews.filter(r => r.rating <= 2).length}</div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        border: '1px solid var(--border-light)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Tous les avis</h3>
          <select 
            style={{ 
              width: '180px', 
              height: '42px', 
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-light)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text)',
              background: 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.boxShadow = 'none';
            }}
            value={ratingFilter} 
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Produit</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Client</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Note</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Commentaire</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r, index) => (
                  <tr 
                    key={r.id}
                    style={{ 
                      borderBottom: index < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={r.product?.image_url} 
                          alt={r.product?.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} 
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{r.product?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{r.user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.user?.email}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </td>
                    <td style={{ maxWidth: '280px', padding: '16px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{r.comment || '—'}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => handleDelete(r)} 
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--danger)',
                          background: 'white',
                          color: 'var(--danger)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--danger)';
                          e.target.style.color = 'white';
                          e.target.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = 'var(--danger)';
                          e.target.style.borderColor = 'var(--danger)';
                        }}
                      >Supprimer 🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Aucun avis trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
