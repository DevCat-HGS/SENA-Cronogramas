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
    dias_habiles: Number
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
      ref: 'Actividad'
    },
    numero_ficha: String,
    horas_ejecutadas: Number,
    observaciones: String
  }],
  estado: {
    type: String,
    enum: ['borrador', 'enviado', 'aprobado'],
    default: 'borrador'
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_envio: Date,
  fecha_aprobacion: Date
});

module.exports = mongoose.model('Reporte', reporteSchema); 