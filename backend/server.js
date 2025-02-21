require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const instructorRoutes = require('./routes/instructorRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/instructores', instructorRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/eventos', eventoRoutes);

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 