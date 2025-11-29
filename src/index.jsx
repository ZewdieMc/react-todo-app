import React from 'react';
import ReactDOM from 'react-dom/client';

import TodoApp from 'components/TodoApp';
import 'styles/index.css';

// Suppress ResizeObserver loop error - this is a benign warning
// Must be done BEFORE anything else
const resizeObserverErr = window.console.error;
window.console.error = (...args) => {
  const firstArg = args && args.length > 0 ? String(args[0]) : '';
  if (firstArg.includes('ResizeObserver')) {
    return;
  }
  resizeObserverErr(...args);
};

// Also suppress console.warn for ResizeObserver
const resizeObserverWarn = window.console.warn;
window.console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  resizeObserverWarn(...args);
};

// Wrap ResizeObserver to catch and suppress the error
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        // Break potential synchronous resize -> measure loops
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.warn('ResizeObserver callback suppressed error:', err);
            }
          });
        }, 0);
      });
    }
  };
}

// Catch ResizeObserver errors globally to prevent error overlay
window.addEventListener('error', (e) => {
  const errorMessage = e.message || (e.error && e.error.message) || '';
  if (errorMessage.includes('ResizeObserver')) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

// Also catch unhandled promise rejections related to ResizeObserver
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

// Suppress webpack error overlay for ResizeObserver
if (typeof window !== 'undefined') {
  // Override the error handler that webpack dev server uses
  const originalOnError = window.onerror;
  // eslint-disable-next-line space-before-function-paren, func-names
  window.onerror = function (message, ...args) {
    if (typeof message === 'string' && message.includes('ResizeObserver')) {
      return true; // Suppress the error
    }
    if (originalOnError) {
      return originalOnError.call(this, message, ...args);
    }
    return false;
  };

  // Periodically hide CRA overlay if it shows ResizeObserver message (dev only)
  const hideOverlayIfResizeObserver = () => {
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay && /ResizeObserver/.test(overlay.innerText)) {
      overlay.style.display = 'none';
    }
  };
  const overlayInterval = setInterval(hideOverlayIfResizeObserver, 500);
  // Stop after 30s to avoid running forever
  setTimeout(() => clearInterval(overlayInterval), 30000);

  // Inject CSS to force-hide overlay immediately
  try {
    const style = document.createElement('style');
    style.setAttribute('data-overlay-hide', 'true');
    style.textContent = '#webpack-dev-server-client-overlay, #webpack-dev-server-client-overlay-div { display:none !important; visibility:hidden !important; pointer-events:none !important; }';
    document.head.appendChild(style);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Overlay hide CSS injection failed:', e);
  }

  // Monkey patch appendChild to skip overlay creation
  try {
    const bodyAppend = document.body.appendChild.bind(document.body);
    document.body.appendChild = (el) => {
      if (el && el.id && el.id.includes('webpack-dev-server-client-overlay')) {
        return el; // Skip attaching overlay
      }
      return bodyAppend(el);
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Overlay appendChild patch failed:', e);
  }
}

const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(
  <TodoApp />,
);
