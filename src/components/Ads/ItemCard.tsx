import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Launch,
  Edit,
  ShoppingCart,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material'
import { ItemInfoResponse } from '../../api/types'
import { adsService } from '../../services/adsService'

interface ItemCardProps {
  itemId: number
  item?: ItemInfoResponse
  onItemUpdate?: () => void
}

const ItemCard: React.FC<ItemCardProps> = ({ itemId, item: initialItem, onItemUpdate }) => {
  const [item, setItem] = useState<ItemInfoResponse | null>(initialItem || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceDialog, setPriceDialog] = useState(false)
  const [vasDialog, setVasDialog] = useState(false)
  const [newPrice, setNewPrice] = useState('')
  const [selectedVas, setSelectedVas] = useState<string[]>([])
  const [operationLoading, setOperationLoading] = useState(false)

  // Загрузка информации об объявлении
  const loadItem = async () => {
    try {
      setLoading(true)
      setError(null)
      const itemData = await adsService.getItemInfo(itemId)
      setItem(itemData)
    } catch (err) {
      setError('Не удалось загрузить информацию об объявлении')
      console.error('Error loading item:', err)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка при монтировании, если нет начальных данных
  React.useEffect(() => {
    if (!initialItem) {
      loadItem()
    }
  }, [itemId])

  // Обновление цены
  const handleUpdatePrice = async () => {
    if (!newPrice || isNaN(Number(newPrice))) return

    try {
      setOperationLoading(true)
      await adsService.updateItemPrice(itemId, { price: Number(newPrice) })
      setPriceDialog(false)
      setNewPrice('')
      await loadItem()
      onItemUpdate?.()
    } catch (err) {
      setError('Не удалось обновить цену')
      console.error('Error updating price:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  // Применение услуг
  const handleApplyVas = async () => {
    try {
      setOperationLoading(true)
      await adsService.applyVas(itemId, { slugs: selectedVas })
      setVasDialog(false)
      setSelectedVas([])
      await loadItem()
      onItemUpdate?.()
    } catch (err) {
      setError('Не удалось применить услуги')
      console.error('Error applying VAS:', err)
    } finally {
      setOperationLoading(false)
    }
  }

  // Получение статуса объявления
  const getStatusInfo = (status: string) => {
    const statusMap = {
      'active': { label: 'Активно', color: 'success' as const, icon: <CheckCircle /> },
      'inactive': { label: 'Неактивно', color: 'default' as const, icon: <Info /> },
      'blocked': { label: 'Заблокировано', color: 'error' as const, icon: <Error /> },
    }

    return statusMap[status as keyof typeof statusMap] || statusMap.inactive
  }

  // Доступные услуги
  const availableVas = adsService.getAvailableVasServices()

  if (loading && !item) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Загрузка объявления...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (!item) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Объявление не найдено
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const statusInfo = getStatusInfo(item.status)
  const activeVasSlugs = item.vas.map(v => v.slug)

  return (
    <>
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Статус и ID */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              color={statusInfo.color}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              ID: {itemId}
            </Typography>
          </Box>

          {/* Ссылка на объявление */}
          <Box mb={2}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Launch />}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mb: 1 }}
            >
              Открыть на Avito
            </Button>
          </Box>

          {/* Активные услуги */}
          {item.vas.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Активные услуги:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {item.vas.map((vas) => (
                  <Tooltip key={vas.slug} title={adsService.getVasDescription(vas.slug)}>
                    <Chip
                      label={`${adsService.getVasDescription(vas.slug).split(' - ')[0]} (${adsService.formatPrice(vas.price)})`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          {/* Временные рамки */}
          {item.start_time && item.finish_time && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Активно: {new Date(item.start_time).toLocaleDateString('ru-RU')} - {new Date(item.finish_time).toLocaleDateString('ru-RU')}
              </Typography>
            </Box>
          )}

          {/* Avito ID */}
          {item.autoload_item_id && (
            <Typography variant="body2" color="text.secondary">
              Avito ID: {item.autoload_item_id}
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => setPriceDialog(true)}
          >
            Изменить цену
          </Button>
          <Button
            size="small"
            startIcon={<ShoppingCart />}
            onClick={() => setVasDialog(true)}
          >
            Услуги ({item.vas.length})
          </Button>
        </CardActions>
      </Card>

      {/* Диалог изменения цены */}
      <Dialog open={priceDialog} onClose={() => setPriceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Изменить цену объявления</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Новая цена (руб.)"
            type="number"
            fullWidth
            variant="outlined"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceDialog(false)}>Отмена</Button>
          <Button
            onClick={handleUpdatePrice}
            variant="contained"
            disabled={!newPrice || operationLoading}
          >
            {operationLoading ? <CircularProgress size={20} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог управления услугами */}
      <Dialog open={vasDialog} onClose={() => setVasDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Управление услугами продвижения</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Выберите услуги, которые хотите применить к объявлению:
          </Typography>

          <Box display="flex" flexDirection="column" gap={1}>
            {availableVas.map((vas) => (
              <Box
                key={vas.slug}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: activeVasSlugs.includes(vas.slug) ? 'action.selected' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => {
                  const isSelected = selectedVas.includes(vas.slug)
                  if (isSelected) {
                    setSelectedVas(selectedVas.filter(s => s !== vas.slug))
                  } else {
                    setSelectedVas([...selectedVas, vas.slug])
                  }
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2">{vas.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vas.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={activeVasSlugs.includes(vas.slug) ? 'Активно' : 'Не активно'}
                    color={activeVasSlugs.includes(vas.slug) ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVasDialog(false)}>Отмена</Button>
          <Button
            onClick={handleApplyVas}
            variant="contained"
            disabled={selectedVas.length === 0 || operationLoading}
          >
            {operationLoading ? <CircularProgress size={20} /> : 'Применить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ItemCard