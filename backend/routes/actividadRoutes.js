const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', actividadController.getActividades);
router.get('/:id', actividadController.getActividad);
router.post('/', actividadController.crearActividad);
router.put('/:id', actividadController.actualizarActividad);
router.delete('/:id', actividadController.eliminarActividad);

module.exports = router; 