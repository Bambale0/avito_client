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
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Campaign,
  Assignment,
  PlayArrow,
  Refresh,
  Visibility,
} from '@mui/icons-material'

import { AutoloadReportResponse, AutoloadReportsResponse } from '../api/types'
import { autoloadService } from '../services/autoloadService'
import AutoloadProfile from '../components/Autoload/AutoloadProfile'

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

const AutoloadPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [reports, setReports] = useState<AutoloadReportsResponse | null>(null)
  const [lastReport, setLastReport] = useState<AutoloadReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [runningUpload, setRunningUpload] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка отчетов
  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const reportsData = await autoloadService.getAutoloadReports({ per_page: 20 })
      setReports(reportsData)

      // Загружаем последний отчет
      try {
        const lastReportData = await autoloadService.getLastCompletedReport()
        setLastReport(lastReportData)
      } catch (err) {
        // Игнорируем ошибку, если нет завершенных отчетов
      }
    } catch (err) {
      setError('Не удалось загрузить отчеты автозагрузки')
      console.error('Error loading autoload reports:', err)
    } finally {
      setLoading(false)
    }
  }

  // Запуск автозагрузки
  const runAutoload = async () => {
    try {
      setRunningUpload(true)
      setError(null)
      await autoloadService.uploadAutoloadFeed()
      await loadReports() // Перезагружаем отчеты
    } catch (err) {
      setError('Не удалось запустить автозагрузку')
      console.error('Error running autoload:', err)
    } finally {
      setRunningUpload(false)
    }
  }

  // Загрузка при монтировании
  useEffect(() => {
    loadReports()
  }, [])

  // Обработчик обновления профиля
  const handleProfileUpdate = () => {
    loadReports()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Campaign sx={{ mr: 2, verticalAlign: 'middle' }} />
        Автозагрузка объявлений
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Профиль" />
          <Tab label="Отчеты" />
          <Tab label="Статистика" />
        </Tabs>
      </Box>

      {/* Вкладка профиля */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AutoloadProfile onProfileUpdate={handleProfileUpdate} />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Вкладка отчетов */}
      <TabPanel value={tabValue} index={1}>
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Отчеты автозагрузки
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadReports}
                disabled={loading}
                sx={{ mr: 1 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Обновить'}
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={runAutoload}
                disabled={runningUpload}
                color="success"
              >
                {runningUpload ? <CircularProgress size={20} /> : 'Запустить загрузку'}
              </Button>
            </Box>
          </Box>
        </Box>

        {reports?.reports && reports.reports.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Источник</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Начало</TableCell>
                  <TableCell>Завершение</TableCell>
                  <TableCell>Длительность</TableCell>
                  <TableCell>Объявлений</TableCell>
                  <TableCell>Ошибок</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.reports.map((report: any) => {
                  const statusInfo = autoloadService.getReportStatusInfo(report.status)
                  const stats = autoloadService.extractReportStats(report)

                  return (
                    <TableRow key={report.report_id}>
                      <TableCell>{report.report_id}</TableCell>
                      <TableCell>{report.source || 'Не указан'}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {autoloadService.formatReportDate(report.started_at)}
                      </TableCell>
                      <TableCell>
                        {report.finished_at
                          ? autoloadService.formatReportDate(report.finished_at)
                          : '—'
                        }
                      </TableCell>
                      <TableCell>
                        {autoloadService.calculateReportDuration(
                          report.started_at,
                          report.finished_at
                        )}
                      </TableCell>
                      <TableCell>{stats.processedItems}/{stats.totalItems}</TableCell>
                      <TableCell>
                        {stats.errors > 0 ? (
                          <Chip label={stats.errors} color="error" size="small" />
                        ) : (
                          '0'
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Просмотреть детали">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Нет отчетов автозагрузки
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Запустите автозагрузку, чтобы увидеть отчеты о выполненных операциях
              </Typography>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Вкладка статистики */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Последний отчет */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Последний отчет
                </Typography>

                {lastReport ? (
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">
                        Завершен: {autoloadService.formatReportDate(lastReport.finished_at)}
                      </Typography>
                      <Chip
                        label={autoloadService.getReportStatusInfo(lastReport.status).label}
                        color={autoloadService.getReportStatusInfo(lastReport.status).color}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Длительность: {autoloadService.calculateReportDuration(
                        lastReport.started_at,
                        lastReport.finished_at
                      )}
                    </Typography>

                    {(() => {
                      const stats = autoloadService.extractReportStats(lastReport)
                      return (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Обработано объявлений: {stats.processedItems} из {stats.totalItems}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Ошибок: {stats.errors}
                          </Typography>
                          <Typography variant="body2">
                            Комиссия: {stats.fees} ₽
                          </Typography>
                        </Box>
                      )
                    })()}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Нет завершенных отчетов
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Общая статистика */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Общая статистика
                </Typography>

                {reports?.reports ? (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Всего отчетов: {reports.reports.length}
                    </Typography>

                    {(() => {
                      const totalStats = (reports.reports as any[]).reduce((acc, report: any) => {
                        const stats = autoloadService.extractReportStats(report)
                        return {
                          total: acc.total + stats.totalItems,
                          processed: acc.processed + stats.processedItems,
                          errors: acc.errors + stats.errors,
                          fees: acc.fees + stats.fees,
                        }
                      }, { total: 0, processed: 0, errors: 0, fees: 0 })

                      return (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Обработано объявлений: {totalStats.processed} из {totalStats.total}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Всего ошибок: {totalStats.errors}
                          </Typography>
                          <Typography variant="body2">
                            Общая комиссия: {totalStats.fees} ₽
                          </Typography>
                        </Box>
                      )
                    })()}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Нет данных для статистики
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  )
}

export default AutoloadPage