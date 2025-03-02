const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Configuración de seguridad
exports.setupSecurity = (app) => {
  // Establecer headers de seguridad
  app.use(helmet());

  // Sanitización contra XSS
  app.use(xss());

  // Sanitización contra inyección NoSQL
  app.use(mongoSanitize());

  // Prevenir polución de parámetros HTTP
  app.use(hpp({
    whitelist: [
      'estado', 'tipo', 'fecha_desde', 'fecha_hasta', 'mes', 'año'
    ]
  }));
};