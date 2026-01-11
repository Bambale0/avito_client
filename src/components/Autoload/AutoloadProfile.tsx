import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material'
import {
  Settings,
  Save,
  Refresh,
  Add,
  Delete,
} from '@mui/icons-material'
import { AutoloadProfileRequest, AutoloadProfileResponse } from '../../api/types'
import { autoloadService } from '../../services/autoloadService'

interface AutoloadProfileProps {
  onProfileUpdate?: () => void
}

const AutoloadProfile: React.FC<AutoloadProfileProps> = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState<AutoloadProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Форма редактирования
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<AutoloadProfileRequest>({
    autoload_enabled: false,
    feeds_data: [],
    report_email: '',
    schedule: [],
  })

  // Загрузка профиля
  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const profileData = await autoloadService.getAutoloadProfile()
      setProfile(profileData)
      setFormData({
        autoload_enabled: profileData.autoload_enabled,
        feeds_data: profileData.feeds_data || [],
        report_email: profileData.report_email,
        schedule: profileData.schedule || [],
      })
    } catch (err) {
      setError('Не удалось загрузить профиль автозагрузки')
      console.error('Error loading autoload profile:', err)
    } finally {
      setLoading(false)
    }
  }

  // Сохранение профиля
  const saveProfile = async () => {
    try {
      setSaving(true)
      setError(null)
      await autoloadService.updateAutoloadProfile(formData)
      await loadProfile()
      setEditMode(false)
      onProfileUpdate?.()
    } catch (err) {
      setError('Не удалось сохранить профиль')
      console.error('Error saving autoload profile:', err)
    } finally {
      setSaving(false)
    }
  }

  // Загрузка при монтировании
  useEffect(() => {
    loadProfile()
  }, [])

  // Добавление нового фида
  const addFeed = () => {
    setFormData(prev => ({
      ...prev,
      feeds_data: [
        ...prev.feeds_data,
        {
          url: '',
          format: 'avito',
          category: '',
          enabled: true,
        },
      ],
    }))
  }

  // Удаление фида
  const removeFeed = (index: number) => {
    setFormData(prev => ({
      ...prev,
      feeds_data: prev.feeds_data.filter((_, i) => i !== index),
    }))
  }

  // Обновление фида
  const updateFeed = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      feeds_data: prev.feeds_data.map((feed, i) =>
        i === index ? { ...feed, [field]: value } : feed
      ),
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Загрузка профиля автозагрузки...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
            Профиль автозагрузки
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadProfile}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Обновить
            </Button>
            {!editMode ? (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
              >
                Настроить
              </Button>
            ) : (
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false)
                    setFormData({
                      autoload_enabled: profile?.autoload_enabled || false,
                      feeds_data: profile?.feeds_data || [],
                      report_email: profile?.report_email || '',
                      schedule: profile?.schedule || [],
                    })
                  }}
                  sx={{ mr: 1 }}
                >
                  Отмена
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Сохранить'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ mb: 2 }} />

        {editMode ? (
          // Режим редактирования
          <Box>
            {/* Основные настройки */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Автозагрузка включена:
                </Typography>
                <Switch
                  checked={formData.autoload_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoload_enabled: e.target.checked }))}
                />
                <Chip
                  label={formData.autoload_enabled ? 'Включена' : 'Отключена'}
                  color={formData.autoload_enabled ? 'success' : 'default'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email для отчетов"
                value={formData.report_email}
                onChange={(e) => setFormData(prev => ({ ...prev, report_email: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Фиды */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  Источники данных (фиды)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={addFeed}
                >
                  Добавить фид
                </Button>
              </Box>

              {formData.feeds_data.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Нет настроенных фидов
                </Typography>
              ) : (
                <List>
                  {formData.feeds_data.map((feed, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" gap={2} mb={1}>
                            <TextField
                              size="small"
                              label="URL фида"
                              value={feed.url || ''}
                              onChange={(e) => updateFeed(index, 'url', e.target.value)}
                              sx={{ flex: 1 }}
                            />
                            <TextField
                              size="small"
                              label="Формат"
                              value={feed.format || 'avito'}
                              onChange={(e) => updateFeed(index, 'format', e.target.value)}
                              sx={{ width: 120 }}
                            />
                            <TextField
                              size="small"
                              label="Категория"
                              value={feed.category || ''}
                              onChange={(e) => updateFeed(index, 'category', e.target.value)}
                              sx={{ width: 150 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Typography variant="caption" sx={{ mr: 1 }}>
                                Статус:
                              </Typography>
                              <Switch
                                size="small"
                                checked={feed.enabled !== false}
                                onChange={(e) => updateFeed(index, 'enabled', e.target.checked)}
                              />
                              <Chip
                                label={feed.enabled !== false ? 'Активен' : 'Отключен'}
                                color={feed.enabled !== false ? 'success' : 'default'}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => removeFeed(index)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        ) : (
          // Режим просмотра
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Статус автозагрузки:
              </Typography>
              <Chip
                label={profile?.autoload_enabled ? 'Включена' : 'Отключена'}
                color={profile?.autoload_enabled ? 'success' : 'default'}
              />
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Email для отчетов: {profile?.report_email || 'Не указан'}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Настроенные фиды ({profile?.feeds_data?.length || 0}):
            </Typography>

            {profile?.feeds_data && profile.feeds_data.length > 0 ? (
              <List>
                {profile.feeds_data.map((feed: any, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">{feed.url}</Typography>
                          <Chip
                            label={feed.enabled !== false ? 'Активен' : 'Отключен'}
                            color={feed.enabled !== false ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={`Формат: ${feed.format}, Категория: ${feed.category}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Нет настроенных фидов
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AutoloadProfile