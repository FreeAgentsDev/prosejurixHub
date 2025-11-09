import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './components/common/NotificationProvider';
import { ConfirmProvider } from './components/common/ConfirmProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfirmProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ConfirmProvider>
  </StrictMode>
);
