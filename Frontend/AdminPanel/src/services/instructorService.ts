import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api';

// Configuración para incluir el token en las solicitudes
const authAxios = axios.create();

// Interceptor para agregar el token a todas las solicitudes
authAxios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Instructor {
  _id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaRegistro?: Date;
}

const instructorService = {
  // Obtener todos los instructores
  getInstructors: async (): Promise<Instructor[]> => {
    try {
      const response = await authAxios.get(`${API_URL}/instructors`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un instructor por ID
  getInstructorById: async (id: string): Promise<Instructor> => {
    try {
      const response = await authAxios.get(`${API_URL}/instructors/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo instructor
  createInstructor: async (instructorData: Instructor): Promise<Instructor> => {
    try {
      const response = await authAxios.post(`${API_URL}/instructors`, instructorData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un instructor existente
  updateInstructor: async (id: string, instructorData: Partial<Instructor>): Promise<Instructor> => {
    try {
      const response = await authAxios.put(`${API_URL}/instructors/${id}`, instructorData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un instructor
  deleteInstructor: async (id: string): Promise<void> => {
    try {
      await authAxios.delete(`${API_URL}/instructors/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener solicitudes de instructores pendientes
  getPendingRequests: async (): Promise<Instructor[]> => {
    try {
      const response = await authAxios.get(`${API_URL}/instructor-requests`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Aprobar una solicitud de instructor
  approveRequest: async (id: string): Promise<Instructor> => {
    try {
      const response = await authAxios.put(`${API_URL}/instructor-requests/${id}/approve`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechazar una solicitud de instructor
  rejectRequest: async (id: string): Promise<void> => {
    try {
      await authAxios.put(`${API_URL}/instructor-requests/${id}/reject`);
    } catch (error) {
      throw error;
    }
  }
};

export default instructorService;