import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ Load Tailwind & global styles (src/index.css must contain @tailwind directives)
import './index.css';

// ✅ Only register SW in production, over HTTPS, and use a JS file in /public
if (
  import.meta.env.PROD &&
  'serviceWorker' in navigator &&
  window.location.protocol === 'https:'
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('SW registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('SW registration failed:', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
