import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Tablero from "./tablero.jsx";
import "./tablero.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Tablero />
  </StrictMode>,
)
