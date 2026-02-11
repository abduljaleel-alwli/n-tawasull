import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';

// Initialize Mouse Follower
const initCursor = () => {
  // Check if device is mobile or touch-enabled
  // This disables the custom cursor on screens narrower than 769px or devices with touch capabilities
  const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
                   
  if (isMobile) return;

  // @ts-ignore - MouseFollower comes from global CDN script
  if (typeof MouseFollower !== 'undefined') {
    // @ts-ignore
    const cursor = new MouseFollower({
        container: document.body,
        speed: 0.6,
        skewing: 2,
        skewingText: 0.5,
    });
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);

// Run after a short delay to ensure DOM is ready
setTimeout(initCursor, 100);