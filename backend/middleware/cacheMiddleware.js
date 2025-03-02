const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // TTL de 5 minutos

exports.cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Solo cachear solicitudes GET
    if (req.method !== 'GET') {
      return next();
    }

    // Crear una clave única para la solicitud
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      // Capturar la respuesta original
      const originalSend = res.send;
      res.send = function(body) {
        // Solo cachear respuestas exitosas
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(key, body, duration);
        }
        originalSend.call(this, body);
      };
      next();
    }
  };
};

// Limpiar caché para rutas específicas
exports.clearCache = (route) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(route)) {
      cache.del(key);
    }
  });
};