import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
const rootInstance = createRoot(root);

rootInstance.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
