import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface LoginCredentials {
  usuario: string;
  contraseña: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
    role: string;
  };
}

interface RegisterData {
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/admin/register`, {
        usuario: data.usuario,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        contraseña: data.contraseña
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user'); // Remove invalid data
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;