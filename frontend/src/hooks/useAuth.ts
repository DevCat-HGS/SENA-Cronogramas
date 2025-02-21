import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { LoginCredentials } from '@/types/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser, logout: logoutStore } = useAuthStore();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { token } = await authService.login(credentials);
      setToken(token);
      
      // Obtener información del usuario
      const user = await authService.getCurrentUser();
      setUser(user);
      
      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Credenciales inválidas');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
    router.push('/login');
    toast.success('Sesión cerrada');
  };

  return {
    login,
    logout,
    isLoading
  };
}; 