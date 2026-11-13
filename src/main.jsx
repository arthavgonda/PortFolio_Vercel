import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/gsap.js'; // registers GSAP plugins before any component runs
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
