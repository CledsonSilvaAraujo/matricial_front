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

      {/* Formulário para Nova Sala (apenas quando não está editando) */}
      {showForm && !editingSala && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border-2 border-primary-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nova Sala</h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 text-xl"
              title="Fechar formulário"
            >
              ✕
            </button>
          </div>
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
                Criar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Salas */}
      {salas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <p className="text-gray-500 text-lg">Nenhuma sala cadastrada.</p>
          <p className="text-gray-400 text-sm mt-2">Crie sua primeira sala clicando no botão acima.</p>
        </div>
      ) : (
        <>
          {/* Formulário de Edição (aparece no topo quando está editando) */}
          {editingSala && (
            <div className="bg-white rounded-lg shadow-md border-2 border-primary-300 overflow-hidden md:col-span-2 lg:col-span-3 mb-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Editar Sala</h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                    title="Cancelar edição"
                  >
                    ✕
                  </button>
                </div>
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
                      Atualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Grid de Cards (oculta a sala que está sendo editada) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salas
              .filter((sala) => !editingSala || editingSala.id !== sala.id)
              .map((sala) => (
              <div
                key={sala.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          sala.ativa ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className={`text-xl ${sala.ativa ? 'text-green-600' : 'text-gray-400'}`}>
                            {sala.ativa ? '🏢' : '🚫'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {sala.nome}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      sala.ativa
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {sala.ativa ? '✓ Ativa' : '✗ Inativa'}
                    </span>
                  </div>

                  {/* Informações Principais */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400">📍</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Localização
                        </span>
                      </div>
                      <p className="text-base font-medium text-gray-900 pl-6">{sala.local}</p>
                    </div>

                    {sala.capacidade && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-400">👥</span>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                            Capacidade
                          </span>
                        </div>
                        <p className="text-base font-medium text-blue-900 pl-6">
                          {sala.capacidade} {sala.capacidade === 1 ? 'pessoa' : 'pessoas'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Descrição */}
                  {sala.descricao && (
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400">📝</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Descrição
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 pl-6">{sala.descricao}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(sala)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      <span>✏️</span>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sala.id)}
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
        </>
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

