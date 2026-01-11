import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Email,
  Send,
  Inbox,
  Settings as SettingsIcon,
  Delete,
  Add,
  CheckCircle,
} from '@mui/icons-material'

import { emailService } from '../services/emailService'
import {
  EmailConfigResponse,
  SendEmailRequest,
  ReceiveEmailResponse,
} from '../api/types'

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

const EmailPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  // Конфигурации
  const [configs, setConfigs] = useState<EmailConfigResponse[]>([])
  const [currentConfig, setCurrentConfig] = useState<EmailConfigResponse | null>(null)

  // Отправка писем
  const [sendForm, setSendForm] = useState<SendEmailRequest>({
    to_email: '',
    subject: '',
    content: '',
  })

  // Получение писем
  const [receivedEmails, setReceivedEmails] = useState<ReceiveEmailResponse[]>([])
  const [emailsLimit, setEmailsLimit] = useState(10)

  // Состояния
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Диалоги
  const [configDialog, setConfigDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteConfigId, setDeleteConfigId] = useState<string | null>(null)

  // Форма конфигурации
  const [configForm, setConfigForm] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_use_tls: true,
    smtp_use_ssl: false,
    email_from: '',
    imap_host: 'imap.gmail.com',
    imap_port: 993,
    imap_username: '',
    imap_password: '',
    imap_use_ssl: true,
  })

  // Загрузка данных при монтировании
  useEffect(() => {
    loadConfigs()
  }, [])

  // Загрузка конфигураций
  const loadConfigs = async () => {
    try {
      setLoading(true)
      const configsData = await emailService.getEmailConfigs()
      setConfigs(configsData)
    } catch (err) {
      setError('Не удалось загрузить конфигурации email')
      console.error('Error loading configs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Создание/обновление конфигурации
  const handleSaveConfig = async () => {
    try {
      setLoading(true)
      setError(null)

      if (currentConfig) {
        await emailService.updateEmailConfig(currentConfig.config_id, {
          ...configForm,
          user_id: currentConfig.user_id,
        })
        setSuccess('Конфигурация обновлена')
      } else {
        await emailService.createEmailConfig({
          ...configForm,
          user_id: 'current-user', // TODO: получить текущего пользователя
        })
        setSuccess('Конфигурация создана')
      }

      setConfigDialog(false)
      loadConfigs()
    } catch (err) {
      setError('Не удалось сохранить конфигурацию')
      console.error('Error saving config:', err)
    } finally {
      setLoading(false)
    }
  }

  // Удаление конфигурации
  const handleDeleteConfig = async () => {
    if (!deleteConfigId) return

    try {
      setLoading(true)
      await emailService.deleteEmailConfig(deleteConfigId)
      setSuccess('Конфигурация удалена')
      setDeleteDialog(false)
      setDeleteConfigId(null)
      loadConfigs()
    } catch (err) {
      setError('Не удалось удалить конфигурацию')
      console.error('Error deleting config:', err)
    } finally {
      setLoading(false)
    }
  }

  // Отправка письма
  const handleSendEmail = async () => {
    try {
      setSending(true)
      setError(null)

      await emailService.sendEmail(sendForm)
      setSuccess('Письмо отправлено')
      setSendForm({ to_email: '', subject: '', content: '' })
    } catch (err) {
      setError('Не удалось отправить письмо')
      console.error('Error sending email:', err)
    } finally {
      setSending(false)
    }
  }

  // Получение писем
  const handleReceiveEmails = async () => {
    try {
      setReceiving(true)
      setError(null)

      const emails = await emailService.receiveEmails('current-user', emailsLimit)
      setReceivedEmails(emails)
      setSuccess(`Получено ${emails.length} писем`)
    } catch (err) {
      setError('Не удалось получить письма')
      console.error('Error receiving emails:', err)
    } finally {
      setReceiving(false)
    }
  }

  // Тестирование конфигурации
  const handleTestConfig = async () => {
    try {
      setLoading(true)
      await emailService.testEmailConfig('current-user')
      setSuccess('Тест прошел успешно')
    } catch (err) {
      setError('Тест не прошел')
      console.error('Error testing config:', err)
    } finally {
      setLoading(false)
    }
  }

  // Открытие диалога редактирования
  const handleEditConfig = (config: EmailConfigResponse) => {
    setCurrentConfig(config)
    setConfigForm({
      smtp_host: config.smtp_host,
      smtp_port: config.smtp_port,
      smtp_username: config.smtp_username,
      email_from: config.email_from,
      smtp_password: '', // Не показываем пароль
      smtp_use_tls: config.smtp_use_tls,
      smtp_use_ssl: config.smtp_use_ssl,
      imap_host: config.imap_host,
      imap_port: config.imap_port,
      imap_username: config.imap_username,
      imap_password: '', // Не показываем пароль
      imap_use_ssl: config.imap_use_ssl,
    })
    setConfigDialog(true)
  }

  // Открытие диалога создания
  const handleNewConfig = () => {
    setCurrentConfig(null)
    setConfigForm({
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_use_tls: true,
      smtp_use_ssl: false,
      email_from: '',
      imap_host: 'imap.gmail.com',
      imap_port: 993,
      imap_username: '',
      imap_password: '',
      imap_use_ssl: true,
    })
    setConfigDialog(true)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Email sx={{ mr: 2, verticalAlign: 'middle' }} />
        Email управление
      </Typography>

      {(error || success) && (
        <Alert
          severity={error ? 'error' : 'success'}
          sx={{ mb: 3 }}
          onClose={() => {
            setError(null)
            setSuccess(null)
          }}
        >
          {error || success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Конфигурации" />
          <Tab label="Отправка" />
          <Tab label="Входящие" />
        </Tabs>
      </Box>

      {/* Вкладка конфигураций */}
      <TabPanel value={tabValue} index={0}>
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleNewConfig}
          >
            Добавить конфигурацию
          </Button>
        </Box>

        {configs.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>SMTP сервер</TableCell>
                  <TableCell>IMAP сервер</TableCell>
                  <TableCell>Создана</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.config_id}>
                    <TableCell>{config.email_from}</TableCell>
                    <TableCell>{config.smtp_host}:{config.smtp_port}</TableCell>
                    <TableCell>{config.imap_host}:{config.imap_port}</TableCell>
                    <TableCell>
                      {new Date(config.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Тестировать">
                        <IconButton
                          size="small"
                          onClick={handleTestConfig}
                          disabled={loading}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton
                          size="small"
                          onClick={() => handleEditConfig(config)}
                        >
                          <SettingsIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeleteConfigId(config.config_id)
                            setDeleteDialog(true)
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Email sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Нет email конфигураций
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Добавьте конфигурацию для отправки и получения email
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleNewConfig}>
                Добавить конфигурацию
              </Button>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Вкладка отправки */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Отправка email
                </Typography>

                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Получатель"
                    type="email"
                    value={sendForm.to_email}
                    onChange={(e) => setSendForm(prev => ({ ...prev, to_email: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Тема"
                    value={sendForm.subject}
                    onChange={(e) => setSendForm(prev => ({ ...prev, subject: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Содержание"
                    value={sendForm.content}
                    onChange={(e) => setSendForm(prev => ({ ...prev, content: e.target.value }))}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleSendEmail}
                    disabled={sending || !sendForm.to_email || !sendForm.subject || !sendForm.content}
                  >
                    {sending ? <CircularProgress size={20} /> : 'Отправить'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Шаблоны
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Chip
                    label="Ответ на запрос"
                    clickable
                    onClick={() => setSendForm(prev => ({
                      ...prev,
                      subject: 'Re: Ваш запрос',
                      content: 'Здравствуйте!\n\nСпасибо за ваш запрос. Мы рассмотрим его в ближайшее время.\n\nС уважением,\nКоманда поддержки'
                    }))}
                  />
                  <Chip
                    label="Подтверждение заказа"
                    clickable
                    onClick={() => setSendForm(prev => ({
                      ...prev,
                      subject: 'Подтверждение заказа',
                      content: 'Здравствуйте!\n\nВаш заказ успешно оформлен. Номер заказа: #12345\n\nСпасибо за покупку!'
                    }))}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Вкладка входящих */}
      <TabPanel value={tabValue} index={2}>
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Входящие письма
            </Typography>
            <Box>
              <TextField
                select
                size="small"
                label="Количество"
                value={emailsLimit}
                onChange={(e) => setEmailsLimit(Number(e.target.value))}
                sx={{ mr: 1, minWidth: 100 }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </TextField>
              <Button
                variant="outlined"
                startIcon={<Inbox />}
                onClick={handleReceiveEmails}
                disabled={receiving}
              >
                {receiving ? <CircularProgress size={20} /> : 'Получить'}
              </Button>
            </Box>
          </Box>
        </Box>

        {receivedEmails.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>От</TableCell>
                  <TableCell>Тема</TableCell>
                  <TableCell>Чат</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Время</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receivedEmails.map((email) => (
                  <TableRow key={email.message_id}>
                    <TableCell>{email.from_email}</TableCell>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>{email.chat_id}</TableCell>
                    <TableCell>
                      <Chip
                        label={email.status}
                        color={email.status === 'processed' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date().toLocaleString('ru-RU')} {/* TODO: добавить timestamp */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Inbox sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Нет входящих писем
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Нажмите "Получить" чтобы загрузить последние письма
              </Typography>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Диалог конфигурации email */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentConfig ? 'Редактирование' : 'Создание'} email конфигурации
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                SMTP настройки
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP сервер"
                value={configForm.smtp_host}
                onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_host: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP порт"
                type="number"
                value={configForm.smtp_port}
                onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_port: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP логин"
                value={configForm.smtp_username}
                onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_username: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP пароль"
                type="password"
                value={configForm.smtp_password}
                onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_password: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={configForm.smtp_use_tls}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_use_tls: e.target.checked }))}
                  />
                }
                label="Использовать TLS"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={configForm.smtp_use_ssl}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, smtp_use_ssl: e.target.checked }))}
                  />
                }
                label="Использовать SSL"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email отправителя"
                type="email"
                value={configForm.email_from}
                onChange={(e) => setConfigForm(prev => ({ ...prev, email_from: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                IMAP настройки
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IMAP сервер"
                value={configForm.imap_host}
                onChange={(e) => setConfigForm(prev => ({ ...prev, imap_host: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IMAP порт"
                type="number"
                value={configForm.imap_port}
                onChange={(e) => setConfigForm(prev => ({ ...prev, imap_port: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IMAP логин"
                value={configForm.imap_username}
                onChange={(e) => setConfigForm(prev => ({ ...prev, imap_username: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IMAP пароль"
                type="password"
                value={configForm.imap_password}
                onChange={(e) => setConfigForm(prev => ({ ...prev, imap_password: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={configForm.imap_use_ssl}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, imap_use_ssl: e.target.checked }))}
                  />
                }
                label="Использовать SSL"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Отмена</Button>
          <Button
            onClick={handleSaveConfig}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления конфигурации */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Удаление конфигурации</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эту email конфигурацию?
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Отмена</Button>
          <Button
            onClick={handleDeleteConfig}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailPage