// Clase personalizada para errores de la API
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Función para capturar errores en funciones async
exports.catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Manejador de errores para controladores
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Errores de desarrollo vs producción
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Error operacional, error confiable: enviar mensaje al cliente
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
      });
    } else {
      // Error de programación o desconocido: no filtrar detalles
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Algo salió mal'
      });
    }
  }
};

exports.AppError = AppError;