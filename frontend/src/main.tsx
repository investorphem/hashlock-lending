import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// This is crucial: It loads your Tailwind styles and premium base fonts!
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
