// 1. Le patch de sécurité pour l'iPad tout en haut
if (typeof globalThis === 'undefined') {
  window.globalThis = window;
}

// 2. Les imports uniques (sans doublons)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';

// 3. Importation du composant HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);