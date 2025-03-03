const InstructorRequest = require('../models/instructorRequest');
const Instructor = require('../models/instructor');
const bcrypt = require('bcryptjs');

// Submit a new instructor registration request
exports.submitRequest = async (req, res) => {
  try {
    const { nombre, apellido, no_documento_identidad, correo, contraseña } = req.body;

    // Check if there's already a pending request with the same document or email
    const existingRequest = await InstructorRequest.findOne({
      $or: [
        { no_documento_identidad },
        { correo }
      ],
      estado_solicitud: 'pendiente'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe una solicitud pendiente con este documento o correo' 
      });
    }

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({
      $or: [
        { no_documento_identidad },
        { correo }
      ]
    });

    if (existingInstructor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un instructor registrado con este documento o correo' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Create new request
    const newRequest = new InstructorRequest({
      nombre,
      apellido,
      no_documento_identidad,
      correo,
      contraseña: hashedPassword
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud de registro enviada correctamente',
      data: {
        id: newRequest._id,
        nombre: newRequest.nombre,
        apellido: newRequest.apellido,
        correo: newRequest.correo,
        estado_solicitud: newRequest.estado_solicitud,
        fecha_solicitud: newRequest.fecha_solicitud
      }
    });
  } catch (error) {
    console.error('Error al enviar solicitud de registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la solicitud de registro', 
      error: error.message 
    });
  }
};

// Get all instructor requests (for admin)
exports.getAllRequests = async (req, res) => {
  try {
    // Optional filter by status
    const { estado } = req.query;
    const filter = estado ? { estado_solicitud: estado } : {};

    const requests = await InstructorRequest.find(filter)
      .sort({ fecha_solicitud: -1 })
      .select('-contraseña');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las solicitudes', 
      error: error.message 
    });
  }
};

// Get a single instructor request by ID (for admin)
exports.getRequestById = async (req, res) => {
  try {
    const request = await InstructorRequest.findById(req.params.id)
      .select('-contraseña');

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la solicitud', 
      error: error.message 
    });
  }
};

// Approve an instructor request
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // Assuming admin ID is available from auth middleware

    const request = await InstructorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }

    if (request.estado_solicitud !== 'pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: `Esta solicitud ya ha sido ${request.estado_solicitud}` 
      });
    }

    // Create new instructor from request data
    const newInstructor = new Instructor({
      nombre: request.nombre,
      apellido: request.apellido,
      no_documento_identidad: request.no_documento_identidad,
      contraseña: request.contraseña, // Password is already hashed
      correo: request.correo,
      estado: 'activo',
      fecha_registro: new Date(),
      ultima_actualizacion: new Date(),
      actividades_actuales: [],
      eventos_pendientes: []
    });

    await newInstructor.save();

    // Update request status
    request.estado_solicitud = 'aprobado';
    request.fecha_revision = new Date();
    request.admin_revisor = adminId;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Solicitud aprobada correctamente',
      data: {
        request: {
          id: request._id,
          estado_solicitud: request.estado_solicitud,
          fecha_revision: request.fecha_revision
        },
        instructor: {
          id: newInstructor._id,
          nombre: newInstructor.nombre,
          apellido: newInstructor.apellido,
          correo: newInstructor.correo
        }
      }
    });
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al aprobar la solicitud', 
      error: error.message 
    });
  }
};

// Reject an instructor request
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo } = req.body;
    const adminId = req.user.id; // Assuming admin ID is available from auth middleware

    if (!motivo_rechazo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere un motivo para rechazar la solicitud' 
      });
    }

    const request = await InstructorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Solicitud no encontrada' 
      });
    }

    if (request.estado_solicitud !== 'pendiente') {
      return res.status(400).json({ 
        success: false, 
        message: `Esta solicitud ya ha sido ${request.estado_solicitud}` 
      });
    }

    // Update request status
    request.estado_solicitud = 'rechazado';
    request.fecha_revision = new Date();
    request.admin_revisor = adminId;
    request.motivo_rechazo = motivo_rechazo;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Solicitud rechazada correctamente',
      data: {
        id: request._id,
        estado_solicitud: request.estado_solicitud,
        fecha_revision: request.fecha_revision,
        motivo_rechazo: request.motivo_rechazo
      }
    });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al rechazar la solicitud', 
      error: error.message 
    });
  }
};