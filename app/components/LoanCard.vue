<script setup lang="ts">
import { formatEuro, useData, type Loan } from '~/composables/useData'

const props = defineProps<{ loan: Loan }>()

const { getBorrower } = useData()
const borrower = computed(() => getBorrower(props.loan.borrowerId))
const pct = computed(() => Math.round((props.loan.funded / props.loan.amount) * 100))

const statusMeta: Record<Loan['status'], { color: 'info' | 'primary' | 'neutral'; label: string }> = {
  financiando: { color: 'info', label: 'Financiando' },
  activo: { color: 'primary', label: 'Activo' },
  devuelto: { color: 'neutral', label: 'Devuelto' },
}
</script>

<template>
  <UCard
    :ui="{ root: 'h-full transition hover:ring-primary/40', body: 'flex h-full flex-col gap-4' }"
    variant="outline"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <UAvatar :text="borrower?.initials" size="md" :ui="{ root: 'bg-elevated' }" />
        <div>
          <NuxtLink :to="`/perfil/${borrower?.id}`" class="font-medium text-highlighted hover:text-primary">
            {{ borrower?.name }}
          </NuxtLink>
          <p class="text-xs text-muted">{{ borrower?.city }} · {{ loan.createdAt }}</p>
        </div>
      </div>
      <TrustBadge v-if="borrower" :level="borrower.trustLevel" size="sm" />
    </div>

    <div class="flex-1">
      <div class="flex items-center gap-2">
        <UBadge :color="statusMeta[loan.status].color" variant="subtle" size="sm" :label="statusMeta[loan.status].label" />
        <UBadge color="neutral" variant="soft" size="sm" :label="`Riesgo ${loan.riskGrade}`" />
      </div>
      <h3 class="mt-2 font-semibold text-highlighted text-pretty">{{ loan.title }}</h3>
      <p class="mt-1 text-sm text-muted line-clamp-2">{{ loan.purpose }}</p>
    </div>

    <dl class="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3 text-center">
      <div>
        <dt class="text-xs text-muted">Importe</dt>
        <dd class="text-sm font-semibold text-highlighted">{{ formatEuro(loan.amount) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-muted">Interés</dt>
        <dd class="text-sm font-semibold text-highlighted">{{ loan.interestRate }}%</dd>
      </div>
      <div>
        <dt class="text-xs text-muted">Plazo</dt>
        <dd class="text-sm font-semibold text-highlighted">{{ loan.termMonths }} m</dd>
      </div>
    </dl>

    <div>
      <div class="mb-1.5 flex items-center justify-between text-xs">
        <span class="text-muted">{{ loan.contributions.length }} inversores</span>
        <span class="font-medium text-highlighted">{{ pct }}% · {{ formatEuro(loan.funded) }}</span>
      </div>
      <UProgress :model-value="pct" :max="100" size="sm" />
    </div>

    <UButton
      :to="`/prestamos/${loan.id}`"
      :label="loan.status === 'financiando' ? 'Invertir en este préstamo' : 'Ver detalle'"
      :color="loan.status === 'financiando' ? 'primary' : 'neutral'"
      :variant="loan.status === 'financiando' ? 'solid' : 'subtle'"
      block
      trailing-icon="i-lucide-arrow-right"
    />
  </UCard>
</template>
