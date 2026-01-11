import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Settings,
  Notifications,
  Palette,
  Language,
  Download,
  Upload,
  Refresh,
  Info,
} from '@mui/icons-material'

import WebhookSettings from '../components/Settings/WebhookSettings'
import { settingsService } from '../services/settingsService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
)

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [systemInfo, setSystemInfo] = useState<any>(null)

  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
  })

  // Настройки темы
  const [themeSettings, setThemeSettings] = useState({
    mode: 'auto' as 'light' | 'dark' | 'auto',
    primaryColor: '#1976d2',
  })

  // Настройки языка
  const [languageSettings, setLanguageSettings] = useState({
    language: 'ru',
    timezone: 'Europe/Moscow',
  })

  // Диалоги
  const [exportDialog, setExportDialog] = useState(false)
  const [importDialog, setImportDialog] = useState(false)
  const [resetDialog, setResetDialog] = useState(false)
  const [exportedSettings, setExportedSettings] = useState('')
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  // Загрузка настроек при монтировании
  useEffect(() => {
    setNotificationSettings(settingsService.getNotificationSettings())
    setThemeSettings(settingsService.getThemeSettings())
    setLanguageSettings(settingsService.getLanguageSettings())

    // Загрузка системной информации
    settingsService.getSystemInfo().then(setSystemInfo)
  }, [])

  // Сохранение настроек уведомлений
  const handleSaveNotifications = () => {
    settingsService.saveNotificationSettings(notificationSettings)
  }

  // Сохранение настроек темы
  const handleSaveTheme = () => {
    settingsService.saveThemeSettings(themeSettings)
  }

  // Сохранение настроек языка
  const handleSaveLanguage = () => {
    settingsService.saveLanguageSettings(languageSettings)
  }

  // Экспорт настроек
  const handleExportSettings = () => {
    const settings = settingsService.exportSettings()
    setExportedSettings(settings)
    setExportDialog(true)
  }

  // Импорт настроек
  const handleImportSettings = () => {
    const result = settingsService.importSettings(importText)
    if (result.success) {
      setImportDialog(false)
      setImportText('')
      setImportError(null)
      // Перезагрузка страницы для применения новых настроек
      window.location.reload()
    } else {
      setImportError(result.error || 'Ошибка импорта')
    }
  }

  // Сброс настроек
  const handleResetSettings = () => {
    settingsService.resetSettings()
    setResetDialog(false)
    window.location.reload()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Settings sx={{ mr: 2, verticalAlign: 'middle' }} />
        Настройки
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Уведомления" />
          <Tab label="Внешний вид" />
          <Tab label="Webhook'и" />
          <Tab label="Система" />
        </Tabs>
      </Box>

      {/* Вкладка уведомлений */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Настройки уведомлений
                </Typography>

                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                      />
                    }
                    label="Email уведомления"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.push}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, push: e.target.checked }))}
                      />
                    }
                    label="Push уведомления в браузере"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.sms}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, sms: e.target.checked }))}
                      />
                    }
                    label="SMS уведомления"
                  />
                </Box>

                <Box mt={3}>
                  <Button variant="contained" onClick={handleSaveNotifications}>
                    Сохранить настройки
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Типы уведомлений
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Chip label="Новые сообщения" color="primary" size="small" />
                  <Chip label="Изменения в объявлениях" color="success" size="small" />
                  <Chip label="Завершение автозагрузки" color="warning" size="small" />
                  <Chip label="Системные оповещения" color="error" size="small" />
                  <Chip label="Финансовые операции" color="info" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Вкладка внешнего вида */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Тема приложения
                </Typography>

                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <TextField
                    select
                    label="Тема"
                    value={themeSettings.mode}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, mode: e.target.value as any }))}
                    SelectProps={{ native: true }}
                  >
                    <option value="light">Светлая</option>
                    <option value="dark">Темная</option>
                    <option value="auto">Автоматически</option>
                  </TextField>

                  <TextField
                    label="Основной цвет"
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { height: 56 } }}
                  />
                </Box>

                <Box mt={3}>
                  <Button variant="contained" onClick={handleSaveTheme}>
                    Сохранить тему
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Язык и регион
                </Typography>

                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <TextField
                    select
                    label="Язык интерфейса"
                    value={languageSettings.language}
                    onChange={(e) => setLanguageSettings(prev => ({ ...prev, language: e.target.value }))}
                    SelectProps={{ native: true }}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </TextField>

                  <TextField
                    select
                    label="Часовой пояс"
                    value={languageSettings.timezone}
                    onChange={(e) => setLanguageSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    SelectProps={{ native: true }}
                  >
                    <option value="Europe/Moscow">Москва (MSK)</option>
                    <option value="Europe/London">Лондон (GMT)</option>
                    <option value="America/New_York">Нью-Йорк (EST)</option>
                  </TextField>
                </Box>

                <Box mt={3}>
                  <Button variant="contained" onClick={handleSaveLanguage}>
                    Сохранить настройки
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Вкладка webhook'ов */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WebhookSettings />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Вкладка системы */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Информация о системе
                </Typography>

                {systemInfo ? (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Версия:</Typography>
                      <Chip label={systemInfo.version} size="small" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Среда:</Typography>
                      <Chip label={systemInfo.environment} size="small" color="primary" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Время работы:</Typography>
                      <Typography variant="body2">
                        {Math.floor((Date.now() - systemInfo.uptime) / 1000 / 60)} мин
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Загрузка информации о системе...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Импорт/Экспорт настроек
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Сохраните или восстановите свои настройки приложения
                </Typography>

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleExportSettings}
                    fullWidth
                  >
                    Экспорт
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Upload />}
                    onClick={() => setImportDialog(true)}
                    fullWidth
                  >
                    Импорт
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Refresh />}
                  onClick={() => setResetDialog(true)}
                  fullWidth
                >
                  Сбросить настройки
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Диалог экспорта настроек */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Экспорт настроек</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={exportedSettings}
            InputProps={{ readOnly: true }}
            sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Закрыть</Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(exportedSettings)
              alert('Настройки скопированы в буфер обмена')
            }}
            variant="contained"
          >
            Копировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог импорта настроек */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Импорт настроек</DialogTitle>
        <DialogContent>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          <TextField
            multiline
            rows={10}
            fullWidth
            label="JSON с настройками"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            sx={{ fontFamily: 'monospace', fontSize: '0.8.8rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Отмена</Button>
          <Button
            onClick={handleImportSettings}
            variant="contained"
            disabled={!importText.trim()}
          >
            Импортировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог сброса настроек */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>Сброс настроек</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)}>Отмена</Button>
          <Button onClick={handleResetSettings} color="error" variant="contained">
            Сбросить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SettingsPage