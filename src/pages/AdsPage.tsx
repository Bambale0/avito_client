import React, { useState } from 'react'
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import {
  Store,
  Add,
  ShoppingCart,
} from '@mui/icons-material'

import ItemCard from '../components/Ads/ItemCard'
import { adsService } from '../services/adsService'

interface ManagedItem {
  id: number
  item?: any
}

const AdsPage: React.FC = () => {
  const [itemId, setItemId] = useState('')
  const [managedItems, setManagedItems] = useState<ManagedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bulkDialog, setBulkDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Добавление объявления для управления
  const handleAddItem = () => {
    const id = parseInt(itemId)
    if (!id || isNaN(id)) {
      setError('Введите корректный ID объявления')
      return
    }

    if (managedItems.some(item => item.id === id)) {
      setError('Это объявление уже добавлено')
      return
    }

    setManagedItems([...managedItems, { id }])
    setItemId('')
    setError(null)
  }

  // Удаление объявления из списка
  const handleRemoveItem = (id: number) => {
    setManagedItems(managedItems.filter(item => item.id !== id))
    setSelectedItems(selectedItems.filter(selectedId => selectedId !== id))
  }

  // Обновление информации об объявлении
  const handleItemUpdate = () => {
    // Перезагрузка может быть добавлена при необходимости
  }

  // Клавиша Enter для добавления
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddItem()
    }
  }

  // Массовые операции
  const handleBulkVas = async (vasSlugs: string[]) => {
    if (selectedItems.length === 0) return

    try {
      setLoading(true)
      setError(null)

      // Применяем услуги ко всем выбранным объявлениям
      const promises = selectedItems.map(itemId =>
        adsService.applyVas(itemId, { slugs: vasSlugs })
      )

      await Promise.all(promises)

      // Обновляем информацию об объявлениях
      setManagedItems(managedItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, item: undefined } // Сброс кеша
        }
        return item
      }))

      setBulkDialog(false)
      setSelectedItems([])
    } catch (err) {
      setError('Не удалось применить массовые операции')
      console.error('Bulk operation error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Доступные массовые операции
  const bulkOperations = [
    {
      title: 'Премиум + Выделение',
      description: 'Применить премиум-статус и цветовое выделение',
      vasSlugs: ['premium', 'highlight'],
      color: 'primary' as const,
    },
    {
      title: 'VIP-пакет',
      description: 'Максимальная видимость: VIP + XL + Срочно',
      vasSlugs: ['vip', 'xl', 'urgent'],
      color: 'error' as const,
    },
    {
      title: 'Эконом',
      description: 'Базовое продвижение: выделение + XL',
      vasSlugs: ['highlight', 'xl'],
      color: 'success' as const,
    },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Store sx={{ mr: 2, verticalAlign: 'middle' }} />
        Управление объявлениями
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Панель поиска и добавления */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Добавить объявление для управления
          </Typography>

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="ID объявления"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              onKeyPress={handleKeyPress}
              type="number"
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              disabled={!itemId}
            >
              Добавить
            </Button>

            {managedItems.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={() => setBulkDialog(true)}
                disabled={selectedItems.length === 0}
              >
                Массовые операции ({selectedItems.length})
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Введите ID объявления с Avito для управления ценой и услугами продвижения
          </Typography>
        </CardContent>
      </Card>

      {/* Список управляемых объявлений */}
      {managedItems.length > 0 && (
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Управляемые объявления ({managedItems.length})
            </Typography>
            <Box display="flex" gap={1}>
              <Chip
                label={`${selectedItems.length} выбрано`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            {managedItems.map((managedItem) => (
              <Grid item xs={12} md={6} lg={4} key={managedItem.id}>
                <Box position="relative">
                  {/* Чекбокс для выбора */}
                  <Box position="absolute" top={8} right={8} zIndex={1}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(managedItem.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, managedItem.id])
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== managedItem.id))
                        }
                      }}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </Box>

                  <ItemCard
                    itemId={managedItem.id}
                    item={managedItem.item}
                    onItemUpdate={handleItemUpdate}
                  />

                  {/* Кнопка удаления */}
                  <Box position="absolute" top={8} left={8} zIndex={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(managedItem.id)}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                    >
                      ×
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Пустое состояние */}
      {managedItems.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Нет управляемых объявлений
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Добавьте ID объявления выше, чтобы начать управление ценой и услугами продвижения
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Диалог массовых операций */}
      <Dialog open={bulkDialog} onClose={() => setBulkDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Массовые операции</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Выберите операцию для применения к {selectedItems.length} выбранным объявлениям:
          </Typography>

          <List>
            {bulkOperations.map((operation, index) => (
              <React.Fragment key={operation.title}>
                <ListItem
                  button
                  onClick={() => handleBulkVas(operation.vasSlugs)}
                  disabled={loading}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={operation.title}
                          color={operation.color}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={operation.description}
                  />
                </ListItem>
                {index < bulkOperations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Операция будет применена ко всем выбранным объявлениям. Убедитесь, что у вас достаточно средств на балансе.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialog(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdsPage