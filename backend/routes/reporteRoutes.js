const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { protect, adminOnly, instructorOnly } = require('../middleware/authMiddleware');

// Rutas protegidas - requieren autenticación

// Rutas para instructores
router.post('/', protect, instructorOnly, reporteController.createReporte);
router.get('/mis-reportes', protect, instructorOnly, reporteController.getMisReportes);
router.get('/:id', protect, reporteController.getReporteById);
router.put('/:id', protect, instructorOnly, reporteController.updateReporte);
router.put('/:id/enviar', protect, instructorOnly, reporteController.enviarReporte);

// Rutas para administradores
router.get('/', protect, adminOnly, reporteController.getAllReportes);
router.put('/:id/aprobar', protect, adminOnly, reporteController.aprobarReporte);
router.put('/:id/rechazar', protect, adminOnly, reporteController.rechazarReporte);
router.delete('/:id', protect, adminOnly, reporteController.deleteReporte);

module.exports = router;