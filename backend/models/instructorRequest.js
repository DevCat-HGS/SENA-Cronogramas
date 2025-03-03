const mongoose = require('mongoose');

const instructorRequestSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  no_documento_identidad: {
    type: String,
    required: true,
    unique: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  },
  estado_solicitud: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  fecha_solicitud: {
    type: Date,
    default: Date.now
  },
  fecha_revision: {
    type: Date
  },
  admin_revisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  motivo_rechazo: {
    type: String
  }
});

module.exports = mongoose.model('InstructorRequest', instructorRequestSchema);