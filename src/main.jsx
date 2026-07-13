import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom/client"; // On revient à l'import standard
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
// On garde la syntaxe officielle propre à ta version de React
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);