const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (_, res) => {
  res.send('Servidor funcionando correctamente');
});

// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     // Verifica que este sea tu usuario
  password: '',     // Verifica que esta sea tu contraseña
  database: 'sena_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rutas de Instructores
app.get('/api/instructors', async (_, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Instructor');
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/instructors', async (req, res) => {
  try {
    const { Nombre, Apellido, No_Documento_Identidad, Contraseña, Correo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Instructor (Nombre, Apellido, No_Documento_Identidad, Contraseña, Correo) VALUES (?, ?, ?, ?, ?)',
      [Nombre, Apellido, No_Documento_Identidad, Contraseña, Correo]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/instructors/:id', async (req, res) => {
  try {
    const { Nombre, Apellido, No_Documento_Identidad, Contraseña, Correo } = req.body;
    const [result] = await pool.query(
      'UPDATE Instructor SET Nombre = ?, Apellido = ?, No_Documento_Identidad = ?, Contraseña = ?, Correo = ? WHERE ID_Instructor = ?',
      [Nombre, Apellido, No_Documento_Identidad, Contraseña, Correo, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Instructor no encontrado' });
    }
    res.json({ message: 'Instructor actualizado exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/instructors/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Instructor WHERE ID_Instructor = ?', [req.params.id]);
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Actividades
app.get('/api/activities', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Actividad_Formacion');
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    const {
      Numero_Ficha,
      Fase_Proyecto,
      Actividad_Desarrollar,
      Competencia_Desarrollar,
      Resultados_Aprendizaje,
      Ambiente_Aprendizaje,
      Jornada,
      Fecha_Desde,
      Fecha_Hasta,
      Hora_Desde,
      Hora_Hasta,
      Horas_Por_Dia,
      Total_Horas,
      instructorIds
    } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Actividad_Formacion (Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Jornada, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Jornada, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas]
    );

    if (instructorIds && instructorIds.length > 0) {
      const actividadId = result.insertId;
      const values = instructorIds.map(instructorId => [instructorId, actividadId]);
      await pool.query('INSERT INTO Instructor_Actividad (ID_Instructor, ID_Actividad) VALUES ?', [values]);
    }

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/activities/:id', async (req, res) => {
  try {
    const actividadId = req.params.id;
    const {
      Numero_Ficha,
      Fase_Proyecto,
      Actividad_Desarrollar,
      Competencia_Desarrollar,
      Resultados_Aprendizaje,
      Ambiente_Aprendizaje,
      Jornada,
      Fecha_Desde,
      Fecha_Hasta,
      Hora_Desde,
      Hora_Hasta,
      Horas_Por_Dia,
      Total_Horas,
      instructorIds
    } = req.body;

    await pool.query(
      'UPDATE Actividad_Formacion SET Numero_Ficha = ?, Fase_Proyecto = ?, Actividad_Desarrollar = ?, Competencia_Desarrollar = ?, Resultados_Aprendizaje = ?, Ambiente_Aprendizaje = ?, Jornada = ?, Fecha_Desde = ?, Fecha_Hasta = ?, Hora_Desde = ?, Hora_Hasta = ?, Horas_Por_Dia = ?, Total_Horas = ? WHERE ID_Actividad = ?',
      [Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Jornada, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas, actividadId]
    );

    if (instructorIds) {
      await pool.query('DELETE FROM Instructor_Actividad WHERE ID_Actividad = ?', [actividadId]);
      if (instructorIds.length > 0) {
        const values = instructorIds.map(instructorId => [instructorId, actividadId]);
        await pool.query('INSERT INTO Instructor_Actividad (ID_Instructor, ID_Actividad) VALUES ?', [values]);
      }
    }

    res.json({ message: 'Actividad actualizada exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Instructor_Actividad WHERE ID_Actividad = ?', [req.params.id]);
    await pool.query('DELETE FROM Actividad_Formacion WHERE ID_Actividad = ?', [req.params.id]);
    res.json({ message: 'Actividad eliminada exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Eventos
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, 
      (SELECT COUNT(*) FROM Instructor_Evento WHERE ID_Evento = e.ID_Evento) as instructores_count,
      GROUP_CONCAT(i.ID_Instructor) as instructorIds
      FROM Evento e
      LEFT JOIN Instructor_Evento ie ON e.ID_Evento = ie.ID_Evento
      LEFT JOIN Instructor i ON ie.ID_Instructor = i.ID_Instructor
      GROUP BY e.ID_Evento
    `);

    const events = rows.map(event => ({
      ...event,
      instructorIds: event.instructorIds ? event.instructorIds.split(',').map(Number) : []
    }));

    res.json(events);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { Nombre_Evento, Fecha_Entrega, instructorIds } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO Evento (Nombre_Evento, Fecha_Entrega) VALUES (?, ?)',
      [Nombre_Evento, Fecha_Entrega]
    );

    if (instructorIds && instructorIds.length > 0) {
      const values = instructorIds.map(instructorId => [instructorId, result.insertId]);
      await pool.query('INSERT INTO Instructor_Evento (ID_Instructor, ID_Evento) VALUES ?', [values]);
    }

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { Nombre_Evento, Fecha_Entrega, instructorIds } = req.body;
    const eventoId = req.params.id;

    await pool.query(
      'UPDATE Evento SET Nombre_Evento = ?, Fecha_Entrega = ? WHERE ID_Evento = ?',
      [Nombre_Evento, Fecha_Entrega, eventoId]
    );

    await pool.query('DELETE FROM Instructor_Evento WHERE ID_Evento = ?', [eventoId]);
    
    if (instructorIds && instructorIds.length > 0) {
      const values = instructorIds.map(instructorId => [instructorId, eventoId]);
      await pool.query('INSERT INTO Instructor_Evento (ID_Instructor, ID_Evento) VALUES ?', [values]);
    }

    res.json({ message: 'Evento actualizado exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Instructor_Evento WHERE ID_Evento = ?', [req.params.id]);
    await pool.query('DELETE FROM Evento WHERE ID_Evento = ?', [req.params.id]);
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Reportes
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, i.Nombre, i.Apellido 
      FROM Reporte r
      JOIN Instructor i ON r.ID_Instructor = i.ID_Instructor
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { Mes_A_Reportar, Dias_Habiles, ID_Instructor } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Reporte (Mes_A_Reportar, Dias_Habiles, ID_Instructor) VALUES (?, ?, ?)',
      [Mes_A_Reportar, Dias_Habiles, ID_Instructor]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    const { Mes_A_Reportar, Dias_Habiles, ID_Instructor } = req.body;
    const [result] = await pool.query(
      'UPDATE Reporte SET Mes_A_Reportar = ?, Dias_Habiles = ?, ID_Instructor = ? WHERE ID_Reporte = ?',
      [Mes_A_Reportar, Dias_Habiles, ID_Instructor, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    res.json({ message: 'Reporte actualizado exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Reporte WHERE ID_Reporte = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    res.json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Reporte_Actividad
app.get('/api/report-activities/:reportId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT af.* 
      FROM Actividad_Formacion af
      JOIN Reporte_Actividad ra ON af.ID_Actividad = ra.ID_Actividad
      WHERE ra.ID_Reporte = ?
    `, [req.params.reportId]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/report-activities/:reportId', async (req, res) => {
  try {
    const { activityIds } = req.body;
    const reportId = req.params.reportId;

    if (activityIds && activityIds.length > 0) {
      const values = activityIds.map(activityId => [reportId, activityId]);
      await pool.query('INSERT INTO Reporte_Actividad (ID_Reporte, ID_Actividad) VALUES ?', [values]);
    }

    res.status(201).json({ message: 'Actividades asociadas exitosamente al reporte' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/report-activities/:reportId/:activityId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM Reporte_Actividad WHERE ID_Reporte = ? AND ID_Actividad = ?',
      [req.params.reportId, req.params.activityId]
    );
    res.json({ message: 'Actividad removida del reporte exitosamente' });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener actividades por instructor
app.get('/api/instructors/:id/activities', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT af.* 
      FROM Actividad_Formacion af
      JOIN Instructor_Actividad ia ON af.ID_Actividad = ia.ID_Actividad
      WHERE ia.ID_Instructor = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener eventos por instructor
app.get('/api/instructors/:id/events', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.* 
      FROM Evento e
      JOIN Instructor_Evento ie ON e.ID_Evento = ie.ID_Evento
      WHERE ie.ID_Instructor = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener instructores por actividad
app.get('/api/activities/:id/instructors', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.* 
      FROM Instructor i
      JOIN Instructor_Actividad ia ON i.ID_Instructor = ia.ID_Instructor
      WHERE ia.ID_Actividad = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener instructores por evento
app.get('/api/events/:id/instructors', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.* 
      FROM Instructor i
      JOIN Instructor_Evento ie ON i.ID_Instructor = ie.ID_Instructor
      WHERE ie.ID_Evento = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todos los instructores con estado de selección
app.get('/api/reports/instructors-selection', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ID_Instructor,
        CONCAT(Nombre, ' ', Apellido) as Nombre_Completo,
        false as seleccionado
      FROM Instructor
      ORDER BY Nombre_Completo
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener actividades por mes y instructor
app.get('/api/reports/activities/:instructorId/:month/:year', async (req, res) => {
  try {
    const { instructorId, month, year } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        af.*,
        false as seleccionado
      FROM Actividad_Formacion af
      JOIN Instructor_Actividad ia ON af.ID_Actividad = ia.ID_Actividad
      WHERE ia.ID_Instructor = ?
      AND MONTH(af.Fecha_Desde) = ?
      AND YEAR(af.Fecha_Desde) = ?
    `, [instructorId, month, year]);
    res.json(rows);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para generar y descargar reporte CSV
app.post('/api/reports/generate-csv', async (req, res) => {
  try {
    const { instructorIds, month, year, activityIds } = req.body;
    
    // Obtener datos de actividades seleccionadas
    const [activities] = await pool.query(`
      SELECT 
        i.Nombre,
        i.Apellido,
        af.Numero_Ficha,
        af.Fase_Proyecto,
        af.Actividad_Desarrollar,
        af.Competencia_Desarrollar,
        af.Resultados_Aprendizaje,
        af.Ambiente_Aprendizaje,
        af.Jornada,
        af.Fecha_Desde,
        af.Fecha_Hasta,
        af.Hora_Desde,
        af.Hora_Hasta,
        af.Horas_Por_Dia,
        af.Total_Horas
      FROM Actividad_Formacion af
      JOIN Instructor_Actividad ia ON af.ID_Actividad = ia.ID_Actividad
      JOIN Instructor i ON ia.ID_Instructor = i.ID_Instructor
      WHERE ia.ID_Instructor IN (?)
      AND af.ID_Actividad IN (?)
      AND MONTH(af.Fecha_Desde) = ?
      AND YEAR(af.Fecha_Desde) = ?
    `, [instructorIds, activityIds, month, year]);

    // Convertir datos a formato CSV
    const csvData = activities.map(row => {
      return Object.values(row).join(',');
    });
    
    // Agregar encabezados
    const headers = [
      'Nombre',
      'Apellido',
      'Número Ficha',
      'Fase Proyecto',
      'Actividad a Desarrollar',
      'Competencia a Desarrollar',
      'Resultados Aprendizaje',
      'Ambiente Aprendizaje',
      'Jornada',
      'Fecha Desde',
      'Fecha Hasta',
      'Hora Desde',
      'Hora Hasta',
      'Horas Por Día',
      'Total Horas'
    ].join(',');

    const csv = [headers, ...csvData].join('\n');

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-${month}-${year}.csv`);
    
    // Enviar CSV
    res.send(csv);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});