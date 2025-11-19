import { useState, useEffect } from 'react'
import { salasApi } from '../services/api'
import type { Sala } from '../types'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

export default function SalasList() {
  const [salas, setSalas] = useState<Sala[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [salaToDelete, setSalaToDelete] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSala, setEditingSala] = useState<Sala | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    local: '',
    capacidade: '',
    descricao: '',
    ativa: true,
  })

  useEffect(() => {
    carregarSalas()
  }, [])

  const carregarSalas = async () => {
    try {
      setLoading(true)
      const data = await salasApi.listar()
      setSalas(data)
    } catch (error) {
      toast.error('Erro ao carregar salas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const salaData = {
        ...formData,
        capacidade: formData.capacidade ? parseInt(formData.capacidade) : undefined,
        descricao: formData.descricao || undefined,
      }

      if (editingSala) {
        await salasApi.atualizar(editingSala.id, salaData)
        toast.success('Sala atualizada com sucesso!')
      } else {
        await salasApi.criar(salaData)
        toast.success('Sala criada com sucesso!')
      }

      resetForm()
      carregarSalas()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar sala')
    }
  }

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala)
    setFormData({
      nome: sala.nome,
      local: sala.local,
      capacidade: sala.capacidade?.toString() || '',
      descricao: sala.descricao || '',
      ativa: sala.ativa,
    })
    setShowForm(true)
  }

  const handleDeleteClick = (id: number) => {
    setSalaToDelete(id)
    setModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (salaToDelete) {
      try {
        await salasApi.excluir(salaToDelete)
        toast.success('Sala excluída com sucesso!')
        carregarSalas()
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Erro ao excluir sala')
      }
    }
    setModalOpen(false)
    setSalaToDelete(null)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      local: '',
      capacidade: '',
      descricao: '',
      ativa: true,
    })
    setEditingSala(null)
    setShowForm(false)
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
        <h2 className="text-2xl font-bold text-gray-900">Salas</h2>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nova Sala
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingSala ? 'Editar Sala' : 'Nova Sala'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade
                </label>
                <input
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.ativa ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium"
              >
                {editingSala ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Salas */}
      {salas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Nenhuma sala cadastrada.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {salas.map((sala) => (
              <li key={sala.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{sala.nome}</h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sala.ativa
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sala.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        <span className="font-medium">Local:</span> {sala.local}
                      </p>
                      {sala.capacidade && (
                        <p>
                          <span className="font-medium">Capacidade:</span> {sala.capacidade} pessoas
                        </p>
                      )}
                      {sala.descricao && (
                        <p className="mt-1">
                          <span className="font-medium">Descrição:</span> {sala.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(sala)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sala.id)}
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
          setSalaToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta sala? Todas as reservas associadas também serão excluídas. Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="red"
      />
    </div>
  )
}

