const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const { morganDev, morganProd } = require('./utils/logger');
const { errorHandler } = require('./utils/errorHandler');
const { basicLimiter } = require('./middleware/rateLimiter');
const { setupSecurity } = require('./middleware/securityMiddleware');
const swagger = require('./utils/swagger');

// Importar rutas
const instructorRoutes = require('./routes/instructorRoutes');
const actividadFormacionRoutes = require('./routes/actividadFormacionRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const instructorRequestRoutes = require('./routes/instructorRequestRoutes');

// Configuración de variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Configuración de seguridad
setupSecurity(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(process.env.NODE_ENV === 'development' ? morganDev : morganProd);
app.use(compression()); // Comprimir todas las respuestas
app.use(basicLimiter); // Aplicar rate limiting básico a todas las rutas
app.use('/api-docs', swagger.serve, swagger.setup);

// Conexión a MongoDB con opciones mejoradas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: process.env.NODE_ENV !== 'production' // Deshabilitar autoIndex en producción
})
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/instructores', instructorRoutes);
app.use('/api/actividades', actividadFormacionRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/solicitudes', instructorRequestRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del Sistema de Gestión CTPGA funcionando correctamente');
});

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `No se puede encontrar ${req.originalUrl} en este servidor`
  });
});

// Manejo de errores global
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});

// Manejo de excepciones no capturadas
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});