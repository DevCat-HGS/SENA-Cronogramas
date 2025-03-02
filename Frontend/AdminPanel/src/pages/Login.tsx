import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [formError, setFormError] = useState('');
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validación básica
    if (!usuario || !contraseña) {
      setFormError('Por favor, complete todos los campos');
      return;
    }

    try {
      await login(usuario, contraseña);
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el contexto de autenticación
    }
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
          Iniciar sesión
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {formError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="usuario"
            label="Usuario"
            name="usuario"
            autoComplete="username"
            autoFocus
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="contraseña"
            label="Contraseña"
            type="password"
            id="contraseña"
            autoComplete="current-password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/register" variant="body2">
              ¿No tienes una cuenta? Regístrate
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;