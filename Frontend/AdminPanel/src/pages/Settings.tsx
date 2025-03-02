import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Switch, FormControlLabel, Alert, CircularProgress, Divider } from '@mui/material';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la configuración
  const [settings, setSettings] = useState({
    siteName: 'CTPGA Admin',
    emailNotifications: true,
    backupFrequency: 'daily',
    apiUrl: 'http://localhost:5000/api',
    maxUploadSize: '10'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      // Aquí iría la llamada a la API para guardar la configuración
      // await settingsService.saveSettings(settings);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" className="page-title" sx={{ mb: 3 }}>
        Configuración del Sistema
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          La configuración se ha guardado correctamente.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Configuración General
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="siteName"
                label="Nombre del Sitio"
                value={settings.siteName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="apiUrl"
                label="URL de la API"
                value={settings.apiUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Notificaciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    name="emailNotifications"
                    color="primary"
                  />
                }
                label="Activar notificaciones por correo electrónico"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Copias de Seguridad
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                name="backupFrequency"
                label="Frecuencia de Copias de Seguridad"
                value={settings.backupFrequency}
                onChange={handleChange}
                fullWidth
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="maxUploadSize"
                label="Tamaño máximo de archivos (MB)"
                value={settings.maxUploadSize}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Guardar Configuración'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;