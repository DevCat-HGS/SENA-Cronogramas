const Instructor = require('../models/instructor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Authenticate instructor
// @route   POST /api/instructors/login
// @access  Public
exports.loginInstructor = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Check for instructor email
    const instructor = await Instructor.findOne({ correo });

    if (!instructor) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Check if instructor is active
    if (instructor.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(contraseña, instructor.contraseña);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: instructor._id, role: 'instructor' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update last access
    instructor.ultima_actualizacion = Date.now();
    await instructor.save();

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      data: {
        id: instructor._id,
        nombre: instructor.nombre,
        apellido: instructor.apellido,
        correo: instructor.correo
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Get instructor profile
// @route   GET /api/instructors/profile
// @access  Private (instructor only)
exports.getInstructorProfile = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id).select('-contraseña');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// @desc    Update instructor profile
// @route   PUT /api/instructors/profile
// @access  Private (instructor only)
exports.updateInstructorProfile = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña } = req.body;
    const instructorId = req.user.id;

    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor no encontrado'
      });
    }

    // Update fields
    if (nombre) instructor.nombre = nombre;
    if (apellido) instructor.apellido = apellido;
    if (correo) {
      // Check if email is already in use by another instructor
      const emailExists = await Instructor.findOne({ correo, _id: { $ne: instructorId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está en uso'
        });
      }
      instructor.correo = correo;
    }

    // Update password if provided
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      instructor.contraseña = await bcrypt.hash(contraseña, salt);
    }

    instructor.ultima_actualizacion = Date.now();

    const updatedInstructor = await instructor.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: updatedInstructor._id,
        nombre: updatedInstructor.nombre,
        apellido: updatedInstructor.apellido,
        correo: updatedInstructor.correo
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

// @desc    Get instructor's current activities
// @route   GET /api/instructors/activities
// @access  Private (instructor only)
exports.getInstructorActivities = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id)
      .select('actividades_actuales')
      .populate('actividades_actuales.actividad_id');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      count: instructor.actividades_actuales.length,
      data: instructor.actividades_actuales
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener actividades',
      error: error.message
    });
  }
};

// @desc    Get instructor's pending events
// @route   GET /api/instructors/events
// @access  Private (instructor only)
exports.getInstructorEvents = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id)
      .select('eventos_pendientes')
      .populate('eventos_pendientes.evento_id');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      count: instructor.eventos_pendientes.length,
      data: instructor.eventos_pendientes
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};

// @desc    Respond to event invitation
// @route   PUT /api/instructors/events/:eventId/respond
// @access  Private (instructor only)
exports.respondToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { respuesta } = req.body; // 'confirmado' or 'rechazado'
    const instructorId = req.user.id;

    if (!['confirmado', 'rechazado'].includes(respuesta)) {
      return res.status(400).json({
        success: false,
        message: 'Respuesta inválida. Debe ser "confirmado" o "rechazado"'
      });
    }

    // Find the event and update the instructor's participation status
    const evento = await mongoose.model('Evento').findById(eventId);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Find the instructor in the event's participants
    const participanteIndex = evento.participantes.findIndex(
      p => p.instructor_id.toString() === instructorId
    );

    if (participanteIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'No estás invitado a este evento'
      });
    }

    // Update participation status
    evento.participantes[participanteIndex].estado_participacion = respuesta;
    evento.participantes[participanteIndex].fecha_respuesta = Date.now();
    await evento.save();

    // Update instructor's pending events
    const instructor = await Instructor.findById(instructorId);
    const eventoIndex = instructor.eventos_pendientes.findIndex(
      e => e.evento_id.toString() === eventId
    );

    if (eventoIndex !== -1) {
      instructor.eventos_pendientes[eventoIndex].estado = respuesta;
      await instructor.save();
    }

    res.status(200).json({
      success: true,
      message: `Has ${respuesta === 'confirmado' ? 'confirmado' : 'rechazado'} tu participación en el evento`,
      data: {
        evento_id: eventId,
        nombre_evento: evento.nombre_evento,
        estado_participacion: respuesta
      }
    });
  } catch (error) {
    console.error('Error al responder al evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al responder al evento',
      error: error.message
    });
  }
};