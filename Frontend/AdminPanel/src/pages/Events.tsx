import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import eventoService from '../services/eventoService';

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  organizador: string;
  estado: string;
}

const EventoList = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<Evento> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await eventoService.getEventos();
      const data = Array.isArray(response) ? response : response.data || [];
      setEventos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleOpenDialog = (evento?: Evento) => {
    if (evento) {
      setCurrentEvento(evento);
      setIsEditing(true);
    } else {
      setCurrentEvento({ 
        titulo: '', 
        descripcion: '', 
        fecha: new Date().toISOString().split('T')[0], 
        lugar: '',
        organizador: '',
        estado: 'programado' 
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEvento(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentEvento(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async () => {
    if (!currentEvento) return;

    try {
      setLoading(true);
      if (isEditing && currentEvento.id) {
        await eventoService.updateEvento(currentEvento.id, currentEvento);
      } else {
        await eventoService.createEvento(currentEvento as Omit<Evento, 'id'>);
      }
      fetchEventos();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Error al guardar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este evento?')) {
      try {
        setLoading(true);
        await eventoService.deleteEvento(id);
        fetchEventos();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar evento');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && eventos.length === 0) {
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
          Eventos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Evento
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Organizador</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell>{evento.titulo}</TableCell>
                <TableCell>{new Date(evento.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{evento.lugar}</TableCell>
                <TableCell>{evento.organizador}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: 
                        evento.estado === 'completado' ? '#e8f5e9' : 
                        evento.estado === 'programado' ? '#fff3e0' : '#ffebee',
                      color: 
                        evento.estado === 'completado' ? '#2e7d32' : 
                        evento.estado === 'programado' ? '#e65100' : '#c62828',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {evento.estado === 'completado' ? 'Completado' : 
                     evento.estado === 'programado' ? 'Programado' : 'Cancelado'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDialog(evento)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(evento.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar evento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              name="titulo"
              value={currentEvento?.titulo || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={currentEvento?.descripcion || ''}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={currentEvento?.fecha || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Lugar"
              name="lugar"
              value={currentEvento?.lugar || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Organizador"
              name="organizador"
              value={currentEvento?.organizador || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={currentEvento?.estado || 'programado'}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="programado">Programado</MenuItem>
                <MenuItem value="completado">Completado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
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

const Events = () => {
  return (
    <Routes>
      <Route path="/" element={<EventoList />} />
    </Routes>
  );
};

export default Events;