const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  numero_ficha: {
    type: String,
    required: [true, 'El número de ficha es requerido']
  },
  programa_formacion: {
    type: String,
    required: [true, 'El programa de formación es requerido']
  },
  fase_proyecto: String,
  actividad_desarrollar: {
    type: String,
    required: [true, 'La actividad a desarrollar es requerida']
  },
  competencia_desarrollar: String,
  resultados_aprendizaje: [String],
  ambiente_aprendizaje: {
    tipo: {
      type: String,
      enum: ['virtual', 'presencial'],
      required: true
    },
    ubicacion: String,
    capacidad: Number
  },
  jornada: {
    type: String,
    enum: ['Mañana', 'Tarde', 'Noche'],
    required: true
  },
  horario: {
    fecha_inicio: Date,
    fecha_fin: Date,
    hora_inicio: String,
    hora_fin: String,
    horas_diarias: Number,
    total_horas: Number
  },
  estado: {
    type: String,
    enum: ['activa', 'completada', 'cancelada'],
    default: 'activa'
  },
  instructores: [{
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    },
    nombre_completo: String
  }]
});

module.exports = mongoose.model('Actividad', actividadSchema); 