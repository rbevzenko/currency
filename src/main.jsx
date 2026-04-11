import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import CurrencyConverter from './CurrencyConverter.jsx';

// Expose SW update function so the UI can trigger "Update" toasts
window.__swUpdate = registerSW({
  onNeedRefresh() {
    // Dispatch a custom event that CurrencyConverter listens for
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'));
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrencyConverter />
  </StrictMode>
);
