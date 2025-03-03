const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nombre_evento: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  fecha_evento: {
    type: Date,
    required: true,
    index: true
  },
  fecha_entrega: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['programado', 'en_curso', 'completado', 'cancelado'],
    default: 'programado',
    index: true
  },
  participantes: [{
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    },
    nombre_completo: String,
    estado_participacion: {
      type: String,
      enum: ['pendiente', 'confirmado', 'rechazado'],
      default: 'pendiente'
    },
    fecha_respuesta: Date
  }],
  creado_por: {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    nombre_completo: String
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  ultima_actualizacion: {
    type: Date,
    default: Date.now
  },
  recordatorios_enviados: [{
    fecha_envio: Date,
    tipo_recordatorio: String
  }]
});

// Crear índices para búsquedas frecuentes
eventoSchema.index({ fecha_evento: 1 });
eventoSchema.index({ estado: 1 });
eventoSchema.index({ 'participantes.instructor_id': 1 });

module.exports = mongoose.model('Evento', eventoSchema);