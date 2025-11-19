import axios from 'axios'
import type { Sala, Reserva, ReservaListResponse, ReservaFormData, Usuario } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API de Salas
export const salasApi = {
  listar: async (): Promise<Sala[]> => {
    const response = await api.get('/salas/')
    return response.data
  },
  obter: async (id: number): Promise<Sala> => {
    const response = await api.get(`/salas/${id}`)
    return response.data
  },
  criar: async (sala: Partial<Sala>): Promise<Sala> => {
    const response = await api.post('/salas/', sala)
    return response.data
  },
  atualizar: async (id: number, sala: Partial<Sala>): Promise<Sala> => {
    const response = await api.put(`/salas/${id}`, sala)
    return response.data
  },
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/salas/${id}`)
  },
}

// API de Reservas
export const reservasApi = {
  listar: async (params?: {
    sala_id?: number
    responsavel?: string
    data_inicio?: string
    data_fim?: string
  }): Promise<ReservaListResponse[]> => {
    const response = await api.get('/reservas/', { params })
    return response.data
  },
  obter: async (id: number): Promise<Reserva> => {
    const response = await api.get(`/reservas/${id}`)
    return response.data
  },
  criar: async (reserva: ReservaFormData): Promise<Reserva> => {
    const response = await api.post('/reservas/', reserva)
    return response.data
  },
  atualizar: async (id: number, reserva: Partial<ReservaFormData>): Promise<Reserva> => {
    const response = await api.put(`/reservas/${id}`, reserva)
    return response.data
  },
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/reservas/${id}`)
  },
  verificarDisponibilidade: async (
    sala_id: number,
    data_inicio: string,
    data_fim: string
  ): Promise<{ disponivel: boolean }> => {
    const response = await api.get(`/reservas/sala/${sala_id}/disponibilidade`, {
      params: { data_inicio, data_fim },
    })
    return response.data
  },
}

// API de Autenticação
export const authApi = {
  login: async (email: string, senha: string): Promise<{ access_token: string; token_type: string }> => {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', senha)
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },
  register: async (nome: string, email: string, senha: string): Promise<Usuario> => {
    const response = await api.post('/auth/register', { nome, email, senha })
    return response.data
  },
  me: async (): Promise<Usuario> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export default api

