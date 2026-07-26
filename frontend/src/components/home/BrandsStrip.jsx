import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrandsStrip = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/brands');
        if (res.data.success && res.data.data) {
          const allBrands = res.data.data.data || res.data.data || [];
          setBrands(allBrands);
        }
      } catch (err) {
        console.error('Error fetching brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return null;
  if (brands.length === 0) return null;

  return (
    <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '30px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ overflow: 'hidden' }}>
        <h3 className="text-center" style={{ marginBottom: '20px', fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Nos Marques Partenaires
        </h3>
        
        <div className="brands-marquee">
          <div className="brands-track">
            {/* Double the array for seamless scrolling */}
            {[...brands, ...brands].map((brand, idx) => (
              <div key={idx} className="brand-item">
                <div className="brand-logo">
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span className="brand-initial">{brand.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="brand-name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .brands-marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .brands-marquee::before, .brands-marquee::after {
          content: '';
          position: absolute;
          top: 0;
          width: 100px;
          height: 100%;
          z-index: 2;
        }
        
        .brands-marquee::before {
          left: 0;
          background: linear-gradient(to right, var(--bg-subtle) 0%, transparent 100%);
        }
        
        .brands-marquee::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-subtle) 0%, transparent 100%);
        }

        .brands-track {
          display: flex;
          width: calc(200px * 24);
          animation: scroll 50s linear infinite;
        }

        .brand-item {
          width: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          transition: var(--transition);
          cursor: pointer;
        }

        .brand-logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: white;
          border: 2px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: var(--transition);
        }

        .brand-initial {
          font-family: var(--font-title);
          font-weight: 900;
          font-size: 1.5rem;
          color: var(--text);
        }

        .brand-name {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.2;
        }

        .brand-item:hover .brand-logo {
          transform: scale(1.1) translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          border-color: var(--primary);
        }

        .brand-item:hover .brand-name {
          color: var(--primary);
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-200px * 12)); }
        }
      `}</style>
    </section>
  );
};

export default BrandsStrip;
