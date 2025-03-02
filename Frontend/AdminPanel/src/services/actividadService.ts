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

interface Actividad {
  _id?: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  instructorId: string;
  nombreInstructor?: string;
  documentos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const actividadService = {
  // Obtener todas las actividades
  getActividades: async (): Promise<Actividad[]> => {
    try {
      const response = await authAxios.get(`${API_URL}/actividades`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una actividad por ID
  getActividadById: async (id: string): Promise<Actividad> => {
    try {
      const response = await authAxios.get(`${API_URL}/actividades/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva actividad
  createActividad: async (actividadData: Actividad): Promise<Actividad> => {
    try {
      const response = await authAxios.post(`${API_URL}/actividades`, actividadData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una actividad existente
  updateActividad: async (id: string, actividadData: Partial<Actividad>): Promise<Actividad> => {
    try {
      const response = await authAxios.put(`${API_URL}/actividades/${id}`, actividadData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una actividad
  deleteActividad: async (id: string): Promise<void> => {
    try {
      await authAxios.delete(`${API_URL}/actividades/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener actividades por estado
  getActividadesByEstado: async (estado: string): Promise<Actividad[]> => {
    try {
      const response = await authAxios.get(`${API_URL}/actividades/estado/${estado}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener actividades por instructor
  getActividadesByInstructor: async (instructorId: string): Promise<Actividad[]> => {
    try {
      const response = await authAxios.get(`${API_URL}/actividades/instructor/${instructorId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};

export default actividadService;