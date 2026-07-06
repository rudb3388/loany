<script setup lang="ts">
import { TRUST_LEVELS, formatEuro, useData, type TrustLevel } from '~/composables/useData'

const route = useRoute()
const { getBorrower, loansByBorrower } = useData()

const borrower = computed(() => getBorrower(route.params.id as string))
const loans = computed(() => (borrower.value ? loansByBorrower(borrower.value.id) : []))

const levels = Object.keys(TRUST_LEVELS) as TrustLevel[]
const nextLevel = computed(() => {
  if (!borrower.value) return null
  const idx = levels.indexOf(borrower.value.trustLevel)
  return idx < levels.length - 1 ? levels[idx + 1] : null
})
const progressToNext = computed(() => {
  if (!borrower.value || !nextLevel.value) return 100
  const current = TRUST_LEVELS[borrower.value.trustLevel].minScore
  const next = TRUST_LEVELS[nextLevel.value].minScore
  return Math.round(((borrower.value.scorePoints - current) / (next - current)) * 100)
})

const verifications = computed(() => {
  if (!borrower.value) return []
  return [
    { label: 'Identidad verificada', ok: borrower.value.identityVerified, icon: 'i-lucide-user-check' },
    { label: 'Ingresos verificados', ok: borrower.value.incomeVerified, icon: 'i-lucide-wallet' },
    { label: 'Cuenta bancaria', ok: true, icon: 'i-lucide-landmark' },
    { label: 'Teléfono confirmado', ok: true, icon: 'i-lucide-phone' },
  ]
})

// Fake repayment timeline
const timeline = computed(() => {
  if (!borrower.value) return []
  const items = []
  for (let i = 0; i < Math.min(borrower.value.loansRepaid, 5); i++) {
    items.push({
      date: `${2024 - i}`,
      title: `Préstamo devuelto #${borrower.value.loansRepaid - i}`,
      description: 'Todas las cuotas pagadas puntualmente.',
      icon: 'i-lucide-check-circle',
    })
  }
  return items
})
</script>

<template>
  <UContainer v-if="borrower" class="py-8">
    <UButton to="/prestamos" label="Volver" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2" />

    <!-- Header card -->
    <UCard>
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <UAvatar :text="borrower.initials" size="3xl" :ui="{ root: 'bg-elevated' }" />
          <div>
            <h1 class="text-2xl font-bold text-highlighted">{{ borrower.name }}</h1>
            <p class="text-muted">{{ borrower.city }} · Miembro desde {{ borrower.memberSince }}</p>
            <div class="mt-2">
              <TrustBadge :level="borrower.trustLevel" size="lg" />
            </div>
          </div>
        </div>
        <div class="text-center sm:text-right">
          <p class="text-sm text-muted">Puntuación de confianza</p>
          <p class="text-4xl font-bold text-primary">{{ borrower.scorePoints }}</p>
          <p class="text-xs text-muted">sobre 1000</p>
        </div>
      </div>
    </UCard>

    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <!-- Key metrics -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <UCard variant="soft" :ui="{ body: 'p-4 text-center' }">
            <p class="text-2xl font-bold text-highlighted">{{ borrower.loansRepaid }}</p>
            <p class="text-xs text-muted">préstamos devueltos</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4 text-center' }">
            <p class="text-2xl font-bold text-highlighted">{{ borrower.onTimeRate }}%</p>
            <p class="text-xs text-muted">pagos puntuales</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4 text-center' }">
            <p class="text-2xl font-bold text-highlighted">{{ formatEuro(borrower.totalBorrowed) }}</p>
            <p class="text-xs text-muted">total prestado</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4 text-center' }">
            <p class="text-2xl font-bold text-highlighted">0</p>
            <p class="text-xs text-muted">impagos</p>
          </UCard>
        </div>

        <!-- Punctuality -->
        <UCard>
          <p class="font-medium text-highlighted">Puntualidad de pago</p>
          <p class="text-sm text-muted">Porcentaje de cuotas abonadas en fecha.</p>
          <div class="mt-4">
            <div class="mb-1.5 flex justify-between text-sm">
              <span class="text-muted">Historial</span>
              <span class="font-semibold text-highlighted">{{ borrower.onTimeRate }}%</span>
            </div>
            <UProgress :model-value="borrower.onTimeRate" :max="100" color="primary" />
          </div>
        </UCard>

        <!-- Repayment history -->
        <UCard>
          <p class="mb-4 font-medium text-highlighted">Historial de devoluciones</p>
          <UTimeline v-if="timeline.length" :items="timeline" :ui="{ description: 'text-muted' }" />
          <p v-else class="text-sm text-muted">Aún no hay préstamos devueltos.</p>
        </UCard>

        <!-- Loans -->
        <div v-if="loans.length">
          <h2 class="mb-4 text-lg font-semibold text-highlighted">Préstamos de {{ borrower.name }}</h2>
          <div class="grid gap-6 sm:grid-cols-2">
            <LoanCard v-for="loan in loans" :key="loan.id" :loan="loan" />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Verifications -->
        <UCard>
          <p class="mb-3 font-medium text-highlighted">Verificaciones</p>
          <ul class="space-y-3">
            <li v-for="v in verifications" :key="v.label" class="flex items-center gap-3">
              <div class="flex size-8 items-center justify-center rounded-lg" :class="v.ok ? 'bg-primary/10 text-primary' : 'bg-muted text-muted'">
                <UIcon :name="v.icon" class="size-4" />
              </div>
              <span class="flex-1 text-sm text-default">{{ v.label }}</span>
              <UIcon :name="v.ok ? 'i-lucide-check' : 'i-lucide-x'" class="size-4" :class="v.ok ? 'text-primary' : 'text-muted'" />
            </li>
          </ul>
          <USeparator class="my-4" />
          <p class="flex items-start gap-2 text-xs text-muted">
            <UIcon name="i-lucide-shield-check" class="mt-0.5 size-4 shrink-0" />
            Datos tratados conforme al RGPD. Solo se muestra información agregada y verificada, nunca datos personales sensibles.
          </p>
        </UCard>

        <!-- Level progress -->
        <UCard>
          <p class="mb-1 font-medium text-highlighted">Progreso de nivel</p>
          <div class="mb-3">
            <TrustBadge :level="borrower.trustLevel" />
          </div>
          <template v-if="nextLevel">
            <div class="mb-1.5 flex justify-between text-sm">
              <span class="text-muted">Hacia {{ nextLevel }}</span>
              <span class="font-semibold text-highlighted">{{ progressToNext }}%</span>
            </div>
            <UProgress :model-value="progressToNext" :max="100" />
            <p class="mt-3 text-xs text-muted">
              {{ TRUST_LEVELS[nextLevel].perk }}
            </p>
          </template>
          <p v-else class="text-sm text-muted">Nivel máximo alcanzado. Disfruta de las mejores condiciones.</p>
        </UCard>
      </div>
    </div>
  </UContainer>

  <UContainer v-else class="py-20">
    <div class="flex flex-col items-center gap-3 text-center">
      <UIcon name="i-lucide-user-x" class="size-10 text-muted" />
      <p class="text-lg font-medium text-highlighted">Perfil no encontrado</p>
      <UButton to="/prestamos" label="Volver al marketplace" />
    </div>
  </UContainer>
</template>
