import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Box } from '@mui/material'
import { Menu as MenuIcon, AccountCircle, Notifications } from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  sidebarOpen: boolean
  onMenuClick: () => void
}

const Navbar = ({ sidebarOpen, onMenuClick }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CTPGA Admin
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Notifications />
          </IconButton>
          
          <IconButton
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            <MenuItem onClick={handleClose}>Configuración</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar