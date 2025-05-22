// Servicio para manejar las operaciones relacionadas con clientes
import api from './api';

const clientService = {
  // Obtener todos los clientes
  getAll: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  // Obtener un cliente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo cliente
  create: async (clientData) => {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  // Actualizar un cliente existente
  update: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el cliente con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un cliente
  delete: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el cliente con ID ${id}:`, error);
      throw error;
    }
  }
};

export default clientService;
