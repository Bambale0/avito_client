import { apiClient } from '../api/client'
import {
  ItemInfoResponse,
  VasPricesRequest,
  ItemVasPricesResponse,
  ApplyVasRequest,
  ApplyVasResponse,
  UpdatePriceRequest,
  UpdatePriceResponse,
} from '../api/types'

export class AdsService {
  // Получение информации об объявлении
  async getItemInfo(itemId: number): Promise<ItemInfoResponse> {
    return apiClient.get<ItemInfoResponse>(`/ads/items/${itemId}`)
  }

  // Получение цен услуг для объявлений
  async getVasPrices(request: VasPricesRequest): Promise<ItemVasPricesResponse[]> {
    return apiClient.post<ItemVasPricesResponse[]>('/ads/vas/prices', request)
  }

  // Применение услуг к объявлению
  async applyVas(itemId: number, request: ApplyVasRequest): Promise<ApplyVasResponse> {
    return apiClient.put<ApplyVasResponse>(`/ads/items/${itemId}/vas`, request)
  }

  // Обновление цены объявления
  async updateItemPrice(itemId: number, request: UpdatePriceRequest): Promise<UpdatePriceResponse> {
    return apiClient.post<UpdatePriceResponse>(`/ads/items/${itemId}/price`, request)
  }

  // Вспомогательные методы

  // Получение описания услуги по slug
  getVasDescription(slug: string): string {
    const descriptions: Record<string, string> = {
      'premium': 'Премиум-объявление - выделяется в поиске и на главной',
      'vip': 'VIP-объявление - максимальная видимость',
      'highlight': 'Выделение цветом - привлекает внимание',
      'xl': 'Увеличенное объявление - занимает больше места',
      'top': 'Закрепление в топе - всегда наверху',
      'urgent': 'Срочно - выделяется красным цветом',
      'gallery': 'Галерея фото - до 10 изображений',
      'video': 'Видео в объявлении',
    }

    return descriptions[slug] || `Услуга ${slug}`
  }

  // Получение цвета для статуса услуги
  getVasStatusColor(active: boolean): 'success' | 'default' {
    return active ? 'success' : 'default'
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return `${price.toLocaleString()} ₽`
  }

  // Получение списка доступных услуг (заглушки для демонстрации)
  getAvailableVasServices(): Array<{ slug: string; name: string; description: string }> {
    return [
      {
        slug: 'premium',
        name: 'Премиум',
        description: 'Премиум-объявление - выделяется в поиске и на главной',
      },
      {
        slug: 'vip',
        name: 'VIP',
        description: 'VIP-объявление - максимальная видимость',
      },
      {
        slug: 'highlight',
        name: 'Выделение',
        description: 'Выделение цветом - привлекает внимание',
      },
      {
        slug: 'xl',
        name: 'XL-объявление',
        description: 'Увеличенное объявление - занимает больше места',
      },
      {
        slug: 'urgent',
        name: 'Срочно',
        description: 'Срочно - выделяется красным цветом',
      },
    ]
  }

  // Получение списка доступных стикеров (заглушки)
  getAvailableStickers(): Array<{ id: number; title: string; description: string }> {
    return [
      {
        id: 1,
        title: 'Скидка',
        description: 'Скидка на товар',
      },
      {
        id: 2,
        title: 'Акция',
        description: 'Специальное предложение',
      },
      {
        id: 3,
        title: 'Новинка',
        description: 'Новый товар',
      },
    ]
  }
}

export const adsService = new AdsService()