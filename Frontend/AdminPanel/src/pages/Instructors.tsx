import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import instructorService from '../services/instructorService';

interface Instructor {
  id: string;
  nombre: string;
  email: string;
  especialidad: string;
  estado: string;
}

const InstructorList = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Partial<Instructor> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data = await instructorService.getInstructors();
      setInstructors(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar instructores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleOpenDialog = (instructor?: Instructor) => {
    if (instructor) {
      setCurrentInstructor(instructor);
      setIsEditing(true);
    } else {
      setCurrentInstructor({ nombre: '', email: '', especialidad: '', estado: 'activo' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentInstructor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentInstructor(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async () => {
    if (!currentInstructor) return;

    try {
      setLoading(true);
      if (isEditing && currentInstructor.id) {
        await instructorService.updateInstructor(currentInstructor.id, currentInstructor);
      } else {
        await instructorService.createInstructor(currentInstructor as Omit<Instructor, 'id'>);
      }
      fetchInstructors();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Error al guardar instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este instructor?')) {
      try {
        setLoading(true);
        await instructorService.deleteInstructor(id);
        fetchInstructors();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar instructor');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && instructors.length === 0) {
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
          Instructores
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Instructor
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>{instructor.nombre}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.especialidad}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: instructor.estado === 'activo' ? '#e8f5e9' : '#ffebee',
                      color: instructor.estado === 'activo' ? '#2e7d32' : '#c62828',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {instructor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDialog(instructor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(instructor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar instructor */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Instructor' : 'Nuevo Instructor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={currentInstructor?.nombre || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={currentInstructor?.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Especialidad"
              name="especialidad"
              value={currentInstructor?.especialidad || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={currentInstructor?.estado || 'activo'}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
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

const Instructors = () => {
  return (
    <Routes>
      <Route path="/" element={<InstructorList />} />
    </Routes>
  );
};

export default Instructors;