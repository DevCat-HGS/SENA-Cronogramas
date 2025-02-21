const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido']
  },
  no_documento_identidad: {
    type: String,
    required: [true, 'El número de documento es requerido'],
    unique: true
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
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
      ref: 'Actividad'
    },
    numero_ficha: String,
    fecha_inicio: Date,
    fecha_fin: Date
  }],
  eventos_pendientes: [{
    evento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento'
    },
    nombre_evento: String,
    fecha_entrega: Date,
    estado: {
      type: String,
      enum: ['pendiente', 'completado']
    }
  }]
});

module.exports = mongoose.model('Instructor', instructorSchema); 