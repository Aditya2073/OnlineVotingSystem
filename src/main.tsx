import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill global for browser environment
// This prevents crypto/bcrypt related errors in the browser
if (typeof window !== 'undefined') {
  // Apply polyfill for client-side
  window.global = window;
  
  // Ensure mongoose is defined on the global object
  if (!window.mongoose) {
    window.mongoose = { conn: null, promise: null };
  }
}

createRoot(document.getElementById("root")!).render(<App />);
