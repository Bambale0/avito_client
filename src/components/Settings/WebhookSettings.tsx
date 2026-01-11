import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Link,
  Add,
  Delete,
  CheckCircle,
  Refresh,
} from '@mui/icons-material'
import { settingsService } from '../../services/settingsService'

interface WebhookSettingsProps {
  onWebhookUpdate?: () => void
}

const WebhookSettings: React.FC<WebhookSettingsProps> = ({ onWebhookUpdate }) => {
  const [webhooks, setWebhooks] = useState<string[]>([])
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [testDialog, setTestDialog] = useState(false)
  const [testWebhookUrl, setTestWebhookUrl] = useState('')

  // Загрузка сохраненных webhook'ов
  useEffect(() => {
    const savedWebhooks = localStorage.getItem('webhooks')
    if (savedWebhooks) {
      setWebhooks(JSON.parse(savedWebhooks))
    }
  }, [])

  // Сохранение webhook'ов в localStorage
  const saveWebhooks = (newWebhooks: string[]) => {
    localStorage.setItem('webhooks', JSON.stringify(newWebhooks))
    setWebhooks(newWebhooks)
  }

  // Добавление webhook
  const handleAddWebhook = () => {
    if (!newWebhookUrl.trim()) return

    const validation = settingsService.validateWebhookUrl(newWebhookUrl.trim())
    if (!validation.isValid) {
      setError(validation.error || 'Некорректный URL')
      return
    }

    if (webhooks.includes(newWebhookUrl.trim())) {
      setError('Этот webhook уже добавлен')
      return
    }

    const updatedWebhooks = [...webhooks, newWebhookUrl.trim()]
    saveWebhooks(updatedWebhooks)
    setNewWebhookUrl('')
    setError(null)
  }

  // Удаление webhook
  const handleRemoveWebhook = (url: string) => {
    const updatedWebhooks = webhooks.filter(w => w !== url)
    saveWebhooks(updatedWebhooks)
  }

  // Подписка на webhook
  const handleSubscribe = async (url: string) => {
    try {
      setSubscribing(url)
      setError(null)
      await settingsService.subscribeWebhook({ url })
      setSuccess(`Успешно подписались на webhook: ${url}`)
      onWebhookUpdate?.()
    } catch (err) {
      setError('Не удалось подписаться на webhook')
      console.error('Webhook subscription error:', err)
    } finally {
      setSubscribing(null)
    }
  }

  // Отписка от webhook
  const handleUnsubscribe = async (url: string) => {
    try {
      setUnsubscribing(url)
      setError(null)
      await settingsService.unsubscribeWebhook({ url })
      setSuccess(`Успешно отписались от webhook: ${url}`)
    } catch (err) {
      setError('Не удалось отписаться от webhook')
      console.error('Webhook unsubscription error:', err)
    } finally {
      setUnsubscribing(null)
    }
  }

  // Тестирование webhook
  const handleTestWebhook = () => {
    if (!testWebhookUrl.trim()) return

    // Имитация тестового запроса
    setTimeout(() => {
      setSuccess(`Тестовый запрос отправлен на: ${testWebhookUrl}`)
      setTestDialog(false)
      setTestWebhookUrl('')
    }, 1000)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Link sx={{ mr: 1, verticalAlign: 'middle' }} />
            Webhook уведомления
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Настройте webhook'и для получения уведомлений о событиях в реальном времени
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Добавление нового webhook */}
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="URL webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWebhook()}
              placeholder="https://example.com/webhook"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddWebhook}
              disabled={!newWebhookUrl.trim()}
            >
              Добавить
            </Button>
            <Button
              variant="outlined"
              onClick={() => setTestDialog(true)}
            >
              Тест
            </Button>
          </Box>

          {/* Список webhook'ов */}
          {webhooks.length > 0 ? (
            <List>
              {webhooks.map((url) => (
                <ListItem key={url} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {url}
                        </Typography>
                        <Chip label="HTTP" size="small" variant="outlined" />
                      </Box>
                    }
                    secondary="Webhook для уведомлений"
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Подписаться">
                      <IconButton
                        onClick={() => handleSubscribe(url)}
                        disabled={subscribing === url}
                        color="success"
                        size="small"
                      >
                        {subscribing === url ? <CircularProgress size={20} /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Отписаться">
                      <IconButton
                        onClick={() => handleUnsubscribe(url)}
                        disabled={unsubscribing === url}
                        color="warning"
                        size="small"
                      >
                        {unsubscribing === url ? <CircularProgress size={20} /> : <Refresh />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        onClick={() => handleRemoveWebhook(url)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Нет настроенных webhook'ов
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Добавьте URL для получения уведомлений о событиях
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Диалог тестирования webhook */}
      <Dialog open={testDialog} onClose={() => setTestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Тестирование webhook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL для тестирования"
            fullWidth
            variant="outlined"
            value={testWebhookUrl}
            onChange={(e) => setTestWebhookUrl(e.target.value)}
            placeholder="https://example.com/webhook"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Будет отправлен тестовый запрос с примером данных уведомления
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog(false)}>Отмена</Button>
          <Button
            onClick={handleTestWebhook}
            variant="contained"
            disabled={!testWebhookUrl.trim()}
          >
            Отправить тест
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default WebhookSettings