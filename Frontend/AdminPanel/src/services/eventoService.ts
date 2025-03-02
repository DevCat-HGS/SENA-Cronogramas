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

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  organizador: string;
  estado: string;
}

const eventoService = {
  getEventos: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/eventos`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEventoById: async (id: string) => {
    try {
      const response = await authAxios.get(`${API_URL}/eventos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createEvento: async (eventoData: Omit<Evento, 'id'>) => {
    try {
      const response = await authAxios.post(`${API_URL}/eventos`, eventoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEvento: async (id: string, eventoData: Partial<Evento>) => {
    try {
      const response = await authAxios.put(`${API_URL}/eventos/${id}`, eventoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEvento: async (id: string) => {
    try {
      const response = await authAxios.delete(`${API_URL}/eventos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default eventoService;