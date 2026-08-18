import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="product-card" style={{ pointerEvents: 'none' }}>
    <div className="product-card-img">
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 'var(--radius-md)'
      }} />
    </div>
    <div className="product-card-body">
      <div style={{
        height: '12px',
        width: '60%',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '8px'
      }} />
      <div style={{
        height: '16px',
        width: '90%',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '12px'
      }} />
      <div style={{
        height: '14px',
        width: '40%',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '16px'
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '12px'
      }}>
        <div style={{
          height: '20px',
          width: '80px',
          background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px'
        }} />
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      </div>
    </div>
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export const FilterSkeleton = () => (
  <div className="filter-sidebar">
    <div className="filter-title">
      <div style={{
        height: '20px',
        width: '80px',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px'
      }} />
    </div>
    {[1, 2, 3].map((i) => (
      <div className="filter-section" key={i}>
        <div style={{
          height: '16px',
          width: '120px',
          background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '12px'
        }} />
        {[1, 2, 3, 4].map((j) => (
          <div key={j} style={{
            height: '14px',
            width: '100%',
            background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '8px'
          }} />
        ))}
      </div>
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="container fade-in" style={{ padding: '40px 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '40px' }}>
      {/* Product Image Skeleton */}
      <div style={{
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }} />

      {/* Details Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ height: '24px', width: '30%', background: 'var(--bg-subtle)', borderRadius: '4px' }} />
        <div style={{ height: '36px', width: '85%', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '6px' }} />
        <div style={{ height: '28px', width: '40%', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '6px' }} />
        <div style={{ height: '80px', width: '100%', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }} />
        <div style={{ height: '50px', width: '100%', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-md)', marginTop: '20px' }} />
      </div>
    </div>

    {/* Reviews Skeleton Section */}
    <div style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
      <div style={{ height: '24px', width: '200px', background: 'var(--bg-subtle)', borderRadius: '4px', marginBottom: '20px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: '16px', width: '150px', background: 'var(--border-light)', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '14px', width: '80%', background: 'var(--border-light)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CartSkeleton = () => (
  <div className="container fade-in" style={{ padding: '40px 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: '100px', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
      <div style={{ height: '320px', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-lg)' }} />
    </div>
  </div>
);

export const CheckoutStepSkeleton = () => (
  <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
    <div style={{ height: '28px', width: '220px', background: 'var(--bg-subtle)', borderRadius: '4px', marginBottom: '24px' }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <div style={{ height: '48px', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-md)' }} />
      <div style={{ height: '48px', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-md)' }} />
    </div>
    <div style={{ height: '48px', width: '100%', background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 'var(--radius-md)' }} />
  </div>
);

export const HomeLoadingSkeleton = () => (
  <div style={{ padding: '40px 0' }} className="container">
    <div style={{
      height: '420px',
      width: '100%',
      background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: 'var(--radius-xl)',
      marginBottom: '40px'
    }} />
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
      {Array(6).fill(0).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div style={{
            width: '60px',
            height: '12px',
            background: 'linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-light) 50%, var(--bg-subtle) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px'
          }} />
        </div>
      ))}
    </div>
  </div>
);

export default ProductCardSkeleton;
