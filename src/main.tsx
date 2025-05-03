
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-teal/theme.css";
import 'primereact/resources/primereact.min.css'

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
