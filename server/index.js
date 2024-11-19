const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// eslint-disable-next-line no-unused-vars
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
app.get('/api/instructors', async (req, res) => {
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
    const { Nombre, Apellido, No_Documento_Identidad, NIS, Correo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Instructor (Nombre, Apellido, No_Documento_Identidad, NIS, Correo) VALUES (?, ?, ?, ?, ?)',
      [Nombre, Apellido, No_Documento_Identidad, NIS, Correo]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/instructors/:id', async (req, res) => {
  try {
    const { Nombre, Apellido, No_Documento_Identidad, NIS, Correo } = req.body;
    const [result] = await pool.query(
      'UPDATE Instructor SET Nombre = ?, Apellido = ?, No_Documento_Identidad = ?, NIS = ?, Correo = ? WHERE ID_Instructor = ?',
      [Nombre, Apellido, No_Documento_Identidad, NIS, Correo, req.params.id]
    );
    res.json({ message: 'Instructor updated successfully' });
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
      Fecha_Desde,
      Fecha_Hasta,
      Hora_Desde,
      Hora_Hasta,
      Horas_Por_Dia,
      Total_Horas,
      instructorIds
    } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Actividad_Formacion (Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas]
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
      Fecha_Desde,
      Fecha_Hasta,
      Hora_Desde,
      Hora_Hasta,
      Horas_Por_Dia,
      Total_Horas,
      instructorIds
    } = req.body;

    await pool.query(
      'UPDATE Actividad_Formacion SET Numero_Ficha = ?, Fase_Proyecto = ?, Actividad_Desarrollar = ?, Competencia_Desarrollar = ?, Resultados_Aprendizaje = ?, Ambiente_Aprendizaje = ?, Fecha_Desde = ?, Fecha_Hasta = ?, Hora_Desde = ?, Hora_Hasta = ?, Horas_Por_Dia = ?, Total_Horas = ? WHERE ID_Actividad = ?',
      [Numero_Ficha, Fase_Proyecto, Actividad_Desarrollar, Competencia_Desarrollar, Resultados_Aprendizaje, Ambiente_Aprendizaje, Fecha_Desde, Fecha_Hasta, Hora_Desde, Hora_Hasta, Horas_Por_Dia, Total_Horas, actividadId]
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

// ... (rest of the server code)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});