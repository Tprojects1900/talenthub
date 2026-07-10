// Tout en haut de main.jsx (Ligne 1 et 2)
if (typeof globalThis === 'undefined') {
  window.globalThis = window;
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// ... le reste de votre main.jsx actuel
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import DebugConsole from "./pages/DebugConsole";
// 1. Importation du composant HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 2. Ajout du Provider autour de App */}
    <HelmetProvider>
      <App />
      {/* <DebugConsole /> */}
    </HelmetProvider>
  </BrowserRouter>
);