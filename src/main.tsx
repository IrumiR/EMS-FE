
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PrimeReactProvider } from 'primereact/api';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
      <App />
      </PrimeReactProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
