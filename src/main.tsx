import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';

// Adiciona classe .js ao elemento raiz para habilitar as transições de reveal
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
