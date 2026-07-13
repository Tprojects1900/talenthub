if (typeof globalThis === 'undefined') {
  window.globalThis = window;
}

alert("A");

import React from "react";

alert("B");

import ReactDOM from "react-dom/client";

alert("C");

import "./index.css";

alert("D");

import App from "./App";

alert("E");
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
alert("TOPFOOT")
// On garde la syntaxe officielle propre à ta version de React
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);