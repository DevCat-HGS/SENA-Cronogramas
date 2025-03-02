import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import { Dashboard as DashboardIcon, People as PeopleIcon, School as SchoolIcon, Description as DescriptionIcon, Event as EventIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Instructores', icon: <PeopleIcon />, path: '/instructors' },
  { text: 'Actividades', icon: <SchoolIcon />, path: '/activities' },
  { text: 'Reportes', icon: <DescriptionIcon />, path: '/reports' },
  { text: 'Eventos', icon: <EventIcon />, path: '/events' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
]

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <List sx={{ mt: '64px' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar