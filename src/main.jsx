import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/main.css'
import './styles/dark.css'
import './styles/reader.css'

// El basename debe coincidir con el "base" configurado en vite.config.js
// para que las rutas funcionen correctamente en GitHub Pages.
const BASENAME = import.meta.env.BASE_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
