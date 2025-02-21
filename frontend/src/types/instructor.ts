export { API } from './api';
export type Instructor = API.Instructor;

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

interface ActividadInstructor {
  actividad_id: string;
  numero_ficha: string;
  fecha_inicio: Date;
  fecha_fin: Date;
}

interface EventoInstructor {
  evento_id: string;
  nombre_evento: string;
  fecha_entrega: Date;
  estado: 'pendiente' | 'completado';
} 