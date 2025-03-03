const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { protect, adminOnly, instructorOnly } = require('../middleware/authMiddleware');

// Rutas protegidas - requieren autenticación

// Rutas para administradores
router.post('/', protect, adminOnly, eventoController.createEvento);
router.get('/', protect, eventoController.getAllEventos);
router.get('/:id', protect, eventoController.getEventoById);
router.put('/:id', protect, adminOnly, eventoController.updateEvento);
router.delete('/:id', protect, adminOnly, eventoController.deleteEvento);

// Rutas para gestión de participantes
router.put('/:id/participantes', protect, adminOnly, eventoController.updateParticipantes);
router.put('/:id/estado', protect, adminOnly, eventoController.updateEstadoEvento);

// Rutas para instructores
router.get('/instructor/pendientes', protect, instructorOnly, eventoController.getEventosPendientes);
router.put('/:id/responder', protect, instructorOnly, eventoController.responderInvitacion);

module.exports = router;