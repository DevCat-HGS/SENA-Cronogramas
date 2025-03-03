const mongoose = require('mongoose');

const actividadFormacionSchema = new mongoose.Schema({
  numero_ficha: {
    type: String,
    required: true,
    index: true
  },
  programa_formacion: {
    type: String,
    required: true
  },
  fase_proyecto: {
    type: String,
    required: true
  },
  actividad_desarrollar: {
    type: String,
    required: true
  },
  competencia_desarrollar: {
    type: String,
    required: true
  },
  resultados_aprendizaje: [{
    type: String,
    required: true
  }],
  ambiente_aprendizaje: {
    tipo: {
      type: String,
      required: true
    },
    ubicacion: {
      type: String,
      required: true
    },
    capacidad: {
      type: Number,
      required: true
    }
  },
  jornada: {
    type: String,
    required: true
  },
  horario: {
    fecha_inicio: {
      type: Date,
      required: true
    },
    fecha_fin: {
      type: Date,
      required: true
    },
    hora_inicio: {
      type: String,
      required: true
    },
    hora_fin: {
      type: String,
      required: true
    },
    horas_diarias: {
      type: Number,
      required: true
    },
    total_horas: {
      type: Number,
      required: true
    }
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'completada'],
    default: 'activa'
  },
  instructores: [{
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true
    },
    nombre_completo: String
  }],
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  ultima_actualizacion: {
    type: Date,
    default: Date.now
  }
});

// Crear índices compuestos para el horario
actividadFormacionSchema.index({ 'horario.fecha_inicio': 1, 'horario.fecha_fin': 1 });

module.exports = mongoose.model('ActividadFormacion', actividadFormacionSchema);