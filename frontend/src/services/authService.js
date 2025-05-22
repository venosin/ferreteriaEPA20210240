// Servicio para manejar la autenticación de usuarios
import api from './api';

const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('userInfo') !== null;
  },

  // Guardar información del usuario en localStorage
  setUserInfo: (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },

  // Obtener información del usuario desde localStorage
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Eliminar información del usuario de localStorage
  clearUserInfo: () => {
    localStorage.removeItem('userInfo');
  }
};

export default authService;
