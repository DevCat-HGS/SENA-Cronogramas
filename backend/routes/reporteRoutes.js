const express = require('express');
const router = express.Router();

// Placeholder para las rutas de reportes
router.get('/', (req, res) => {
  res.json({ mensaje: 'Rutas de reportes' });
});

module.exports = router; 