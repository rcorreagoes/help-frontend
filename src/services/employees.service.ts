import type { CargoCost, Costs, ProvisoesResponse } from '@/models/employees.model'
import { api } from './api'

export const EmployeesService = {
  async getCosts(): Promise<Costs> {
    const response = await api.get<Costs>('/employees/custos-totais')
    return response.data
  },

  async getProvisoesDemissoes(): Promise<ProvisoesResponse> {
    const response = await api.get<ProvisoesResponse>('/employees/provisoes-demissoes')
    return response.data
  },

  async getCustosPorCargo(): Promise<CargoCost[]> {
    const response = await api.get<CargoCost[]>('/employees/custos-por-cargo')
    return response.data
  },
}
