// ... (previous code remains)

// Events Routes
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, GROUP_CONCAT(i.Nombre) as instructores
      FROM Evento e
      LEFT JOIN Instructor_Evento ie ON e.ID_Evento = ie.ID_Evento
      LEFT JOIN Instructor i ON ie.ID_Instructor = i.ID_Instructor
      GROUP BY e.ID_Evento
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { Nombre_Evento, Fecha_Entrega, instructorIds } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO Evento (Nombre_Evento, Fecha_Entrega) VALUES (?, ?)',
      [Nombre_Evento, Fecha_Entrega]
    );

    const eventId = result.insertId;

    for (const instructorId of instructorIds) {
      await connection.query(
        'INSERT INTO Instructor_Evento (ID_Instructor, ID_Evento) VALUES (?, ?)',
        [instructorId, eventId]
      );
    }

    await connection.commit();
    res.status(201).json({ id: eventId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.put('/api/events/:id', async (req, res) => {
  const { Nombre_Evento, Fecha_Entrega, instructorIds } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    await connection.query(
      'UPDATE Evento SET Nombre_Evento = ?, Fecha_Entrega = ? WHERE ID_Evento = ?',
      [Nombre_Evento, Fecha_Entrega, req.params.id]
    );

    await connection.query(
      'DELETE FROM Instructor_Evento WHERE ID_Evento = ?',
      [req.params.id]
    );

    for (const instructorId of instructorIds) {
      await connection.query(
        'INSERT INTO Instructor_Evento (ID_Instructor, ID_Evento) VALUES (?, ?)',
        [instructorId, req.params.id]
      );
    }

    await connection.commit();
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    await connection.query(
      'DELETE FROM Instructor_Evento WHERE ID_Evento = ?',
      [req.params.id]
    );

    await connection.query(
      'DELETE FROM Evento WHERE ID_Evento = ?',
      [req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Reports Routes
app.get('/api/reports/generate', async (req, res) => {
  const { month, year, instructorId } = req.query;
  
  try {
    // Get instructor activities for the specified month
    const [activities] = await pool.query(`
      SELECT af.*, ia.ID_Instructor
      FROM Actividad_Formacion af
      JOIN Instructor_Actividad ia ON af.ID_Actividad = ia.ID_Actividad
      WHERE ia.ID_Instructor = ?
      AND MONTH(af.Fecha_Desde) = ?
      AND YEAR(af.Fecha_Desde) = ?
    `, [instructorId, month, year]);

    // Get instructor events for the specified month
    const [events] = await pool.query(`
      SELECT e.*
      FROM Evento e
      JOIN Instructor_Evento ie ON e.ID_Evento = ie.ID_Evento
      WHERE ie.ID_Instructor = ?
      AND MONTH(e.Fecha_Entrega) = ?
      AND YEAR(e.Fecha_Entrega) = ?
    `, [instructorId, month, year]);

    // Calculate working days and total hours
    const workingDays = new Set();
    let totalHours = 0;

    activities.forEach(activity => {
      const startDate = new Date(activity.Fecha_Desde);
      const endDate = new Date(activity.Fecha_Hasta);
      
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude weekends
          workingDays.add(d.toISOString().split('T')[0]);
        }
      }
      
      totalHours += activity.Total_Horas;
    });

    // Generate CSV content
    let csvContent = 'Reporte Mensual de Actividades\n\n';
    csvContent += `Mes: ${month}/${year}\n`;
    csvContent += `Días hábiles trabajados: ${workingDays.size}\n`;
    csvContent += `Total horas: ${totalHours}\n\n`;
    
    csvContent += 'Actividades:\n';
    csvContent += 'Ficha,Fase,Fecha Inicio,Fecha Fin,Horas\n';
    activities.forEach(act => {
      csvContent += `${act.Numero_Ficha},${act.Fase_Proyecto},${act.Fecha_Desde},${act.Fecha_Hasta},${act.Total_Horas}\n`;
    });
    
    csvContent += '\nEventos:\n';
    csvContent += 'Nombre,Fecha Entrega\n';
    events.forEach(evt => {
      csvContent += `${evt.Nombre_Evento},${evt.Fecha_Entrega}\n`;
    });

    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... (rest of the server code)