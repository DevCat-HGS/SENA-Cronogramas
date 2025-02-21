export interface Actividad {
  _id: string;
  numero_ficha: string;
  programa_formacion: string;
  fase_proyecto: string;
  actividad_desarrollar: string;
  competencia_desarrollar: string;
  resultados_aprendizaje: string[];
  ambiente_aprendizaje: {
    tipo: 'virtual' | 'presencial';
    ubicacion: string;
    capacidad: number;
  };
  jornada: 'Mañana' | 'Tarde' | 'Noche';
  horario: {
    fecha_inicio: Date;
    fecha_fin: Date;
    hora_inicio: string;
    hora_fin: string;
    horas_diarias: number;
    total_horas: number;
  };
  estado: 'activa' | 'completada' | 'cancelada';
  instructores: {
    instructor_id: string;
    nombre_completo: string;
  }[];
} 