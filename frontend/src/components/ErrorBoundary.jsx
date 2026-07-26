import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '16px'
          }}>
            ⚠️
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '12px'
          }}>
            Une erreur est survenue
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            maxWidth: '400px'
          }}>
            Nous sommes désolés, mais quelque chose s'est mal passé. Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem'
            }}
          >
            Rafraîchir la page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{
              marginTop: '24px',
              textAlign: 'left',
              maxWidth: '600px',
              width: '100%'
            }}>
              <summary style={{
                cursor: 'pointer',
                color: 'var(--danger)',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                Détails de l'erreur (développement)
              </summary>
              <pre style={{
                background: 'var(--bg-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                overflow: 'auto',
                border: '1px solid var(--border)'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
