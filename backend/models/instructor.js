const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
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
  contraseña: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultima_actualizacion: {
    type: Date,
    default: Date.now
  },
  actividades_actuales: [{
    actividad_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActividadFormacion'
    },
    numero_ficha: String,
    programa_formacion: String,
    fecha_inicio: Date,
    fecha_fin: Date
  }],
  eventos_pendientes: [{
    evento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento'
    },
    nombre_evento: String,
    fecha_evento: Date,
    estado: String
  }]
});

module.exports = mongoose.model('Instructor', instructorSchema);