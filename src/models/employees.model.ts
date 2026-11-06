export interface ProvisoesTotal {
  ferias_13: number
  demissao_rescisao: number
  total: number
}

export interface Costs {
  local: string
  custo_total_folha: number
  impostos_totais: number
  beneficios_totais: number
  provisoes_totais?: ProvisoesTotal
}

export interface CargoImpostosEncargos {
  inss_gps: number
  irrf_fgts: number
}

export interface CargoBeneficios {
  alimentacao: number
  transporte: number
  plano_saude: number
}

export interface CargoCost {
  cargo: string
  salario_base: number
  impostos_e_encargos: CargoImpostosEncargos
  beneficios: CargoBeneficios
  custo_total_cargo: number
}

export interface ProvisoesTotais {
  total_ferias_13: number
  total_demissao: number
  total_geral_provisoes: number
}

export interface ProvisaoDetalhadaItem {
  id: number
  mes: string
  local: string
  cargo: string
  ferias_13: number
  demissao: number
  total_linha: number
}

export interface ProvisoesResponse {
  totais: ProvisoesTotais
  detalhado_por_funcionario: ProvisaoDetalhadaItem[]
}
