const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  periodo: {
    mes: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    año: {
      type: Number,
      required: true
    },
    dias_habiles: {
      type: Number,
      required: true
    }
  },
  instructor: {
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true
    },
    nombre_completo: String
  },
  actividades: [{
    actividad_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActividadFormacion'
    },
    numero_ficha: String,
    programa_formacion: String,
    horas_ejecutadas: Number,
    observaciones: String
  }],
  estado: {
    type: String,
    enum: ['borrador', 'enviado', 'aprobado', 'rechazado'],
    default: 'borrador'
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_envio: {
    type: Date
  },
  fecha_aprobacion: {
    type: Date
  },
  comentarios_admin: String
});

// Crear índices para búsquedas frecuentes
reporteSchema.index({ 'periodo.mes': 1, 'periodo.año': 1 });
reporteSchema.index({ 'instructor.instructor_id': 1 });
reporteSchema.index({ 'estado': 1 });

module.exports = mongoose.model('Reporte', reporteSchema);