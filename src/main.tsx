import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { QueryProvider } from './contexts/QueryProvider';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <QueryProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </QueryProvider>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
