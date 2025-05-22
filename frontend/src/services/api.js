// Servicio para realizar peticiones HTTP al backend
import axios from 'axios';

// Creamos una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Para enviar cookies en solicitudes cross-origin
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
