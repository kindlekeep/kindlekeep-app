import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "@radix-ui/themes/styles.css";
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="blue" grayColor="zinc" radius="none" scaling="95%" appearance="dark">
        <App />
      </Theme>
    </QueryClientProvider>
  </React.StrictMode>,
)