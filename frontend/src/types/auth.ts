export interface LoginCredentials {
  correo: string;
  contraseña: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  estado: 'activo' | 'inactivo';
} 