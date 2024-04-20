/**
 * Entry point for rendering the React application.
 * @module index
 * @author Oleksandr Turytsia
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import "./index.css"
import "leaflet/dist/leaflet.css"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App />
);

