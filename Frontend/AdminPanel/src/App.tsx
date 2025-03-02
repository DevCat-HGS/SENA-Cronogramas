import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Instructors from './pages/Instructors'
import Activities from './pages/Activities'
import Reports from './pages/Reports'
import Events from './pages/Events'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, solo mostrar la página de login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
          mt: '64px',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/instructors/*" element={
            <ProtectedRoute>
              <Instructors />
            </ProtectedRoute>
          } />
          <Route path="/activities/*" element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          } />
          <Route path="/reports/*" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/events/*" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App