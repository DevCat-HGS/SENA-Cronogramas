const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const auth = require('../middleware/auth');

// Rutas públicas
router.post('/login', instructorController.loginInstructor);
router.post('/', instructorController.crearInstructor);

// Rutas protegidas
router.use(auth);
router.get('/', instructorController.getInstructores);
router.get('/:id', instructorController.getInstructor);
router.put('/:id', instructorController.actualizarInstructor);
router.delete('/:id', instructorController.eliminarInstructor);

module.exports = router; 