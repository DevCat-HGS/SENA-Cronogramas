const Evento = require('../models/evento');
const Instructor = require('../models/instructor');

// @desc    Create a new event
// @route   POST /api/eventos
// @access  Private (Admin only)
exports.createEvento = async (req, res) => {
  try {
    // Añadir información del admin que crea el evento
    const eventoData = {
      ...req.body,
      creado_por: {
        admin_id: req.user.id,
        nombre_completo: `${req.user.nombre} ${req.user.apellido}`
      }
    };

    const evento = await Evento.create(eventoData);

    // Actualizar los eventos pendientes de los instructores participantes
    if (req.body.participantes && req.body.participantes.length > 0) {
      const eventoInfo = {
        evento_id: evento._id,
        nombre_evento: evento.nombre_evento,
        fecha_evento: evento.fecha_evento,
        estado: 'pendiente'
      };

      await Promise.all(req.body.participantes.map(participante => {
        return Instructor.findByIdAndUpdate(
          participante.instructor_id,
          {
            $push: { eventos_pendientes: eventoInfo },
            $set: { ultima_actualizacion: Date.now() }
          }
        );
      }));
    }

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: evento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el evento',
      error: error.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/eventos
// @access  Private
exports.getAllEventos = async (req, res) => {
  try {
    const { estado, tipo, fecha_desde, fecha_hasta } = req.query;
    const filter = {};

    if (estado) filter.estado = estado;
    if (tipo) filter.tipo = tipo;
    
    // Filtro por rango de fechas
    if (fecha_desde || fecha_hasta) {
      filter.fecha_evento = {};
      if (fecha_desde) filter.fecha_evento.$gte = new Date(fecha_desde);
      if (fecha_hasta) filter.fecha_evento.$lte = new Date(fecha_hasta);
    }

    const eventos = await Evento.find(filter)
      .sort({ fecha_evento: 1 })
      .populate('participantes.instructor_id', 'nombre apellido')
      .populate('creado_por.admin_id', 'nombre apellido');

    res.status(200).json({
      success: true,
      count: eventos.length,
      data: eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los eventos',
      error: error.message
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/eventos/:id
// @access  Private
exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
      .populate('participantes.instructor_id', 'nombre apellido')
      .populate('creado_por.admin_id', 'nombre apellido');

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: evento
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el evento',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/eventos/:id
// @access  Private (Admin only)
exports.updateEvento = async (req, res) => {
  try {
    let evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Actualizar el evento
    evento = await Evento.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ultima_actualizacion: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: evento
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el evento',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/eventos/:id
// @access  Private (Admin only)
exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Eliminar el evento de los eventos pendientes de los instructores
    if (evento.participantes && evento.participantes.length > 0) {
      await Promise.all(evento.participantes.map(participante => {
        return Instructor.findByIdAndUpdate(
          participante.instructor_id,
          {
            $pull: { eventos_pendientes: { evento_id: evento._id } },
            $set: { ultima_actualizacion: Date.now() }
          }
        );
      }));
    }

    await Evento.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el evento',
      error: error.message
    });
  }
};

// @desc    Update event participants
// @route   PUT /api/eventos/:id/participantes
// @access  Private (Admin only)
exports.updateParticipantes = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Obtener los IDs de los participantes actuales
    const participantesActualesIds = evento.participantes.map(
      p => p.instructor_id.toString()
    );

    // Obtener los IDs de los nuevos participantes
    const nuevosParticipantesIds = req.body.participantes.map(
      p => p.instructor_id.toString()
    );

    // Identificar participantes a eliminar y a añadir
    const participantesAEliminar = participantesActualesIds.filter(
      id => !nuevosParticipantesIds.includes(id)
    );

    const participantesAAñadir = req.body.participantes.filter(
      p => !participantesActualesIds.includes(p.instructor_id.toString())
    );

    // Eliminar el evento de los instructores que ya no participan
    if (participantesAEliminar.length > 0) {
      await Promise.all(participantesAEliminar.map(instructorId => {
        return Instructor.findByIdAndUpdate(
          instructorId,
          {
            $pull: { eventos_pendientes: { evento_id: evento._id } },
            $set: { ultima_actualizacion: Date.now() }
          }
        );
      }));
    }

    // Añadir el evento a los nuevos instructores
    if (participantesAAñadir.length > 0) {
      const eventoInfo = {
        evento_id: evento._id,
        nombre_evento: evento.nombre_evento,
        fecha_evento: evento.fecha_evento,
        estado: 'pendiente'
      };

      await Promise.all(participantesAAñadir.map(participante => {
        return Instructor.findByIdAndUpdate(
          participante.instructor_id,
          {
            $push: { eventos_pendientes: eventoInfo },
            $set: { ultima_actualizacion: Date.now() }
          }
        );
      }));
    }

    // Actualizar los participantes del evento
    evento.participantes = req.body.participantes;
    evento.ultima_actualizacion = Date.now();
    await evento.save();

    res.status(200).json({
      success: true,
      message: 'Participantes actualizados exitosamente',
      data: evento
    });
  } catch (error) {
    console.error('Error al actualizar participantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar los participantes',
      error: error.message
    });
  }
};

// @desc    Update event status
// @route   PUT /api/eventos/:id/estado
// @access  Private (Admin only)
exports.updateEstadoEvento = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado || !['programado', 'en_curso', 'completado', 'cancelado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const evento = await Evento.findByIdAndUpdate(
      req.params.id,
      { 
        estado,
        ultima_actualizacion: Date.now() 
      },
      { new: true }
    );

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: `Estado del evento actualizado a ${estado}`,
      data: evento
    });
  } catch (error) {
    console.error('Error al actualizar estado del evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del evento',
      error: error.message
    });
  }
};

