const express = require('express');
const router = express.Router();

// Placeholder para las rutas de eventos
router.get('/', (req, res) => {
  res.json({ mensaje: 'Rutas de eventos' });
});

module.exports = router; 