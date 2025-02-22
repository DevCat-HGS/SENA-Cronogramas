// Tipos para las respuestas de la API
export namespace API {
  export type {
    Response,
    PaginatedResponse,
    ErrorResponse,
    Instructor,
    Actividad,
    LoginResponse,
  };

  interface Response<T = unknown> {
    data: T;
    message?: string;
    status: number;
  }

  interface PaginatedResponse<T> extends Response<T> {
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }

  interface ErrorResponse {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }

  // Tipos específicos de tu API
  declare namespace API {
    interface Instructor {
      _id: string;
      nombre: string;
      apellido: string;
      no_documento_identidad: string;
      email: string;
      telefono: string;
      especialidad: string;
      tipo_contrato: 'planta' | 'contratista';
      estado: 'activo' | 'inactivo';
      created_at?: string;
      updated_at?: string;
    }
  }
  interface Instructor {
    _id: string;
    nombre: string;
    apellido: string;
    correo: string;
    no_documento_identidad: string;
    estado: 'activo' | 'inactivo';
    createdAt: string;
    updatedAt: string;
    fecha_registro?: string;
    ultima_actualizacion?: string;
    actividades_actuales?: number;
    eventos_pendientes?: number;
  }

  interface Actividad {
    _id: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    estado: 'pendiente' | 'en_progreso' | 'completada';
    instructor: string | Instructor;
    createdAt: string;
    updatedAt: string;
  }

  interface LoginResponse {
    token: string;
    user: Instructor;
  }
}