// @desc    Get pending events for instructor
// @route   GET /api/eventos/instructor/pendientes
// @access  Private (Instructor only)
exports.getEventosPendientes = async (req, res) => {
  try {
    // Obtener el instructor con sus eventos pendientes
    const instructor = await Instructor.findById(req.user.id)
      .select('eventos_pendientes');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor no encontrado'
      });
    }

    // Obtener los IDs de los eventos pendientes
    const eventosIds = instructor.eventos_pendientes.map(e => e.evento_id);

    // Buscar los eventos completos
    const eventos = await Evento.find({
      _id: { $in: eventosIds },
      estado: { $in: ['programado', 'en_curso'] }
    }).sort({ fecha_evento: 1 });

    res.status(200).json({
      success: true,
      count: eventos.length,
      data: eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los eventos pendientes',
      error: error.message
    });
  }
};

// @desc    Respond to event invitation
// @route   PUT /api/eventos/:id/responder
// @access  Private (Instructor only)
exports.responderInvitacion = async (req, res) => {
  try {
    const { estado_participacion } = req.body;

    if (!estado_participacion || !['confirmado', 'rechazado'].includes(estado_participacion)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de participación no válido'
      });
    }

    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Verificar que el instructor esté invitado al evento
    const participanteIndex = evento.participantes.findIndex(
      p => p.instructor_id.toString() === req.user.id
    );

    if (participanteIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'No está invitado a este evento'
      });
    }

    // Actualizar el estado de participación
    evento.participantes[participanteIndex].estado_participacion = estado_participacion;
    evento.participantes[participanteIndex].fecha_respuesta = Date.now();
    evento.ultima_actualizacion = Date.now();
    await evento.save();

    // Actualizar el estado en los eventos pendientes del instructor
    await Instructor.findByIdAndUpdate(
      req.user.id,
      {
        $set: { 
          'eventos_pendientes.$[evento].estado': estado_participacion,
          ultima_actualizacion: Date.now() 
        }
      },
      {
        arrayFilters: [{ 'evento.evento_id': evento._id }]
      }
    );

    res.status(200).json({
      success: true,
      message: `Participación ${estado_participacion} exitosamente`,
      data: {
        evento_id: evento._id,
        nombre_evento: evento.nombre_evento,
        estado_participacion,
        fecha_respuesta: evento.participantes[participanteIndex].fecha_respuesta
      }
    });
  } catch (error) {
    console.error('Error al responder invitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al responder a la invitación',
      error: error.message
    });
  }
};