const Reporte = require('../models/reporte');
const Instructor = require('../models/instructor');

// @desc    Create a new report
// @route   POST /api/reportes
// @access  Private (Instructor only)
exports.createReporte = async (req, res) => {
  try {
    const reporte = await Reporte.create({
      ...req.body,
      instructor: {
        instructor_id: req.user.id,
        nombre_completo: `${req.user.nombre} ${req.user.apellido}`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el reporte',
      error: error.message
    });
  }
};

// @desc    Get all reports (admin only)
// @route   GET /api/reportes
// @access  Private (Admin only)
exports.getAllReportes = async (req, res) => {
  try {
    const { mes, año, estado } = req.query;
    const filter = {};

    if (mes && año) {
      filter['periodo.mes'] = parseInt(mes);
      filter['periodo.año'] = parseInt(año);
    }
    if (estado) filter.estado = estado;

    const reportes = await Reporte.find(filter)
      .populate('instructor.instructor_id', 'nombre apellido')
      .sort({ fecha_creacion: -1 });

    res.status(200).json({
      success: true,
      count: reportes.length,
      data: reportes
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes',
      error: error.message
    });
  }
};

// @desc    Get instructor's own reports
// @route   GET /api/reportes/mis-reportes
// @access  Private (Instructor only)
exports.getMisReportes = async (req, res) => {
  try {
    const reportes = await Reporte.find({
      'instructor.instructor_id': req.user.id
    }).sort({ fecha_creacion: -1 });

    res.status(200).json({
      success: true,
      count: reportes.length,
      data: reportes
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes',
      error: error.message
    });
  }
};

// @desc    Get report by ID
// @route   GET /api/reportes/:id
// @access  Private
exports.getReporteById = async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id)
      .populate('instructor.instructor_id', 'nombre apellido');

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar que el usuario tenga acceso al reporte
    if (req.user.role !== 'admin' && 
        reporte.instructor.instructor_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este reporte'
      });
    }

    res.status(200).json({
      success: true,
      data: reporte
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el reporte',
      error: error.message
    });
  }
};

// @desc    Update report
// @route   PUT /api/reportes/:id
// @access  Private (Instructor only)
exports.updateReporte = async (req, res) => {
  try {
    let reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar que el instructor sea el dueño del reporte
    if (reporte.instructor.instructor_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este reporte'
      });
    }

    // Verificar que el reporte esté en estado borrador
    if (reporte.estado !== 'borrador') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden actualizar reportes en estado borrador'
      });
    }

    reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ultima_actualizacion: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reporte actualizado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el reporte',
      error: error.message
    });
  }
};

// @desc    Submit report for approval
// @route   PUT /api/reportes/:id/enviar
// @access  Private (Instructor only)
exports.enviarReporte = async (req, res) => {
  try {
    let reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar que el instructor sea el dueño del reporte
    if (reporte.instructor.instructor_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para enviar este reporte'
      });
    }

    // Verificar que el reporte esté en estado borrador
    if (reporte.estado !== 'borrador') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden enviar reportes en estado borrador'
      });
    }

    reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      {
        estado: 'enviado',
        fecha_envio: Date.now()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reporte enviado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al enviar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el reporte',
      error: error.message
    });
  }
};

// @desc    Approve report
// @route   PUT /api/reportes/:id/aprobar
// @access  Private (Admin only)
exports.aprobarReporte = async (req, res) => {
  try {
    let reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar que el reporte esté en estado enviado
    if (reporte.estado !== 'enviado') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden aprobar reportes enviados'
      });
    }

    reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      {
        estado: 'aprobado',
        fecha_aprobacion: Date.now(),
        comentarios_admin: req.body.comentarios || ''
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reporte aprobado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al aprobar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar el reporte',
      error: error.message
    });
  }
};

// @desc    Reject report
// @route   PUT /api/reportes/:id/rechazar
// @access  Private (Admin only)
exports.rechazarReporte = async (req, res) => {
  try {
    if (!req.body.comentarios) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar comentarios para el rechazo'
      });
    }

    let reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar que el reporte esté en estado enviado
    if (reporte.estado !== 'enviado') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden rechazar reportes enviados'
      });
    }

    reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      {
        estado: 'rechazado',
        comentarios_admin: req.body.comentarios
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reporte rechazado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al rechazar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar el reporte',
      error: error.message
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reportes/:id
// @access  Private (Admin only)
exports.deleteReporte = async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    await reporte.remove();

    res.status(200).json({
      success: true,
      message: 'Reporte eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el reporte',
      error: error.message
    });
  }
};