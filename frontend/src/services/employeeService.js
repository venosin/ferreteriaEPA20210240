// Servicio para manejar las operaciones relacionadas con empleados
import api from './api';

const employeeService = {
  // Obtener todos los empleados
  getAll: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },

  // Obtener un empleado por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el empleado con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo empleado
  create: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  },

  // Actualizar un empleado existente
  update: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el empleado con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un empleado
  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el empleado con ID ${id}:`, error);
      throw error;
    }
  }
};

export default employeeService;
