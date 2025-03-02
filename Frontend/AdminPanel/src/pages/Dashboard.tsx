import { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader, CircularProgress } from '@mui/material'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { People as PeopleIcon, School as SchoolIcon, Description as DescriptionIcon, Event as EventIcon } from '@mui/icons-material'

// Mock data - would be replaced with API calls
const activityStatusData = [
  { name: 'En progreso', value: 12, color: '#1976d2' },
  { name: 'Completadas', value: 8, color: '#4caf50' },
  { name: 'Pendientes', value: 5, color: '#ff9800' },
]

const reportStatusData = [
  { name: 'Aprobados', value: 15, color: '#4caf50' },
  { name: 'Pendientes', value: 7, color: '#ff9800' },
  { name: 'Rechazados', value: 3, color: '#f44336' },
]

const monthlyActivitiesData = [
  { name: 'Ene', actividades: 4 },
  { name: 'Feb', actividades: 6 },
  { name: 'Mar', actividades: 8 },
  { name: 'Abr', actividades: 10 },
  { name: 'May', actividades: 7 },
  { name: 'Jun', actividades: 9 },
]

const summaryCards = [
  { title: 'Instructores', value: 24, icon: <PeopleIcon color="primary" sx={{ fontSize: 40 }} />, color: '#e3f2fd' },
  { title: 'Actividades', value: 25, icon: <SchoolIcon color="secondary" sx={{ fontSize: 40 }} />, color: '#fce4ec' },
  { title: 'Reportes', value: 18, icon: <DescriptionIcon sx={{ fontSize: 40, color: '#ff9800' }} />, color: '#fff3e0' },
  { title: 'Eventos', value: 7, icon: <EventIcon sx={{ fontSize: 40, color: '#4caf50' }} />, color: '#e8f5e9' },
]

const Dashboard = () => {
  const [loading, setLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" className="page-title">
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ bgcolor: card.color }} className="card-dashboard">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Activity Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Estado de Actividades
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Report Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Estado de Reportes
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Activities Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actividades Mensuales
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivitiesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actividades" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard