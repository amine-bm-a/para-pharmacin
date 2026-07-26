import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2, MessageSquarePlus, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function ClientReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch depuis /testimonials (reviews approuvées en DB) ── */
  useEffect(() => {
    const fetchTestimonials = async () => {
      const cached = localStorage.getItem('cached_testimonials');
      if (cached) {
        try { setReviews(JSON.parse(cached)); } catch {}
      }
      try {
        const res = await axios.get('/testimonials');
        if (res.data.success && Array.isArray(res.data.testimonials)) {
          localStorage.setItem('cached_testimonials', JSON.stringify(res.data.testimonials));
          setReviews(res.data.testimonials);
        }
      } catch {
        // keep cached if available
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  /* ── Stats globales ── */
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  const starCounts = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => Number(r.rating) === s).length,
  }));

  return (
    <section
      style={{
        padding: '80px 0',
        background: 'var(--bg-light)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blobs décoratifs */}
      <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(10,168,79,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'250px', height:'250px', borderRadius:'50%', background:'radial-gradient(circle, rgba(199,166,91,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px' }}>

        {/* ── En-tête ── */}
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <span style={{
            color:'var(--primary)', fontWeight:700, fontSize:'0.88rem',
            textTransform:'uppercase', letterSpacing:'2px',
            background:'var(--primary-light)', padding:'6px 16px', borderRadius:'100px',
          }}>
            Avis Clients
          </span>
          <h2 style={{
            fontSize:'2.2rem', color:'var(--text-main)', fontWeight:700,
            marginTop:'16px', marginBottom:'10px', fontFamily:'var(--font-title)',
          }}>
            Ce que disent nos clients
          </h2>
          <div style={{ width:'60px', height:'4px', background:'linear-gradient(90deg, var(--primary), var(--accent))', margin:'0 auto 24px', borderRadius:'2px' }} />

          {/* Stats globales (uniquement si reviews) */}
          {avgRating && (
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'24px',
              background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
              padding:'16px 28px', boxShadow:'var(--shadow-sm)',
              border:'1px solid var(--border)', flexWrap:'wrap', justifyContent:'center',
            }}>
              {/* Note globale */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <span style={{ fontSize:'2.6rem', fontWeight:800, color:'var(--text-main)', lineHeight:1, fontFamily:'var(--font-title)' }}>
                  {avgRating}
                </span>
                <div style={{ display:'flex', gap:'3px', margin:'4px 0' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14}
                      fill={i < Math.round(Number(avgRating)) ? '#fbbf24' : 'none'}
                      color={i < Math.round(Number(avgRating)) ? '#fbbf24' : 'var(--text-light)'}
                    />
                  ))}
                </div>
                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:600 }}>
                  {reviews.length} avis vérifiés
                </span>
              </div>

              <div style={{ width:'1px', height:'50px', background:'var(--border)' }} />

              {/* Répartition par étoile */}
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {starCounts.map(({ star, count }) => (
                  <div key={star} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', width:'12px', textAlign:'right', fontWeight:600 }}>{star}</span>
                    <Star size={11} fill='#fbbf24' color='#fbbf24' />
                    <div style={{ width:'80px', height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{
                        width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%',
                        height:'100%',
                        background:'linear-gradient(90deg, #fbbf24, #f59e0b)',
                        borderRadius:'3px',
                        transition:'width 0.8s ease',
                      }} />
                    </div>
                    <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', minWidth:'20px' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Skeleton chargement ── */}
        {loading && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                background:'var(--bg-card)', borderRadius:'var(--radius-xl)',
                padding:'32px 28px', border:'1px solid var(--border)',
                animation:'pulse 1.5s ease-in-out infinite',
              }}>
                <div style={{ height:'16px', background:'var(--border)', borderRadius:'8px', marginBottom:'12px', width:'60%' }} />
                <div style={{ height:'80px', background:'var(--border)', borderRadius:'8px', marginBottom:'16px' }} />
                <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'var(--border)' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:'12px', background:'var(--border)', borderRadius:'6px', marginBottom:'8px', width:'50%' }} />
                    <div style={{ height:'10px', background:'var(--border)', borderRadius:'5px', width:'70%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── État vide ── */}
        {!loading && reviews.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{
              width:'80px', height:'80px', borderRadius:'24px',
              background:'var(--primary-light)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 24px',
              boxShadow:'0 8px 24px rgba(10,168,79,0.15)',
            }}>
              <MessageSquarePlus size={36} color='var(--primary)' />
            </div>
            <h3 style={{
              fontSize:'1.4rem', fontWeight:700, color:'var(--text-main)',
              marginBottom:'12px', fontFamily:'var(--font-title)',
            }}>
              Soyez le premier à laisser un avis !
            </h3>
            <p style={{
              fontSize:'0.95rem', color:'var(--text-muted)',
              lineHeight:1.6, maxWidth:'420px', margin:'0 auto 28px',
            }}>
              Partagez votre expérience avec nos produits et aidez d'autres clients à faire le bon choix.
            </p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', flexWrap:'wrap' }}>
              {[
                { icon:'⭐', label:'Note honnête' },
                { icon:'✅', label:'Achat vérifié' },
                { icon:'💬', label:'Avis utile' },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  background:'var(--bg-card)', border:'1px solid var(--border)',
                  borderRadius:'100px', padding:'8px 18px',
                  fontSize:'0.88rem', color:'var(--text-muted)', fontWeight:600,
                }}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            <div style={{
              marginTop:'32px', padding:'20px',
              background:'rgba(10,168,79,0.05)',
              borderRadius:'var(--radius-lg)',
              border:'1px dashed rgba(10,168,79,0.2)',
              maxWidth:'420px', margin:'32px auto 0',
              display:'flex', alignItems:'center', gap:'12px',
            }}>
              <TrendingUp size={20} color='var(--primary)' style={{ flexShrink:0 }} />
              <p style={{ margin:0, fontSize:'0.85rem', color:'var(--text-muted)', lineHeight:1.5, textAlign:'left' }}>
                Achetez un produit et laissez votre avis depuis votre espace client. Les avis sont vérifiés avant publication.
              </p>
            </div>
          </div>
        )}

        {/* ── Grid complet ── toutes les reviews affichées */}
        {!loading && reviews.length > 0 && (
          <div style={{
            columns: '3 300px',
            columnGap: '24px',
          }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px 24px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border)',
                  breakInside: 'avoid',
                  marginBottom: '24px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,168,79,0.12), 0 4px 16px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(10,168,79,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Quote déco */}
                <Quote size={40} style={{ color: 'var(--primary)', opacity: 0.08, position: 'absolute', top: '14px', right: '14px' }} />

                {/* Étoiles + badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15}
                        fill={i < review.rating ? '#fbbf24' : 'none'}
                        color={i < review.rating ? '#fbbf24' : 'var(--text-light)'}
                      />
                    ))}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700,
                    background: 'var(--primary-light)', padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                  }}>
                    <CheckCircle2 size={11} />
                    <span>Achat vérifié</span>
                  </div>
                </div>

                {/* Commentaire */}
                <p style={{
                  color: 'var(--text-main)', fontSize: '0.93rem',
                  lineHeight: '1.65', marginBottom: '16px',
                  fontStyle: 'italic', flexGrow: 1,
                }}>
                  "{review.comment || 'Très bon produit, je recommande !'}"
                </p>

                {/* Réponse admin */}
                {review.admin_reply && (
                  <div style={{
                    background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)',
                    padding: '12px 16px', marginBottom: '16px',
                    borderLeft: '3px solid var(--primary)',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.74rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Réponse de la Pharmacie
                    </div>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {review.admin_reply}
                    </p>
                  </div>
                )}

                {/* Auteur */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem', fontWeight: 800, color: '#fff',
                    boxShadow: '0 4px 12px rgba(10,168,79,0.3)', flexShrink: 0,
                  }}>
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                      {review.user?.name || 'Client anonyme'}
                    </h4>
                    <div style={{ display: 'flex', gap: '5px', fontSize: '0.76rem', color: 'var(--text-light)', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>{formatDate(review.created_at)}</span>
                      {review.product?.name && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                            sur {review.product.name.split('|')[0].trim()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
