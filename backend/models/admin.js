const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
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
  nivel_acceso: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  permisos: [{
    type: String,
    enum: [
      'gestionar_instructores',
      'gestionar_actividades',
      'gestionar_reportes',
      'gestionar_eventos',
      'configuracion_sistema'
    ]
  }],
  ultimo_acceso: {
    type: Date,
    default: Date.now
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  historial_acciones: [{
    accion: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    detalles: mongoose.Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('Admin', adminSchema);