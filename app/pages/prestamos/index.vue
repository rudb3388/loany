<script setup lang="ts">
import { formatEuro, useData, type Loan } from '~/composables/useData'

const { allLoans } = useData()

const statusFilter = ref<'todos' | Loan['status']>('todos')
const riskFilter = ref<string>('todos')
const sortBy = ref<'reciente' | 'interes' | 'importe'>('reciente')

const statusItems = [
  { label: 'Todos', value: 'todos' },
  { label: 'Financiando', value: 'financiando' },
  { label: 'Activos', value: 'activo' },
  { label: 'Devueltos', value: 'devuelto' },
]
const riskItems = [
  { label: 'Todos los riesgos', value: 'todos' },
  { label: 'A+', value: 'A+' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
]
const sortItems = [
  { label: 'Más recientes', value: 'reciente' },
  { label: 'Mayor interés', value: 'interes' },
  { label: 'Mayor importe', value: 'importe' },
]

const filtered = computed(() => {
  let list = [...allLoans.value]
  if (statusFilter.value !== 'todos') list = list.filter((l) => l.status === statusFilter.value)
  if (riskFilter.value !== 'todos') list = list.filter((l) => l.riskGrade === riskFilter.value)
  if (sortBy.value === 'interes') list.sort((a, b) => b.interestRate - a.interestRate)
  else if (sortBy.value === 'importe') list.sort((a, b) => b.amount - a.amount)
  return list
})

const openForFunding = computed(() => allLoans.value.filter((l) => l.status === 'financiando'))
const totalOpen = computed(() => openForFunding.value.reduce((s, l) => s + (l.amount - l.funded), 0))
</script>

<template>
  <div>
    <UPageHeader
      title="Marketplace de inversión"
      description="Elige a quién prestar tu dinero. Aporta una fracción desde el 10% y diversifica tu cartera entre varios prestatarios."
      :ui="{ root: 'py-8' }"
    />

    <UContainer class="pb-16">
      <!-- Summary -->
      <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <UCard variant="soft" :ui="{ body: 'p-4' }">
          <p class="text-xs text-muted">Préstamos abiertos</p>
          <p class="text-xl font-bold text-highlighted">{{ openForFunding.length }}</p>
        </UCard>
        <UCard variant="soft" :ui="{ body: 'p-4' }">
          <p class="text-xs text-muted">Capital por financiar</p>
          <p class="text-xl font-bold text-highlighted">{{ formatEuro(totalOpen) }}</p>
        </UCard>
        <UCard variant="soft" :ui="{ body: 'p-4' }">
          <p class="text-xs text-muted">Interés medio</p>
          <p class="text-xl font-bold text-highlighted">6,8%</p>
        </UCard>
        <UCard variant="soft" :ui="{ body: 'p-4' }">
          <p class="text-xs text-muted">Aportación mínima</p>
          <p class="text-xl font-bold text-highlighted">10%</p>
        </UCard>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-col gap-3 rounded-xl border border-default bg-elevated/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-3">
          <USelect v-model="statusFilter" :items="statusItems" value-key="value" class="w-40" icon="i-lucide-filter" />
          <USelect v-model="riskFilter" :items="riskItems" value-key="value" class="w-44" icon="i-lucide-gauge" />
        </div>
        <USelect v-model="sortBy" :items="sortItems" value-key="value" class="w-48" icon="i-lucide-arrow-up-down" />
      </div>

      <div v-if="filtered.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoanCard v-for="loan in filtered" :key="loan.id" :loan="loan" />
      </div>
      <UCard v-else variant="subtle">
        <div class="flex flex-col items-center gap-2 py-10 text-center">
          <UIcon name="i-lucide-search-x" class="size-8 text-muted" />
          <p class="font-medium text-highlighted">No hay préstamos con estos filtros</p>
          <p class="text-sm text-muted">Prueba a cambiar el estado o el nivel de riesgo.</p>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
