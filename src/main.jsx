import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';

// 1. Importation du composant HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 2. Ajout du Provider autour de App */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);