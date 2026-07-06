<script setup lang="ts">
import { INVESTMENT_TIERS, formatEuro, useData } from '../../composables/useData'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getLoan, getBorrower, loansByBorrower, investInLoan } = useData()

const loan = computed(() => getLoan(route.params.id as string))
const borrower = computed(() => (loan.value ? getBorrower(loan.value.borrowerId) : undefined))

const remaining = computed(() => (loan.value ? loan.value.amount - loan.value.funded : 0))
const pct = computed(() => (loan.value ? Math.round((loan.value.funded / loan.value.amount) * 100) : 0))

// Investment tier as a % of the remaining amount to fund
const selectedTier = ref<number>(10)
const investAmount = computed(() => Math.round((remaining.value * selectedTier.value) / 100))

// Estimated return over the term
const estimatedReturn = computed(() => {
  if (!loan.value) return 0
  const years = loan.value.termMonths / 12
  return Math.round(investAmount.value * (loan.value.interestRate / 100) * years)
})

const borrowerHistory = computed(() =>
  borrower.value ? loansByBorrower(borrower.value.id).filter((l) => l.id !== loan.value?.id) : [],
)

const confirmOpen = ref(false)

function doInvest() {
  if (!loan.value) return
  investInLoan(loan.value.id, investAmount.value)
  confirmOpen.value = false
  toast.add({
    title: 'Inversión confirmada',
    description: `Has aportado ${formatEuro(investAmount.value)} a "${loan.value.title}".`,
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}
</script>

<template>
  <UContainer v-if="loan && borrower" class="py-8">
    <UButton to="/prestamos" label="Volver al marketplace" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2" />

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Main -->
      <div class="lg:col-span-2 space-y-6">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge :color="loan.status === 'financiando' ? 'info' : loan.status === 'activo' ? 'primary' : 'neutral'" variant="subtle" class="capitalize" :label="loan.status" />
            <UBadge color="neutral" variant="soft" :label="`Riesgo ${loan.riskGrade}`" />
            <span class="text-sm text-muted">{{ loan.createdAt }}</span>
          </div>
          <h1 class="mt-3 text-2xl font-bold text-highlighted text-balance sm:text-3xl">{{ loan.title }}</h1>
          <p class="mt-2 text-muted leading-relaxed">{{ loan.purpose }}</p>
        </div>

        <!-- Key figures -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <UCard variant="soft" :ui="{ body: 'p-4' }">
            <p class="text-xs text-muted">Importe</p>
            <p class="text-lg font-bold text-highlighted">{{ formatEuro(loan.amount) }}</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4' }">
            <p class="text-xs text-muted">Interés anual</p>
            <p class="text-lg font-bold text-highlighted">{{ loan.interestRate }}%</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4' }">
            <p class="text-xs text-muted">Plazo</p>
            <p class="text-lg font-bold text-highlighted">{{ loan.termMonths }} meses</p>
          </UCard>
          <UCard variant="soft" :ui="{ body: 'p-4' }">
            <p class="text-xs text-muted">Inversores</p>
            <p class="text-lg font-bold text-highlighted">{{ loan.contributions.length }}</p>
          </UCard>
        </div>

        <!-- Funding progress -->
        <UCard>
          <div class="mb-2 flex items-center justify-between">
            <p class="font-medium text-highlighted">Progreso de financiación</p>
            <p class="text-sm font-semibold text-primary">{{ pct }}%</p>
          </div>
          <UProgress :model-value="pct" :max="100" />
          <div class="mt-3 flex items-center justify-between text-sm text-muted">
            <span>{{ formatEuro(loan.funded) }} financiados</span>
            <span>Faltan {{ formatEuro(remaining) }}</span>
          </div>
        </UCard>

        <!-- Borrower profile summary -->
        <UCard>
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <UAvatar :text="borrower.initials" size="lg" :ui="{ root: 'bg-elevated' }" />
              <div>
                <NuxtLink :to="`/perfil/${borrower.id}`" class="font-semibold text-highlighted hover:text-primary">{{ borrower.name }}</NuxtLink>
                <p class="text-sm text-muted">{{ borrower.city }} · Miembro desde {{ borrower.memberSince }}</p>
              </div>
            </div>
            <TrustBadge :level="borrower.trustLevel" />
          </div>
          <p class="mt-4 text-sm text-muted leading-relaxed">{{ borrower.bio }}</p>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-lg bg-muted/60 p-3 text-center">
              <p class="text-base font-bold text-highlighted">{{ borrower.loansRepaid }}</p>
              <p class="text-xs text-muted">devueltos</p>
            </div>
            <div class="rounded-lg bg-muted/60 p-3 text-center">
              <p class="text-base font-bold text-highlighted">{{ borrower.onTimeRate }}%</p>
              <p class="text-xs text-muted">puntualidad</p>
            </div>
            <div class="rounded-lg bg-muted/60 p-3 text-center">
              <p class="text-base font-bold text-highlighted">{{ borrower.scorePoints }}</p>
              <p class="text-xs text-muted">puntos</p>
            </div>
            <div class="rounded-lg bg-muted/60 p-3 text-center">
              <UIcon :name="borrower.incomeVerified ? 'i-lucide-badge-check' : 'i-lucide-badge-alert'" class="size-5" :class="borrower.incomeVerified ? 'text-primary' : 'text-muted'" />
              <p class="text-xs text-muted">ingresos</p>
            </div>
          </div>
          <UButton :to="`/perfil/${borrower.id}`" label="Ver perfil de confianza completo" variant="subtle" color="neutral" block class="mt-4" trailing-icon="i-lucide-arrow-right" />
        </UCard>
      </div>

      <!-- Invest sidebar -->
      <div>
        <UCard :ui="{ root: 'sticky top-24' }">
          <template #header>
            <p class="font-semibold text-highlighted">Invierte en este préstamo</p>
            <p class="text-sm text-muted">Elige qué fracción del importe restante quieres aportar.</p>
          </template>

          <div v-if="loan.status === 'financiando'" class="space-y-5">
            <div>
              <p class="mb-2 text-sm font-medium text-highlighted">Fracción a aportar</p>
              <div class="grid grid-cols-3 gap-2">
                <UButton
                  v-for="tier in INVESTMENT_TIERS"
                  :key="tier"
                  :label="`${tier}%`"
                  :color="selectedTier === tier ? 'primary' : 'neutral'"
                  :variant="selectedTier === tier ? 'solid' : 'outline'"
                  block
                  @click="selectedTier = tier"
                />
              </div>
            </div>

            <div class="rounded-lg border border-default bg-muted/50 p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted">Tu aportación</span>
                <span class="text-xl font-bold text-highlighted">{{ formatEuro(investAmount) }}</span>
              </div>
              <USeparator class="my-3" />
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Retorno estimado</span>
                <span class="font-medium text-primary">+{{ formatEuro(estimatedReturn) }}</span>
              </div>
              <div class="mt-1 flex items-center justify-between text-sm">
                <span class="text-muted">Total a recuperar</span>
                <span class="font-medium text-highlighted">{{ formatEuro(investAmount + estimatedReturn) }}</span>
              </div>
            </div>

            <UButton label="Invertir ahora" size="lg" block icon="i-lucide-trending-up" :disabled="investAmount <= 0" @click="confirmOpen = true" />
            <p class="text-center text-xs text-muted">Prototipo: no se realiza ningún cargo real.</p>
          </div>

          <div v-else class="flex flex-col items-center gap-2 py-6 text-center">
            <UIcon :name="loan.status === 'devuelto' ? 'i-lucide-check-circle' : 'i-lucide-lock'" class="size-8 text-primary" />
            <p class="font-medium text-highlighted">
              {{ loan.status === 'devuelto' ? 'Préstamo devuelto por completo' : 'Préstamo totalmente financiado' }}
            </p>
            <p class="text-sm text-muted">Ya no admite nuevas aportaciones.</p>
            <UButton to="/prestamos" label="Ver otros préstamos" variant="subtle" color="neutral" class="mt-2" />
          </div>
        </UCard>
      </div>
    </div>

    <!-- Other loans by borrower -->
    <div v-if="borrowerHistory.length" class="mt-12">
      <h2 class="mb-4 text-lg font-semibold text-highlighted">Otros préstamos de {{ borrower.name }}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoanCard v-for="l in borrowerHistory" :key="l.id" :loan="l" />
      </div>
    </div>

    <!-- Confirm modal -->
    <UModal v-model:open="confirmOpen" title="Confirmar inversión" :description="`Vas a aportar el ${selectedTier}% del importe restante.`">
      <template #body>
        <div class="space-y-3">
          <div class="flex items-center justify-between rounded-lg bg-muted/60 p-3">
            <span class="text-sm text-muted">Préstamo</span>
            <span class="text-sm font-medium text-highlighted">{{ loan.title }}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-muted/60 p-3">
            <span class="text-sm text-muted">Tu aportación</span>
            <span class="text-base font-bold text-highlighted">{{ formatEuro(investAmount) }}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-muted/60 p-3">
            <span class="text-sm text-muted">Retorno estimado</span>
            <span class="text-sm font-medium text-primary">+{{ formatEuro(estimatedReturn) }}</span>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton label="Cancelar" color="neutral" variant="ghost" @click="confirmOpen = false" />
        <UButton label="Confirmar inversión" icon="i-lucide-check" @click="doInvest" />
      </template>
    </UModal>
  </UContainer>

  <UContainer v-else class="py-20">
    <div class="flex flex-col items-center gap-3 text-center">
      <UIcon name="i-lucide-file-x" class="size-10 text-muted" />
      <p class="text-lg font-medium text-highlighted">Préstamo no encontrado</p>
      <UButton label="Volver al marketplace" @click="router.push('/prestamos')" />
    </div>
  </UContainer>
</template>
