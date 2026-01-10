import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Box, Typography, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { Menu as MenuIcon, Dashboard, Assessment, Campaign, Message, Settings, Store } from '@mui/icons-material'

// Pages
import DashboardPage from './pages/DashboardPage'
import AdsPage from './pages/AdsPage'
import StatsPage from './pages/StatsPage'
import MessengerPage from './pages/MessengerPage'
import AutoloadPage from './pages/AutoloadPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const menuItems = [
    { text: 'Дашборд', icon: <Dashboard />, path: '/' },
    { text: 'Объявления', icon: <Store />, path: '/ads' },
    { text: 'Статистика', icon: <Assessment />, path: '/stats' },
    { text: 'Мессенджер', icon: <Message />, path: '/messenger' },
    { text: 'Автозагрузка', icon: <Campaign />, path: '/autoload' },
    { text: 'Настройки', icon: <Settings />, path: '/settings' },
  ]

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Avito API Client
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component="a" href={item.path}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          <Button color="inherit">Войти</Button>
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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/messenger" element={<MessengerPage />} />
          <Route path="/autoload" element={<AutoloadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
