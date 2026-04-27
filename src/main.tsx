// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './index.css';

import { Dashboard } from './pages/Dashboard';
import { LoginView } from './features/auth/components/LoginView';
import { AuthCallback } from './features/auth/components/AuthCallback';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root container missing in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <Theme appearance="dark" radius="none" scaling="95%" grayColor="zinc">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Theme>
  </StrictMode>
);