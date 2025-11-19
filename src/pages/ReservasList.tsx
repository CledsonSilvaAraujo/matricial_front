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
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Nenhuma reserva encontrada.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reservas.map((reserva) => (
              <li key={reserva.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {reserva.sala_nome} - {reserva.sala_local}
                      </h3>
                      {reserva.cafe_necessario && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ☕ Café
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        <span className="font-medium">Responsável:</span> {reserva.responsavel}
                      </p>
                      <p>
                        <span className="font-medium">Início:</span>{' '}
                        {format(new Date(reserva.data_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p>
                        <span className="font-medium">Fim:</span>{' '}
                        {format(new Date(reserva.data_fim), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {reserva.descricao && (
                        <p className="mt-1">
                          <span className="font-medium">Descrição:</span> {reserva.descricao}
                        </p>
                      )}
                      {reserva.cafe_necessario && reserva.cafe_quantidade && (
                        <p className="mt-1">
                          <span className="font-medium">Quantidade de café:</span> {reserva.cafe_quantidade}
                        </p>
                      )}
                      {reserva.cafe_necessario && reserva.cafe_descricao && (
                        <p className="mt-1">
                          <span className="font-medium">Descrição do café:</span> {reserva.cafe_descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/reservas/editar/${reserva.id}`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(reserva.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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

