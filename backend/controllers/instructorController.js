const Instructor = require('../models/instructor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los instructores
exports.getInstructores = async (req, res) => {
  try {
    const instructores = await Instructor.find().select('-contraseña');
    res.json(instructores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener instructores', error });
  }
};

// Crear nuevo instructor
exports.crearInstructor = async (req, res) => {
  try {
    const { contraseña, ...datos } = req.body;
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);
    
    const instructor = new Instructor({
      ...datos,
      contraseña: contraseñaHash
    });
    
    await instructor.save();
    res.status(201).json({ mensaje: 'Instructor creado exitosamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear instructor', error });
  }
};

// Login de instructor
exports.loginInstructor = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    const instructor = await Instructor.findOne({ correo });
    if (!instructor) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }
    
    const contraseñaValida = await bcrypt.compare(contraseña, instructor.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: instructor._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error });
  }
};

// Obtener un instructor específico
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).select('-contraseña');
    if (!instructor) {
      return res.status(404).json({ mensaje: 'Instructor no encontrado' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener instructor', error });
  }
};

// Actualizar instructor
exports.actualizarInstructor = async (req, res) => {
  try {
    const { contraseña, ...datos } = req.body;
    let actualizacion = { ...datos, ultima_actualizacion: new Date() };

    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      actualizacion.contraseña = await bcrypt.hash(contraseña, salt);
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true }
    ).select('-contraseña');

    if (!instructor) {
      return res.status(404).json({ mensaje: 'Instructor no encontrado' });
    }

    res.json(instructor);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar instructor', error });
  }
};

// Eliminar instructor
exports.eliminarInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ mensaje: 'Instructor no encontrado' });
    }
    res.json({ mensaje: 'Instructor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar instructor', error });
  }
}; 