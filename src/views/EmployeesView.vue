<script setup>
import ChartCard from '@/components/ChartCard.vue';
import ChartGrid from '@/components/ChartGrid.vue';
import KpiCard from '@/components/KpiCard.vue';
import KpiGrid from '@/components/KpiGrid.vue';
import { EmployeesService } from '@/services/employees.service';
import Chart from 'chart.js/auto';
import { computed, onMounted, ref, watch } from 'vue';

const employeesService = EmployeesService;

const props = defineProps({
  filial: {
    type: String,
    default: 'TODOS'
  }
});

const filtroFilial = ref(props.filial);
const filtroCargo = ref('TODOS');

watch(() => props.filial, (novaFilial) => {
  filtroFilial.value = novaFilial;
  load();
});

watch(filtroFilial, () => {
  load();
});

watch(filtroCargo, () => {
  load();
});

// KPIs principais (inicializa vazio e preenche no load)
const kpis = ref({
  custoTotal: null,
  impostos: null,
  beneficios: null,
  provisoes: null,
  ultimoMes: null,
  custoTotalMes: null,
  impostosMes: null,
  beneficiosMes: null,
  provisoesMes: null,
});

// Tabela detalhada
const itensProvisoes = ref([]);
const custosPorCargo = ref([]);

function isCargoCostLike(item) {
  return item
    && typeof item.cargo === 'string'
    && typeof item.salario_base === 'number'
    && item.impostos_e_encargos
    && item.beneficios;
}

const tabelaFiltrada = computed(() => {
  return itensProvisoes.value.filter(item => {
    const matchFilial = filtroFilial.value === 'TODOS' || item.filial.toUpperCase() === filtroFilial.value.toUpperCase();
    const matchCargo = filtroCargo.value === 'TODOS' || item.cargo.toUpperCase() === filtroCargo.value.toUpperCase();
    return matchFilial && matchCargo;
  });
});

function formatNumber(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return '0,00';
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getChartThemeColors() {
  const darkMode = document.documentElement.classList.contains('dark');

  return {
    text: darkMode ? '#e2e8f0' : '#0f172a',
    grid: darkMode ? 'rgba(148, 163, 184, 0.18)' : '#e2e8f0',
    legend: darkMode ? '#cbd5e1' : '#475569',
    card: darkMode ? '#1e293b' : '#ffffff',
  };
}

let chartCargosInst = null;
let chartCompInst = null;

function renderCharts() {
  const colors = getChartThemeColors();
  const labelsCargo = custosPorCargo.value.map((item) => item.cargo);
  const salariosCargo = custosPorCargo.value.map((item) => item.salario_base);
  const impostosCargo = custosPorCargo.value.map(
    (item) => item.impostos_e_encargos.inss_gps + item.impostos_e_encargos.irrf_fgts
  );
  const beneficiosCargo = custosPorCargo.value.map(
    (item) => item.beneficios.alimentacao + item.beneficios.transporte + item.beneficios.plano_saude
  );

  const elCargos = document.getElementById('chartCargos');
  if (elCargos) {
    if (chartCargosInst) chartCargosInst.destroy();
    chartCargosInst = new Chart(elCargos, {
      type: 'bar',
      data: {
        labels: labelsCargo,
        datasets: [
          {
            label: 'Salário Base',
            data: salariosCargo,
            backgroundColor: '#3b82f6',
            borderRadius: 6
          },
          {
            label: 'Impostos',
            data: impostosCargo,
            backgroundColor: '#f59e0b',
            borderRadius: 6
          },
          {
            label: 'Benefícios',
            data: beneficiosCargo,
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 11 },
              color: colors.legend,
            }
          }
        },
        scales: {
          x: {
            ticks: { color: colors.text },
            grid: { display: false }
          },
          y: {
            ticks: { color: colors.text },
            grid: { color: colors.grid }
          }
        }
      }
    });
  }

  const elComp = document.getElementById('chartComposicao');
  if (elComp) {
    const salarioMes = Math.max(
      (kpis.value.custoTotal ?? 0)

    );

    if (chartCompInst) chartCompInst.destroy();
    chartCompInst = new Chart(elComp, {
      type: 'doughnut',
      data: {
        labels: ['Salários', 'Impostos', 'Benefícios', 'Provisões'],
        datasets: [{
          data: [
            salarioMes,
            kpis.value.impostos ?? 0,
            kpis.value.beneficios ?? 0,
            kpis.value.provisoes ?? 0,
          ],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#a855f7'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: { size: 11 },
              color: colors.legend,
            }
          }
        }
      }
    });
  }
}

