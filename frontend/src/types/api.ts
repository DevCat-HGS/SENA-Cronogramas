export namespace API {
  export interface Response<T> {
    data: T;
    message?: string;
    status: number;
  }

  export interface Instructor {
    _id: string;
    nombre: string;
    apellido: string;
    no_documento_identidad: string;
    correo: string;
    estado: 'activo' | 'inactivo';
    fecha_registro: Date;
    ultima_actualizacion: Date;
    actividades_actuales: ActividadInstructor[];
    eventos_pendientes: EventoInstructor[];
  }

  export interface ActividadInstructor {
    actividad_id: string;
    numero_ficha: string;
    fecha_inicio: Date;
    fecha_fin: Date;
  }

  export interface EventoInstructor {
    evento_id: string;
    nombre_evento: string;
    fecha_entrega: Date;
    estado: 'pendiente' | 'completado';
  }
}
