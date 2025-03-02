import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import reporteService from '../services/reporteService';

interface Reporte {
  id: string;
  instructor: string;
  actividad: string;
  fecha: string;
  estado: string;
  observaciones: string;
}

const ReporteList = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReporte, setCurrentReporte] = useState<Partial<Reporte> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchReportes = async () => {
    try {
      setLoading(true);
      const response = await reporteService.getReportes();
      // Extract the data array from the response
      const reportesData = response.data || [];
      setReportes(reportesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleOpenDialog = (reporte?: Reporte) => {
    if (reporte) {
      setCurrentReporte(reporte);
      setIsEditing(true);
    } else {
      setCurrentReporte({ 
        instructor: '', 
        actividad: '', 
        fecha: new Date().toISOString().split('T')[0], 
        estado: 'pendiente',
        observaciones: '' 
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentReporte(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentReporte(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async () => {
    if (!currentReporte) return;

    try {
      setLoading(true);
      if (isEditing && currentReporte.id) {
        await reporteService.updateReporte(currentReporte.id, currentReporte);
      } else {
        await reporteService.createReporte(currentReporte as Omit<Reporte, 'id'>);
      }
      fetchReportes();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Error al guardar reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este reporte?')) {
      try {
        setLoading(true);
        await reporteService.deleteReporte(id);
        fetchReportes();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar reporte');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && reportes.length === 0) {
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
          Reportes de Actividades
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Reporte
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instructor</TableCell>
              <TableCell>Actividad</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportes.map((reporte) => (
              <TableRow key={reporte.id}>
                <TableCell>{reporte.instructor}</TableCell>
                <TableCell>{reporte.actividad}</TableCell>
                <TableCell>{new Date(reporte.fecha).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: 
                        reporte.estado === 'aprobado' ? '#e8f5e9' : 
                        reporte.estado === 'pendiente' ? '#fff3e0' : '#ffebee',
                      color: 
                        reporte.estado === 'aprobado' ? '#2e7d32' : 
                        reporte.estado === 'pendiente' ? '#e65100' : '#c62828',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {reporte.estado === 'aprobado' ? 'Aprobado' : 
                     reporte.estado === 'pendiente' ? 'Pendiente' : 'Rechazado'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDialog(reporte)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(reporte.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar reporte */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Reporte' : 'Nuevo Reporte'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Instructor"
              name="instructor"
              value={currentReporte?.instructor || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Actividad"
              name="actividad"
              value={currentReporte?.actividad || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={currentReporte?.fecha || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Observaciones"
              name="observaciones"
              value={currentReporte?.observaciones || ''}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={currentReporte?.estado || 'pendiente'}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="aprobado">Aprobado</MenuItem>
                <MenuItem value="rechazado">Rechazado</MenuItem>
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

const Reports = () => {
  return (
    <Routes>
      <Route path="/" element={<ReporteList />} />
    </Routes>
  );
};

export default Reports;