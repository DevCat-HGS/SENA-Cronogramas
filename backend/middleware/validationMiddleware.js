const { validationResult, check } = require('express-validator');

// Middleware para manejar errores de validación
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para instructores
exports.instructorValidationRules = {
  register: [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('no_documento_identidad', 'El documento de identidad es obligatorio').notEmpty(),
    check('correo', 'Por favor incluya un correo válido').isEmail(),
    check('contraseña', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  login: [
    check('correo', 'Por favor incluya un correo válido').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').exists()
  ]
};

// Validaciones para eventos
exports.eventoValidationRules = {
  create: [
    check('nombre_evento', 'El nombre del evento es obligatorio').notEmpty(),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('tipo', 'El tipo de evento es obligatorio').notEmpty(),
    check('fecha_evento', 'La fecha del evento es obligatoria').isISO8601(),
    check('fecha_entrega', 'La fecha de entrega es obligatoria').isISO8601()
  ]
};

// Más validaciones según necesites...