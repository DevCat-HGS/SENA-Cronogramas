const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Instructor = require('../models/instructor');

// Middleware to protect routes - verifies the JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token no proporcionado'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin or instructor based on role
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-contraseña');
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado, administrador no encontrado'
        });
      }
      
      if (admin.estado !== 'activo') {
        return res.status(401).json({
          success: false,
          message: 'Cuenta de administrador inactiva o suspendida'
        });
      }
      
      req.user = admin;
      req.user.role = 'admin';
    } else if (decoded.role === 'instructor') {
      const instructor = await Instructor.findById(decoded.id).select('-contraseña');
      
      if (!instructor) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado, instructor no encontrado'
        });
      }
      
      if (instructor.estado !== 'activo') {
        return res.status(401).json({
          success: false,
          message: 'Cuenta de instructor inactiva o suspendida'
        });
      }
      
      req.user = instructor;
      req.user.role = 'instructor';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Rol no válido'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

// Middleware to check if user is admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado, se requieren permisos de administrador'
    });
  }
};

// Middleware to check if user is instructor
exports.instructorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado, se requieren permisos de instructor'
    });
  }
};