import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  nombre: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (usuario: string, contraseña: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la aplicación
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (usuario: string, contraseña: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ usuario, contraseña });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar al administrador');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};