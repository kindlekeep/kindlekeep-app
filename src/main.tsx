import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import { App } from './App';
import '@radix-ui/themes/styles.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="blue" radius="none">
      <QueryClientProvider client={queryClient}>
        <div style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          <App />
        </div>
      </QueryClientProvider>
    </Theme>
  </StrictMode>
);