const Actividad = require('../models/actividad');

// Obtener todas las actividades
exports.getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener actividades', error });
  }
};

// Obtener una actividad específica
exports.getActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) {
      return res.status(404).json({ mensaje: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener actividad', error });
  }
};

// Crear actividad
exports.crearActividad = async (req, res) => {
  try {
    const actividad = new Actividad(req.body);
    await actividad.save();
    res.status(201).json(actividad);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear actividad', error });
  }
};

// Actualizar actividad
exports.actualizarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actividad) {
      return res.status(404).json({ mensaje: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar actividad', error });
  }
};

// Eliminar actividad
exports.eliminarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);
    if (!actividad) {
      return res.status(404).json({ mensaje: 'Actividad no encontrada' });
    }
    res.json({ mensaje: 'Actividad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar actividad', error });
  }
}; 