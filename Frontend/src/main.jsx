import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Filter out browser extension warnings
if (import.meta.env.DEV) {
  // Store original console methods
  const originalConsoleWarn = console.warn;
  
  // Replace console.warn to filter specific messages
  console.warn = function(message, ...args) {
    // Skip logging specific warnings
    if (typeof message === 'string' && (
      message.includes('-ms-high-contrast') ||
      message.includes('quillbot-content.js')
    )) {
      return;
    }
    
    // Pass through to original warn method
    originalConsoleWarn.apply(console, [message, ...args]);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
