const rateLimit = require('express-rate-limit');

// Limitador básico para todas las rutas
exports.basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana
  standardHeaders: true, // Devolver info de límite en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar los headers `X-RateLimit-*`
  message: {
    success: false,
    message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde'
  }
});

// Limitador más estricto para rutas de autenticación
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limitar cada IP a 10 intentos de login por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión, por favor intente de nuevo más tarde'
  }
});