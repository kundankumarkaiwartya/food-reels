import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  if (config.url?.startsWith('http://localhost:3000')) {
    config.url = config.url.replace('http://localhost:3000', apiBaseUrl);
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
