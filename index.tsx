import React, { ReactNode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("RekanGuru Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Hapus loader jika terjadi error agar pesan error terlihat
      const loader = document.getElementById('initial-loader');
      if (loader) loader.style.display = 'none';

      return (
        <div style={{
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: '20px',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold'}}>Terjadi Kesalahan Aplikasi</h2>
            <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
              Mohon maaf, terjadi kendala saat merender halaman.
            </p>
            <pre style={{fontSize: '0.75rem', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'auto', textAlign: 'left', color: '#ef4444', marginBottom: '20px', maxHeight: '200px'}}>
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset & Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const initApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error: any) {
    console.error("Mounting Error:", error);
    const loader = document.getElementById('initial-loader');
    if (loader) {
        loader.innerHTML = `<div style="color:red; text-align:center; padding:20px;">Gagal Memulai React: ${error.message}</div>`;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}