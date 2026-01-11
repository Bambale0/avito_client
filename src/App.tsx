import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Box, Typography, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Menu, MenuItem } from '@mui/material'
import { Menu as MenuIcon, Dashboard, Assessment, Campaign, Message, Settings, Store, Email, Logout, AccountCircle } from '@mui/icons-material'

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import DashboardPage from './pages/DashboardPage'
import AdsPage from './pages/AdsPage'
import StatsPage from './pages/StatsPage'
import MessengerPage from './pages/MessengerPage'
import AutoloadPage from './pages/AutoloadPage'
import SettingsPage from './pages/SettingsPage'
import EmailPage from './pages/EmailPage'
import LoginPage from './pages/LoginPage'

// Основной компонент приложения с навигацией
const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null)

  const menuItems = [
    { text: 'Дашборд', icon: <Dashboard />, path: '/' },
    { text: 'Объявления', icon: <Store />, path: '/ads' },
    { text: 'Статистика', icon: <Assessment />, path: '/stats' },
    { text: 'Мессенджер', icon: <Message />, path: '/messenger' },
    { text: 'Автозагрузка', icon: <Campaign />, path: '/autoload' },
    { text: 'Email', icon: <Email />, path: '/email' },
    { text: 'Настройки', icon: <Settings />, path: '/settings' },
  ]

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = async () => {
    await logout()
    handleUserMenuClose()
  }

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Avito API Client
        </Typography>
        {user && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
              {user.name?.charAt(0) || <AccountCircle />}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component="a" href={item.path} onClick={toggleDrawer}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Выйти" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Avito API Client
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user?.name}
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.name?.charAt(0) || <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Выйти
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" component="a" href="/login">
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {drawer}
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads"
            element={
              <ProtectedRoute>
                <AdsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <ProtectedRoute>
                <MessengerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autoload"
            element={
              <ProtectedRoute>
                <AutoloadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email"
            element={
              <ProtectedRoute>
                <EmailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  )
}

// Основной компонент с провайдером аутентификации
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App