const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Admin only (superadmin)
exports.registerAdmin = async (req, res) => {
  try {
    const { usuario, nombre, apellido, correo, contraseña, nivel_acceso, permisos } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ $or: [{ usuario }, { correo }] });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o correo ya está registrado'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Create admin
    const admin = await Admin.create({
      usuario,
      nombre,
      apellido,
      correo,
      contraseña: hashedPassword,
      nivel_acceso: nivel_acceso || 'admin',
      permisos: permisos || ['gestionar_instructores'],
      estado: 'activo'
    });

    if (admin) {
      res.status(201).json({
        success: true,
        message: 'Administrador registrado exitosamente',
        data: {
          id: admin._id,
          usuario: admin.usuario,
          nombre: admin.nombre,
          apellido: admin.apellido,
          correo: admin.correo,
          nivel_acceso: admin.nivel_acceso,
          permisos: admin.permisos
        }
      });
    }
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar administrador',
      error: error.message
    });
  }
};

// @desc    Authenticate admin
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    // Check for admin username
    const admin = await Admin.findOne({ usuario });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Check if admin is active
    if (admin.estado !== 'activo') {
      return res.status(401).json({
        success: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(contraseña, admin.contraseña);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update last access
    admin.ultimo_acceso = Date.now();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      data: {
        id: admin._id,
        usuario: admin.usuario,
        nombre: admin.nombre,
        apellido: admin.apellido,
        nivel_acceso: admin.nivel_acceso,
        permisos: admin.permisos
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

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (admin only)
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-contraseña');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
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

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (admin only)
exports.updateAdminProfile = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña } = req.body;
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Update fields
    if (nombre) admin.nombre = nombre;
    if (apellido) admin.apellido = apellido;
    if (correo) {
      // Check if email is already in use by another admin
      const emailExists = await Admin.findOne({ correo, _id: { $ne: adminId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está en uso'
        });
      }
      admin.correo = correo;
    }

    // Update password if provided
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      admin.contraseña = await bcrypt.hash(contraseña, salt);
    }

    admin.ultima_actualizacion = Date.now();

    const updatedAdmin = await admin.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: updatedAdmin._id,
        usuario: updatedAdmin.usuario,
        nombre: updatedAdmin.nombre,
        apellido: updatedAdmin.apellido,
        correo: updatedAdmin.correo,
        nivel_acceso: updatedAdmin.nivel_acceso,
        permisos: updatedAdmin.permisos
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

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private (superadmin only)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-contraseña');

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener administradores',
      error: error.message
    });
  }
};

// @desc    Get admin by ID
// @route   GET /api/admin/:id
// @access  Private (superadmin only)
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-contraseña');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error al obtener administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener administrador',
      error: error.message
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admin/:id
// @access  Private (superadmin only)
exports.updateAdmin = async (req, res) => {
  try {
    const { nombre, apellido, correo, nivel_acceso, permisos, estado } = req.body;
    const adminId = req.params.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Update fields
    if (nombre) admin.nombre = nombre;
    if (apellido) admin.apellido = apellido;
    if (correo) {
      // Check if email is already in use by another admin
      const emailExists = await Admin.findOne({ correo, _id: { $ne: adminId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está en uso'
        });
      }
      admin.correo = correo;
    }
    if (nivel_acceso) admin.nivel_acceso = nivel_acceso;
    if (permisos) admin.permisos = permisos;
    if (estado) admin.estado = estado;

    admin.ultima_actualizacion = Date.now();

    // Add to action history
    admin.historial_acciones.push({
      accion: 'actualización_perfil',
      fecha: Date.now(),
      detalles: {
        actualizado_por: req.user.id,
        campos_actualizados: Object.keys(req.body)
      }
    });

    const updatedAdmin = await admin.save();

    res.status(200).json({
      success: true,
      message: 'Administrador actualizado exitosamente',
      data: {
        id: updatedAdmin._id,
        usuario: updatedAdmin.usuario,
        nombre: updatedAdmin.nombre,
        apellido: updatedAdmin.apellido,
        correo: updatedAdmin.correo,
        nivel_acceso: updatedAdmin.nivel_acceso,
        permisos: updatedAdmin.permisos,
        estado: updatedAdmin.estado
      }
    });
  } catch (error) {
    console.error('Error al actualizar administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar administrador',
      error: error.message
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private (superadmin only)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    // Prevent deleting the last superadmin
    if (admin.nivel_acceso === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ nivel_acceso: 'superadmin' });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el último superadmin'
        });
      }
    }

    await admin.remove();

    res.status(200).json({
      success: true,
      message: 'Administrador eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar administrador',
      error: error.message
    });
  }
};