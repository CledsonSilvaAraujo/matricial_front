import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'
import type { Usuario } from '../types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  register: (nome: string, email: string, senha: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi
        .me()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, senha: string) => {
    try {
      const { access_token } = await authApi.login(email, senha)
      localStorage.setItem('token', access_token)
      const userData = await authApi.me()
      setUser(userData)
      toast.success('Login realizado com sucesso!')
      return userData
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logout realizado com sucesso!')
  }

  const register = async (nome: string, email: string, senha: string) => {
    try {
      await authApi.register(nome, email, senha)
      toast.success('Usuário registrado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao registrar usuário')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

