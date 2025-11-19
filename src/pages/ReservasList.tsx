import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { reservasApi } from '../services/api'
import type { ReservaListResponse } from '../types'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

export default function ReservasList() {
  const [reservas, setReservas] = useState<ReservaListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [reservaToDelete, setReservaToDelete] = useState<number | null>(null)
  const [filtros, setFiltros] = useState({
    responsavel: '',
    sala_id: '',
  })

  useEffect(() => {
    carregarReservas()
  }, [filtros])

  const carregarReservas = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filtros.responsavel) params.responsavel = filtros.responsavel
      if (filtros.sala_id) params.sala_id = parseInt(filtros.sala_id)
      const data = await reservasApi.listar(params)
      setReservas(data)
    } catch (error: any) {
      toast.error('Erro ao carregar reservas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setReservaToDelete(id)
    setModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (reservaToDelete) {
      try {
        await reservasApi.excluir(reservaToDelete)
        toast.success('Reserva excluída com sucesso!')
        carregarReservas()
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Erro ao excluir reserva')
      }
    }
    setModalOpen(false)
    setReservaToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
        <Link
          to="/reservas/nova"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nova Reserva
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável
            </label>
            <input
              type="text"
              value={filtros.responsavel}
              onChange={(e) => setFiltros({ ...filtros, responsavel: e.target.value })}
              placeholder="Filtrar por responsável"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sala ID
            </label>
            <input
              type="number"
              value={filtros.sala_id}
              onChange={(e) => setFiltros({ ...filtros, sala_id: e.target.value })}
              placeholder="Filtrar por sala"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de Reservas */}
      {reservas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <p className="text-gray-500 text-lg">Nenhuma reserva encontrada.</p>
          <p className="text-gray-400 text-sm mt-2">Crie sua primeira reserva clicando no botão acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 text-xl">🏢</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {reserva.sala_nome}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          📍 {reserva.sala_local}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reserva.cafe_necessario && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <span>☕</span>
                        <span>Café</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400">👤</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Responsável
                      </span>
                    </div>
                    <p className="text-base font-medium text-gray-900">{reserva.responsavel}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400">📅</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Período
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Início:</span>{' '}
                        {format(new Date(reserva.data_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Fim:</span>{' '}
                        {format(new Date(reserva.data_fim), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais */}
                {(reserva.descricao || (reserva.cafe_necessario && (reserva.cafe_quantidade || reserva.cafe_descricao))) && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {reserva.descricao && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-400">📝</span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Descrição
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">{reserva.descricao}</p>
                      </div>
                    )}
                    {reserva.cafe_necessario && (reserva.cafe_quantidade || reserva.cafe_descricao) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-600">☕</span>
                          <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                            Detalhes do Café
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {reserva.cafe_quantidade && (
                            <p className="text-sm text-yellow-900">
                              <span className="font-medium">Quantidade:</span> {reserva.cafe_quantidade} unidades
                            </p>
                          )}
                          {reserva.cafe_descricao && (
                            <p className="text-sm text-yellow-900">
                              <span className="font-medium">Tipo:</span> {reserva.cafe_descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to={`/reservas/editar/${reserva.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <span>✏️</span>
                    <span>Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(reserva.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <span>🗑️</span>
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setReservaToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="red"
      />
    </div>
  )
}

