const ActividadFormacion = require('../models/actividadFormacion');
const Instructor = require('../models/instructor');

// @desc    Create a new training activity
// @route   POST /api/actividades
// @access  Private (Admin only)
exports.createActividad = async (req, res) => {
  try {
    const actividad = await ActividadFormacion.create(req.body);

    // Update instructors' activities
    if (req.body.instructores && req.body.instructores.length > 0) {
      const actividadInfo = {
        actividad_id: actividad._id,
        numero_ficha: actividad.numero_ficha,
        programa_formacion: actividad.programa_formacion,
        fecha_inicio: actividad.horario.fecha_inicio,
        fecha_fin: actividad.horario.fecha_fin
      };

      await Promise.all(req.body.instructores.map(instructor => {
        return Instructor.findByIdAndUpdate(
          instructor.instructor_id,
          {
            $push: { actividades_actuales: actividadInfo },
            $set: { ultima_actualizacion: Date.now() }
          }
        );
      }));
    }

    res.status(201).json({
      success: true,
      message: 'Actividad de formación creada exitosamente',
      data: actividad
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la actividad de formación',
      error: error.message
    });
  }
};

// @desc    Get all training activities
// @route   GET /api/actividades
// @access  Private
exports.getAllActividades = async (req, res) => {
  try {
    const { estado, programa_formacion, fase_proyecto } = req.query;
    const filter = {};

    if (estado) filter.estado = estado;
    if (programa_formacion) filter.programa_formacion = programa_formacion;
    if (fase_proyecto) filter.fase_proyecto = fase_proyecto;

    const actividades = await ActividadFormacion.find(filter)
      .populate('instructores.instructor_id', 'nombre apellido')
      .sort({ fecha_creacion: -1 });

    res.status(200).json({
      success: true,
      count: actividades.length,
      data: actividades
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las actividades de formación',
      error: error.message
    });
  }
};

// @desc    Get training activity by ID
// @route   GET /api/actividades/:id
// @access  Private
exports.getActividadById = async (req, res) => {
  try {
    const actividad = await ActividadFormacion.findById(req.params.id)
      .populate('instructores.instructor_id', 'nombre apellido');

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad de formación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: actividad
    });
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la actividad de formación',
      error: error.message
    });
  }
};

// @desc    Update training activity
// @route   PUT /api/actividades/:id
// @access  Private (Admin only)
exports.updateActividad = async (req, res) => {
  try {
    const actividad = await ActividadFormacion.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad de formación no encontrada'
      });
    }

    // Update the activity
    const updatedActividad = await ActividadFormacion.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ultima_actualizacion: Date.now() },
      { new: true, runValidators: true }
    );

    // Update instructors' activities if instructors changed
    if (req.body.instructores) {
      // Remove activity from old instructors
      await Instructor.updateMany(
        { 'actividades_actuales.actividad_id': actividad._id },
        { 
          $pull: { actividades_actuales: { actividad_id: actividad._id } },
          $set: { ultima_actualizacion: Date.now() }
        }
      );

      // Add activity to new instructors
      if (req.body.instructores.length > 0) {
        const actividadInfo = {
          actividad_id: actividad._id,
          numero_ficha: updatedActividad.numero_ficha,
          programa_formacion: updatedActividad.programa_formacion,
          fecha_inicio: updatedActividad.horario.fecha_inicio,
          fecha_fin: updatedActividad.horario.fecha_fin
        };

        await Promise.all(req.body.instructores.map(instructor => {
          return Instructor.findByIdAndUpdate(
            instructor.instructor_id,
            {
              $push: { actividades_actuales: actividadInfo },
              $set: { ultima_actualizacion: Date.now() }
            }
          );
        }));
      }
    }

    res.status(200).json({
      success: true,
      message: 'Actividad de formación actualizada exitosamente',
      data: updatedActividad
    });
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la actividad de formación',
      error: error.message
    });
  }
};

// @desc    Delete training activity
// @route   DELETE /api/actividades/:id
// @access  Private (Admin only)
exports.deleteActividad = async (req, res) => {
  try {
    const actividad = await ActividadFormacion.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad de formación no encontrada'
      });
    }

    // Remove activity from all instructors
    await Instructor.updateMany(
      { 'actividades_actuales.actividad_id': actividad._id },
      { 
        $pull: { actividades_actuales: { actividad_id: actividad._id } },
        $set: { ultima_actualizacion: Date.now() }
      }
    );

    // Delete the activity
    await actividad.remove();

    res.status(200).json({
      success: true,
      message: 'Actividad de formación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la actividad de formación',
      error: error.message
    });
  }
};