import { apiClient } from '../api/client'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: {
    id: number
    name: string
    email: string
    phones: string[]
  }
}

export class AuthService {
  // Авторизация пользователя по email и паролю
  async login(email: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = {
      email,
      password,
    }

    return apiClient.post<AuthResponse>('/auth/login', request)
  }

  // Получение информации о текущем пользователе
  async getCurrentUser(): Promise<any> {
    return apiClient.get('/user/self')
  }

  // Выход из системы (на стороне сервера)
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Игнорируем ошибки при выходе
      console.error('Logout error:', error)
    }
  }

  // Валидация токена
  async validateToken(token: string): Promise<boolean> {
    try {
      // Сохранить текущий токен
      const currentToken = localStorage.getItem('auth_token')

      // Установить новый токен для проверки
      apiClient.setAuthToken(token)

      // Проверить токен
      await apiClient.get('/user/self')

      // Восстановить оригинальный токен
      if (currentToken) {
        apiClient.setAuthToken(currentToken)
      } else {
        apiClient.removeAuthToken()
      }

      return true
    } catch (error) {
      return false
    }
  }
}

export const authService = new AuthService()