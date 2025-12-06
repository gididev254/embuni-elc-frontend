import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import App from './App';
import './styles/globals.css';

// Initialize Sentry in production
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    release: 'frontend@' + import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'production',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    // Disable automatic session tracking
    autoSessionTracking: false,
    // Disable automatic performance monitoring
    autoSessionTracking: false,
    // Disable automatic error tracking
    autoSessionTracking: false,
    // Disable automatic page load tracking
    autoSessionTracking: false,
  });
}

// Create a fallback ErrorBoundary component if not already defined
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errorInfo, setErrorInfo] = React.useState(null);

  React.useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      setHasError(true);
      setError(error);
      setErrorInfo(errorInfo);
      
      // Log to Sentry if available
      if (window.Sentry) {
        window.Sentry.captureException(error, { extra: { errorInfo } });
      }
    };

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      errorHandler(error, { componentStack: `${source}:${lineno}:${colno}` });
      return true; // Prevent default handler
    };

    // Promise rejection handler
    window.onunhandledrejection = (event) => {
      errorHandler(event.reason, { type: 'unhandledrejection' });
    };

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#dc3545' }}>Something went wrong</h1>
        <p>We're sorry, but an unexpected error occurred. Our team has been notified.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reload Page
        </button>
        {import.meta.env.DEV && error && (
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '14px',
              marginTop: '10px'
            }}>
              {error.toString()}
              {errorInfo?.componentStack && (
                <div style={{ marginTop: '10px' }}>
                  {errorInfo.componentStack}
                </div>
              )}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('React rendering error:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; color: red;">
      <h1>Application Error</h1>
      <p>Failed to render application.</p>
      <details>
        <summary>Error Details</summary>
        <pre>${error.message}</pre>
      </details>
    </div>
  `;
}
