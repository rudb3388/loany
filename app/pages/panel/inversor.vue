<script setup lang="ts">
import { formatEuro, useData } from '~/composables/useData'

const { allLoans, getBorrower } = useData()

// Simulated portfolio: "you" contributions across loans + a few fixed positions
const portfolio = computed(() => {
  const positions = [
    { loanId: 'l2', amount: 500 },
    { loanId: 'l4', amount: 250 },
    { loanId: 'l1', amount: 100 },
    { loanId: 'l6', amount: 150 },
  ]
  // include any live investments made this session (contributions by "you")
  for (const loan of allLoans.value) {
    const mine = loan.contributions.find((c) => c.borrowerId === 'you')
    if (mine && !positions.some((p) => p.loanId === loan.id)) {
      positions.push({ loanId: loan.id, amount: mine.amount })
    }
  }
  return positions
    .map((p) => {
      const loan = allLoans.value.find((l) => l.id === p.loanId)
      if (!loan) return null
      const borrower = getBorrower(loan.borrowerId)
      const years = loan.termMonths / 12
      const expectedReturn = Math.round(p.amount * (loan.interestRate / 100) * years)
      return { ...p, loan, borrower, expectedReturn }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(Boolean) as Array<{ loanId: string; amount: number; loan: any; borrower: any; expectedReturn: number }>
})

const totalInvested = computed(() => portfolio.value.reduce((s, p) => s + p.amount, 0))
const totalExpected = computed(() => portfolio.value.reduce((s, p) => s + p.expectedReturn, 0))
const activeCount = computed(() => portfolio.value.filter((p) => p.loan.status !== 'devuelto').length)
const avgRate = computed(() => {
  if (!portfolio.value.length) return 0
  return +(portfolio.value.reduce((s, p) => s + p.loan.interestRate, 0) / portfolio.value.length).toFixed(1)
})

// Diversification by risk grade
const byRisk = computed(() => {
  const map: Record<string, number> = {}
  for (const p of portfolio.value) map[p.loan.riskGrade] = (map[p.loan.riskGrade] ?? 0) + p.amount
  return Object.entries(map).map(([grade, amount]) => ({
    grade,
    amount,
    pct: Math.round((amount / totalInvested.value) * 100),
  }))
})

const riskColors: Record<string, string> = {
  'A+': 'bg-primary',
  A: 'bg-info',
  B: 'bg-warning',
  C: 'bg-error',
}
</script>

<template>
  <UContainer class="py-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <UAvatar text="TÚ" size="lg" :ui="{ root: 'bg-elevated' }" />
        <div>
          <p class="text-sm text-muted">Panel de inversor</p>
          <h1 class="text-xl font-bold text-highlighted">Tu cartera</h1>
        </div>
      </div>
      <UButton to="/prestamos" label="Invertir en más préstamos" icon="i-lucide-plus" />
    </div>

    <!-- Stats -->
    <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <UCard variant="soft" :ui="{ body: 'p-4' }">
        <div class="flex items-center gap-2 text-muted"><UIcon name="i-lucide-banknote" class="size-4" /><span class="text-xs">Invertido</span></div>
        <p class="mt-1 text-2xl font-bold text-highlighted">{{ formatEuro(totalInvested) }}</p>
      </UCard>
      <UCard variant="soft" :ui="{ body: 'p-4' }">
        <div class="flex items-center gap-2 text-muted"><UIcon name="i-lucide-trending-up" class="size-4" /><span class="text-xs">Retorno esperado</span></div>
        <p class="mt-1 text-2xl font-bold text-primary">+{{ formatEuro(totalExpected) }}</p>
      </UCard>
      <UCard variant="soft" :ui="{ body: 'p-4' }">
        <div class="flex items-center gap-2 text-muted"><UIcon name="i-lucide-layers" class="size-4" /><span class="text-xs">Posiciones activas</span></div>
        <p class="mt-1 text-2xl font-bold text-highlighted">{{ activeCount }}</p>
      </UCard>
      <UCard variant="soft" :ui="{ body: 'p-4' }">
        <div class="flex items-center gap-2 text-muted"><UIcon name="i-lucide-percent" class="size-4" /><span class="text-xs">Interés medio</span></div>
        <p class="mt-1 text-2xl font-bold text-highlighted">{{ avgRate }}%</p>
      </UCard>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <!-- Positions -->
      <div class="lg:col-span-2 space-y-4">
        <h2 class="text-lg font-semibold text-highlighted">Mis inversiones</h2>
        <UCard v-for="p in portfolio" :key="p.loanId" variant="outline">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <UAvatar :text="p.borrower?.initials" size="md" :ui="{ root: 'bg-elevated' }" />
              <div>
                <NuxtLink :to="`/prestamos/${p.loanId}`" class="font-medium text-highlighted hover:text-primary">{{ p.loan.title }}</NuxtLink>
                <p class="text-xs text-muted">{{ p.borrower?.name }} · Riesgo {{ p.loan.riskGrade }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="font-bold text-highlighted">{{ formatEuro(p.amount) }}</p>
                <p class="text-xs text-primary">+{{ formatEuro(p.expectedReturn) }} estimado</p>
              </div>
              <UBadge :color="p.loan.status === 'financiando' ? 'info' : p.loan.status === 'activo' ? 'primary' : 'neutral'" variant="subtle" class="capitalize" :label="p.loan.status" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Diversification -->
      <div class="space-y-6">
        <UCard>
          <p class="font-medium text-highlighted">Diversificación por riesgo</p>
          <p class="text-sm text-muted">Repartir entre grados reduce el impacto de un impago.</p>
          <div class="mt-4 space-y-3">
            <div v-for="r in byRisk" :key="r.grade">
              <div class="mb-1 flex justify-between text-sm">
                <span class="font-medium text-highlighted">Riesgo {{ r.grade }}</span>
                <span class="text-muted">{{ formatEuro(r.amount) }} · {{ r.pct }}%</span>
              </div>
              <div class="h-2 rounded-full bg-muted">
                <div class="h-2 rounded-full" :class="riskColors[r.grade]" :style="{ width: r.pct + '%' }" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard variant="subtle">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shield-check" class="size-5 text-primary" />
            <p class="font-medium text-highlighted">Inversión responsable</p>
          </div>
          <p class="mt-2 text-sm text-muted">
            Recomendamos aportar pequeñas fracciones (10-30%) a muchos préstamos en lugar de financiar uno entero.
          </p>
          <UButton to="/prestamos" label="Explorar el marketplace" variant="subtle" color="neutral" block class="mt-4" trailing-icon="i-lucide-arrow-right" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
