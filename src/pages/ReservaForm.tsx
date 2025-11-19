import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { reservasApi, salasApi } from '../services/api'
import type { ReservaFormData, Sala } from '../types'
import toast from 'react-hot-toast'

export default function ReservaForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [salas, setSalas] = useState<Sala[]>([])
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReservaFormData>({
    defaultValues: {
      cafe_necessario: false,
    },
  })

  const cafeNecessario = watch('cafe_necessario')

  useEffect(() => {
    carregarSalas()
    if (isEdit) {
      carregarReserva()
    }
  }, [id])

  const carregarSalas = async () => {
    try {
      const data = await salasApi.listar()
      setSalas(data.filter((s) => s.ativa))
    } catch (error) {
      toast.error('Erro ao carregar salas')
    }
  }

  const carregarReserva = async () => {
    try {
      setLoading(true)
      const reserva = await reservasApi.obter(parseInt(id!))
      setValue('sala_id', reserva.sala_id)
      setValue('responsavel', reserva.responsavel)
      setValue('data_inicio', format(new Date(reserva.data_inicio), "yyyy-MM-dd'T'HH:mm"))
      setValue('data_fim', format(new Date(reserva.data_fim), "yyyy-MM-dd'T'HH:mm"))
      setValue('descricao', reserva.descricao || '')
      setValue('cafe_necessario', reserva.cafe_necessario)
      setValue('cafe_quantidade', reserva.cafe_quantidade || undefined)
      setValue('cafe_descricao', reserva.cafe_descricao || '')
    } catch (error) {
      toast.error('Erro ao carregar reserva')
      navigate('/reservas')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ReservaFormData) => {
    try {
      setLoading(true)
      // Converter datas para formato ISO
      const reservaData = {
        ...data,
        data_inicio: new Date(data.data_inicio).toISOString(),
        data_fim: new Date(data.data_fim).toISOString(),
        cafe_quantidade: data.cafe_necessario && data.cafe_quantidade ? data.cafe_quantidade : undefined,
        cafe_descricao: data.cafe_necessario && data.cafe_descricao ? data.cafe_descricao : undefined,
      }

      if (isEdit) {
        await reservasApi.atualizar(parseInt(id!), reservaData)
        toast.success('Reserva atualizada com sucesso!')
      } else {
        await reservasApi.criar(reservaData)
        toast.success('Reserva criada com sucesso!')
      }
      navigate('/reservas')
    } catch (error: any) {
      // Tratamento especial para conflitos de horário (erro 409)
      if (error.response?.status === 409) {
        const salaNome = salas.find(s => s.id === data.sala_id)?.nome || 'a sala selecionada'
        const dataInicioFormatada = format(new Date(data.data_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        const dataFimFormatada = format(new Date(data.data_fim), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        
        // Notificação customizada e explicativa
        toast.error(
          <div className="max-w-md">
            <div className="font-semibold text-base mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              Não foi possível criar a reserva
            </div>
            <div className="text-sm space-y-1">
              <p>
                Já existe uma reserva para <strong className="font-semibold">{salaNome}</strong> no horário:
              </p>
              <p className="ml-4">
                📅 <strong>De:</strong> {dataInicioFormatada}
              </p>
              <p className="ml-4">
                📅 <strong>Até:</strong> {dataFimFormatada}
              </p>
              <p className="text-xs mt-3 pt-2 border-t border-red-200 text-gray-600">
                💡 <strong>Dica:</strong> Escolha outro horário ou selecione uma sala diferente.
              </p>
            </div>
          </div>,
          {
            duration: 8000, // Mostrar por 8 segundos
            style: {
              maxWidth: '500px',
              padding: '16px',
            },
          }
        )
      } else if (error.response?.status === 400) {
        // Erro de validação
        const mensagemErro = error.response?.data?.detail || 'Dados inválidos'
        toast.error(mensagemErro, {
          duration: 4000,
        })
      } else {
        // Outros erros
        toast.error(error.response?.data?.detail || 'Erro ao salvar reserva')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Editar Reserva' : 'Nova Reserva'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sala <span className="text-red-500">*</span>
            </label>
            <select
              {...register('sala_id', { required: 'Sala é obrigatória' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.sala_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma sala</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome} - {sala.local}
                </option>
              ))}
            </select>
            {errors.sala_id && (
              <p className="mt-1 text-sm text-red-600">{errors.sala_id.message}</p>
            )}
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('responsavel', {
                required: 'Responsável é obrigatório',
                minLength: { value: 1, message: 'Responsável deve ter pelo menos 1 caractere' },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.responsavel ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.responsavel && (
              <p className="mt-1 text-sm text-red-600">{errors.responsavel.message}</p>
            )}
          </div>

          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data e Hora de Início <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('data_inicio', { required: 'Data de início é obrigatória' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.data_inicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.data_inicio && (
              <p className="mt-1 text-sm text-red-600">{errors.data_inicio.message}</p>
            )}
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data e Hora de Fim <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('data_fim', { required: 'Data de fim é obrigatória' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.data_fim ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.data_fim && (
              <p className="mt-1 text-sm text-red-600">{errors.data_fim.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Café Necessário */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('cafe_necessario')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Café necessário</label>
            </div>
          </div>

          {/* Campos de Café (condicionais) */}
          {cafeNecessario && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de Café
                </label>
                <input
                  type="number"
                  {...register('cafe_quantidade', {
                    min: { value: 1, message: 'Quantidade deve ser pelo menos 1' },
                  })}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.cafe_quantidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cafe_quantidade && (
                  <p className="mt-1 text-sm text-red-600">{errors.cafe_quantidade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Café
                </label>
                <input
                  type="text"
                  {...register('cafe_descricao')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/reservas')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  )
}

