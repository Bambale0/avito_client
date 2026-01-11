import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserInfoResponse } from '../api/types'
import { authService, AuthResponse } from '../services/authService'
import { apiClient } from '../api/client'

interface AuthContextType {
  user: UserInfoResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Проверка токена при загрузке
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Установить токен в API клиент
        apiClient.setAuthToken(token)

        // Проверить токен через API
        const userInfo = await authService.getCurrentUser()
        setUser(userInfo)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      apiClient.removeAuthToken()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)

      // Авторизация по email и паролю
      const response: AuthResponse = await authService.login(email, password)

      // Сохранить токен
      localStorage.setItem('auth_token', response.access_token)
      apiClient.setAuthToken(response.access_token)

      // Установить пользователя
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phones: response.user.phones,
        profile_url: '', // TODO: получить из API
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Выход на сервере
      await authService.logout()
    } catch (error) {
      console.error('Server logout failed:', error)
    } finally {
      // В любом случае очистить локальное состояние
      setUser(null)
      localStorage.removeItem('auth_token')
      apiClient.removeAuthToken()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}