async function load() {
  const [costsResult, provisoesResult, custosCargoResult] = await Promise.allSettled([
    employeesService.getCosts(),
    employeesService.getProvisoesDemissoes(),
    employeesService.getCustosPorCargo(),
  ]);

  if (costsResult.status === 'fulfilled') {
    const dataCosts = costsResult.value;
    kpis.value.impostos = dataCosts?.impostos_totais ?? null;
    kpis.value.beneficios = dataCosts?.beneficios_totais ?? null;
    kpis.value.impostosMes = dataCosts?.impostos_totais_mes ?? null;
    kpis.value.beneficiosMes = dataCosts?.beneficios_totais_mes ?? null;
    kpis.value.provisoesMes = dataCosts?.provisoes_totais_mes ?? null;
    kpis.value.ultimoMes = dataCosts?.ultimo_mes ?? null;
  } else {
    console.error('Falha ao carregar custos totais:', costsResult.reason);
    kpis.value.impostos = null;
    kpis.value.beneficios = null;
    kpis.value.impostosMes = null;
    kpis.value.beneficiosMes = null;
    kpis.value.provisoesMes = null;
    kpis.value.ultimoMes = null;
  }

  let totalProvisoes = null;
  if (provisoesResult.status === 'fulfilled') {
    const dataProvisoes = provisoesResult.value;

    if (Array.isArray(dataProvisoes) && dataProvisoes.every(isCargoCostLike)) {
      custosPorCargo.value = dataProvisoes;
    } else {
      totalProvisoes = dataProvisoes?.totais?.total_geral_provisoes ?? null;

      if (dataProvisoes?.detalhado_por_funcionario?.length) {
        itensProvisoes.value = dataProvisoes.detalhado_por_funcionario.map((item, idx) => ({
          id: idx + 1,
          mes: item.mes || 'JANEIRO',
          filial: item.local || 'CAONZE',
          cargo: item.cargo || 'GERENTE',
          ferias: item.ferias_13 || 0,
          demissao: item.demissao || 0,
          total: item.total_linha || 0,
        }));
      } else {
        itensProvisoes.value = [];
      }
    }
  } else {
    console.error('Falha ao carregar provisões/demissões:', provisoesResult.reason);
    itensProvisoes.value = [];
  }

  if (custosCargoResult.status === 'fulfilled' && Array.isArray(custosCargoResult.value)) {
    custosPorCargo.value = custosCargoResult.value;
  } else if (custosCargoResult.status === 'rejected') {
    console.error('Falha ao carregar custos por cargo:', custosCargoResult.reason);
  }

  kpis.value.provisoes = totalProvisoes;

  // custo_total_folha já inclui provisões — usar direto, sem somar novamente
  kpis.value.custoTotal = costsResult.status === 'fulfilled'
    ? costsResult.value?.custo_total_folha ?? null
    : null;
  kpis.value.custoTotalMes = costsResult.status === 'fulfilled'
    ? costsResult.value?.custo_total_folha_mes ?? null
    : null;

  renderCharts();
}

onMounted(() => {
  load();

  const themeObserver = new MutationObserver((mutations) => {
    const themeChanged = mutations.some((mutation) =>
      mutation.attributeName === 'class' || mutation.attributeName === 'data-theme'
    );

    if (themeChanged) {
      renderCharts();
    }
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  });
});
</script>

