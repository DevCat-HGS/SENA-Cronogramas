import api from './api';
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/instructores/login', credentials);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/instructores/me');
    return response.data;
  },

  async logout(): Promise<void> {
    // Limpiar el token del localStorage se maneja en el store
  }
}; 