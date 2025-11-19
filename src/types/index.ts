export interface Sala {
  id: number
  nome: string
  local: string
  capacidade?: number
  descricao?: string
  ativa: boolean
  created_at: string
  updated_at?: string
}

export interface Reserva {
  id: number
  sala_id: number
  responsavel: string
  data_inicio: string
  data_fim: string
  descricao?: string
  cafe_necessario: boolean
  cafe_quantidade?: number
  cafe_descricao?: string
  created_at: string
  updated_at?: string
  sala?: Sala
}

export interface ReservaListResponse {
  id: number
  sala_id: number
  sala_nome: string
  sala_local: string
  responsavel: string
  data_inicio: string
  data_fim: string
  descricao?: string
  cafe_necessario: boolean
  cafe_quantidade?: number
  cafe_descricao?: string
  created_at: string
}

export interface ReservaFormData {
  sala_id: number
  responsavel: string
  data_inicio: string
  data_fim: string
  descricao?: string
  cafe_necessario: boolean
  cafe_quantidade?: number
  cafe_descricao?: string
}

export interface Usuario {
  id: number
  email: string
  nome: string
  ativo: boolean
  created_at: string
}

