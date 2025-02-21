const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nombre_evento: {
    type: String,
    required: [true, 'El nombre del evento es requerido']
  },
  descripcion: String,
  tipo: {
    type: String,
    enum: ['reunion', 'entrega', 'capacitacion'],
    required: true
  },
  fecha_evento: {
    type: Date,
    required: true
  },
  fecha_entrega: Date,
  estado: {
    type: String,
    enum: ['programado', 'en_curso', 'completado'],
    default: 'programado'
  },
  participantes: [{
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    },
    nombre_completo: String,
    estado_participacion: {
      type: String,
      enum: ['pendiente', 'confirmado', 'completado'],
      default: 'pendiente'
    }
  }]
});

module.exports = mongoose.model('Evento', eventoSchema); 