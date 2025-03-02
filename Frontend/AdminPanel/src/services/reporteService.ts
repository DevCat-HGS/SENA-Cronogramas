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

interface Reporte {
  id: string;
  instructor: string;
  actividad: string;
  fecha: string;
  estado: string;
  observaciones: string;
}

const reporteService = {
  getReportes: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/reportes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReporteById: async (id: string) => {
    try {
      const response = await authAxios.get(`${API_URL}/reportes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createReporte: async (reporteData: Omit<Reporte, 'id'>) => {
    try {
      const response = await authAxios.post(`${API_URL}/reportes`, reporteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateReporte: async (id: string, reporteData: Partial<Reporte>) => {
    try {
      const response = await authAxios.put(`${API_URL}/reportes/${id}`, reporteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteReporte: async (id: string) => {
    try {
      const response = await authAxios.delete(`${API_URL}/reportes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reporteService;