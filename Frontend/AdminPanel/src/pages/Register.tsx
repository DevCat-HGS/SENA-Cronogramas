import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validación básica
    if (!formData.usuario || !formData.nombre || !formData.apellido || !formData.correo || !formData.contraseña) {
      setFormError('Por favor, complete todos los campos');
      return;
    }

    if (formData.contraseña !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el contexto de autenticación
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          CTPGA Admin
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Registro de Administrador
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {formError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="usuario"
            label="Nombre de Usuario"
            autoComplete="username"
            autoFocus
            value={formData.usuario}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="nombre"
            label="Nombre"
            autoComplete="given-name"
            value={formData.nombre}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="apellido"
            label="Apellido"
            autoComplete="family-name"
            value={formData.apellido}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="correo"
            label="Correo electrónico"
            autoComplete="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="contraseña"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            value={formData.contraseña}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              ¿Ya tienes una cuenta? Inicia sesión
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;