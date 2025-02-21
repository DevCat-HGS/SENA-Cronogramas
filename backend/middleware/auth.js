const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.instructor = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

module.exports = auth; 