<template>
  <div class="employees-view">
    <div class="employees-filter-bar">
      <div class="filter-group">
        <div class="filter-label">
          <i class="fa-solid fa-filter"></i> Filtros:
        </div>

        <select v-model="filtroFilial" class="filter-select">
          <option value="TODOS">Todas as Filiais</option>
          <option value="CAONZE">Caonze</option>
          <option value="MESQUITA">Mesquita</option>
        </select>

        <select v-model="filtroCargo" class="filter-select">
          <option value="TODOS">Todos os Cargos</option>
          <option value="GERENTE">Gerente</option>
          <option value="MOTORISTA">Motorista</option>
          <option value="AJUDANTE">Ajudante</option>
          <option value="JUNIOR">Júnior</option>
        </select>
      </div>

      <div class="filter-source">
        Origem:
        <code>/api/v1/employees</code>
      </div>
    </div>

    <KpiGrid layout="four">
      <KpiCard
        :title="`CUSTO TOTAL FOLHA - ${kpis.ultimoMes ?? 'MÊS ATUAL'}`"
        :value="`R$ ${formatNumber(kpis.custoTotalMes)}`"
        footnote=""
        footnote-tone="positive"
        icon="fa-solid fa-wallet"
        accent="blue"
      >
        <template #footnote-prefix>
          <i class="fa-solid fa-arrow-up text-[10px]"></i>
        </template>
      </KpiCard>

      <KpiCard
        title="IMPOSTOS &amp; ENCARGOS"
        :value="`R$ ${formatNumber(kpis.impostosMes)}`"
        footnote="INSS, GPS, IRRF &amp; FGTS"
        icon="fa-solid fa-building-columns"
        accent="amber"
      />

      <KpiCard
        title="BENEFÍCIOS TOTAIS"
        :value="`R$ ${formatNumber(kpis.beneficiosMes)}`"
        footnote="VT, VR, Plano Saúde &amp; EPI"
        icon="fa-solid fa-heart-pulse"
        accent="green"
      />

      <KpiCard
        title="PROVISÃO FÉRIAS/13º/RESCISÃO"
        :value="`R$ ${formatNumber(kpis.provisoesMes)}`"
        footnote=""
        icon="fa-solid fa-piggy-bank"
        accent="purple"
      />
    </KpiGrid>

    <KpiGrid layout="four">
      <KpiCard
        title="CUSTO TOTAL FOLHA"
        :value="`R$ ${formatNumber(kpis.custoTotal)}`"
        footnote=""
        footnote-tone="positive"
        icon="fa-solid fa-wallet"
        accent="blue"
      >
        <template #footnote-prefix>
          <i class="fa-solid fa-arrow-up text-[10px]"></i>
        </template>
      </KpiCard>

      <KpiCard
        title="IMPOSTOS &amp; ENCARGOS"
        :value="`R$ ${formatNumber(kpis.impostos)}`"
        footnote="INSS, GPS, IRRF &amp; FGTS"
        icon="fa-solid fa-building-columns"
        accent="amber"
      />

      <KpiCard
        title="BENEFÍCIOS TOTAIS"
        :value="`R$ ${formatNumber(kpis.beneficios)}`"
        footnote="VT, VR, Plano Saúde &amp; EPI"
        icon="fa-solid fa-heart-pulse"
        accent="green"
      />

      <KpiCard
        title="PROVISÃO FÉRIAS/13º/RESCISÃO"
        :value="`R$ ${formatNumber(kpis.provisoes)}`"
        footnote="Acumulado projetado"
        icon="fa-solid fa-piggy-bank"
        accent="purple"
      />
    </KpiGrid>

    <ChartGrid>
      <ChartCard title="Custos Consolidados por Cargo" icon="fa-solid fa-chart-bar">
        <canvas id="chartCargos"></canvas>
      </ChartCard>

      <ChartCard title="Composição do Custo de Pessoal" icon="fa-solid fa-chart-pie" :centered="true">
        <canvas id="chartComposicao"></canvas>
      </ChartCard>
    </ChartGrid>

    <div class="chart-card">
      <div class="table-header">
        <h3 class="table-title">Detalhamento de Provisões de Férias, 13º e Demissão</h3>
        <span class="table-subtitle">Exibição por Colaborador/Posição</span>
      </div>

      <div class="table-responsive">
        <table class="table-data">
          <thead>
            <tr>
              <th>MÊS</th>
              <th>FILIAL</th>
              <th>CARGO</th>
              <th>PROVISÃO FÉRIAS / 13º</th>
              <th>PROVISÃO DEMISSÃO</th>
              <th class="table-total">TOTAL LINHA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tabelaFiltrada" :key="item.id">
              <td>{{ item.mes }}</td>
              <td>{{ item.filial }}</td>
              <td class="emphasis">{{ item.cargo }}</td>
              <td>R$ {{ formatNumber(item.ferias) }}</td>
              <td>R$ {{ formatNumber(item.demissao) }}</td>
              <td class="emphasis table-total">R$ {{ formatNumber(item.total) }}</td>
            </tr>
            <tr v-if="tabelaFiltrada.length === 0">
              <td colspan="6" class="empty-state">Nenhum colaborador encontrado para os filtros selecionados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/employees.scss';
</style>
