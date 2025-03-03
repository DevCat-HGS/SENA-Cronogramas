const express = require('express');
const router = express.Router();
const actividadFormacionController = require('../controllers/actividadFormacionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Rutas públicas - ninguna

// Rutas protegidas - requieren autenticación
router.post('/', protect, adminOnly, actividadFormacionController.createActividad);
router.get('/', protect, actividadFormacionController.getAllActividades);
router.get('/:id', protect, actividadFormacionController.getActividadById);
router.put('/:id', protect, adminOnly, actividadFormacionController.updateActividad);
router.delete('/:id', protect, adminOnly, actividadFormacionController.deleteActividad);

module.exports = router;