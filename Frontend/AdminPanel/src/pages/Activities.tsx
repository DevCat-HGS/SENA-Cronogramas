import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import actividadService from '../services/actividadService';

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

const ActividadList = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentActividad, setCurrentActividad] = useState<Partial<Actividad> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchActividades = async () => {
    try {
      setLoading(true);
      const data = await actividadService.getActividades();
      setActividades(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const handleOpenDialog = (actividad?: Actividad) => {
    if (actividad) {
      setCurrentActividad(actividad);
      setIsEditing(true);
    } else {
      setCurrentActividad({ 
        titulo: '', 
        descripcion: '', 
        instructor: '', 
        fechaInicio: '', 
        fechaFin: '', 
        estado: 'pendiente' 
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentActividad(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentActividad(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async () => {
    if (!currentActividad) return;

    try {
      setLoading(true);
      if (isEditing && currentActividad.id) {
        await actividadService.updateActividad(currentActividad.id, currentActividad);
      } else {
        await actividadService.createActividad(currentActividad as Omit<Actividad, 'id'>);
      }
      fetchActividades();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Error al guardar actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta actividad?')) {
      try {
        setLoading(true);
        await actividadService.deleteActividad(id);
        fetchActividades();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar actividad');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && actividades.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="page-title">
          Actividades de Formación
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Actividad
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actividades.map((actividad) => (
              <TableRow key={actividad.id}>
                <TableCell>{actividad.titulo}</TableCell>
                <TableCell>{actividad.instructor}</TableCell>
                <TableCell>{new Date(actividad.fechaInicio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(actividad.fechaFin).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: 
                        actividad.estado === 'completada' ? '#e8f5e9' : 
                        actividad.estado === 'en_progreso' ? '#fff3e0' : '#ffebee',
                      color: 
                        actividad.estado === 'completada' ? '#2e7d32' : 
                        actividad.estado === 'en_progreso' ? '#e65100' : '#c62828',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {actividad.estado === 'completada' ? 'Completada' : 
                     actividad.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDialog(actividad)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(actividad.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar actividad */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Actividad' : 'Nueva Actividad'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              name="titulo"
              value={currentActividad?.titulo || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={currentActividad?.descripcion || ''}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              label="Instructor"
              name="instructor"
              value={currentActividad?.instructor || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={currentActividad?.fechaInicio || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha de Finalización"
              name="fechaFin"
              type="date"
              value={currentActividad?.fechaFin || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={currentActividad?.estado || 'pendiente'}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="en_progreso">En Progreso</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Activities = () => {
  return (
    <Routes>
      <Route path="/" element={<ActividadList />} />
    </Routes>
  );
};

export default Activities;