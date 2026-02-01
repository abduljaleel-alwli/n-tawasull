import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Mouse Follower
const initCursor = () => {
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
    <App />
  </React.StrictMode>
);

// Run after a short delay to ensure DOM is ready
setTimeout(initCursor, 100);