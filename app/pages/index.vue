<script setup lang="ts">
import { TRUST_LEVELS, formatEuro, useData, type TrustLevel } from '~/composables/useData'

const { allLoans } = useData()
const featured = computed(() => allLoans.value.filter((l) => l.status === 'financiando').slice(0, 3))

const levels = Object.keys(TRUST_LEVELS) as TrustLevel[]

const steps = [
  {
    icon: 'i-lucide-file-pen',
    title: 'Solicita tu préstamo',
    description: 'Pide desde 300 € hasta 50.000 €. Verificamos tu identidad e ingresos para asignarte un nivel de confianza.',
  },
  {
    icon: 'i-lucide-users',
    title: 'La comunidad lo financia',
    description: 'En vez de un único inversor, decenas o cientos de personas aportan una fracción de tu préstamo.',
  },
  {
    icon: 'i-lucide-piggy-bank',
    title: 'Devuelve y crece',
    description: 'Pagas cuotas mensuales. Cada pago puntual mejora tu nivel y te desbloquea mejores condiciones.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      :ui="{ container: 'py-16 sm:py-24', title: 'text-balance', description: 'text-balance' }"
      title="Préstamos entre personas, financiados por muchas manos"
      description="Pide desde 300 € hasta 50.000 €. Un préstamo de 10.000 € puede repartirse entre 100 personas que aportan 100 € cada una. Transparente, justo y basado en la confianza."
      orientation="horizontal"
    >
      <template #links>
        <UButton to="/solicitar" label="Pedir un préstamo" size="lg" icon="i-lucide-hand-coins" />
        <UButton to="/prestamos" label="Quiero invertir" size="lg" color="neutral" variant="subtle" trailing-icon="i-lucide-arrow-right" />
      </template>

      <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
        <div class="bg-primary p-6 text-inverted">
          <p class="text-sm opacity-90">Préstamo destacado</p>
          <p class="mt-1 text-3xl font-bold">{{ formatEuro(10000) }}</p>
          <p class="text-sm opacity-90">repartido entre 100 inversores</p>
        </div>
        <div class="grid grid-cols-2 gap-px bg-default">
          <div class="bg-elevated p-5">
            <p class="text-2xl font-bold text-highlighted">100 €</p>
            <p class="text-xs text-muted">aportación media por persona</p>
          </div>
          <div class="bg-elevated p-5">
            <p class="text-2xl font-bold text-highlighted">5,4%</p>
            <p class="text-xs text-muted">interés anual</p>
          </div>
          <div class="bg-elevated p-5">
            <p class="text-2xl font-bold text-highlighted">73%</p>
            <p class="text-xs text-muted">financiado</p>
          </div>
          <div class="bg-elevated p-5">
            <p class="text-2xl font-bold text-highlighted">24 m</p>
            <p class="text-xs text-muted">plazo de devolución</p>
          </div>
        </div>
      </UCard>
    </UPageHero>

    <!-- Trust bar -->
    <UContainer>
      <div class="grid grid-cols-2 gap-6 rounded-xl border border-default bg-elevated/40 p-6 sm:grid-cols-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-highlighted">300 € – 50.000 €</p>
          <p class="text-xs text-muted">rango de préstamo</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-highlighted">desde 10%</p>
          <p class="text-xs text-muted">aportación mínima como inversor</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-highlighted">4 niveles</p>
          <p class="text-xs text-muted">de confianza</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-highlighted">100%</p>
          <p class="text-xs text-muted">perfiles verificados (RGPD)</p>
        </div>
      </div>
    </UContainer>

    <!-- How it works -->
    <UPageSection
      id="como-funciona"
      headline="Cómo funciona"
      title="Financiación colectiva, fracción a fracción"
      description="Cada préstamo se divide en pequeñas aportaciones. Los inversores eligen cuánto arriesgar y diversifican entre muchos prestatarios."
    >
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="(step, i) in steps" :key="step.title" variant="soft">
          <div class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon :name="step.icon" class="size-6" />
          </div>
          <p class="mt-4 text-sm font-medium text-muted">Paso {{ i + 1 }}</p>
          <h3 class="mt-1 font-semibold text-highlighted">{{ step.title }}</h3>
          <p class="mt-2 text-sm text-muted leading-relaxed">{{ step.description }}</p>
        </UCard>
      </div>
    </UPageSection>

    <!-- Fractional investment explainer -->
    <UContainer class="py-8">
      <UCard variant="subtle" :ui="{ body: 'p-6 sm:p-10' }">
        <div class="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <UBadge color="primary" variant="subtle" label="Inversión fraccionada" icon="i-lucide-chart-pie" />
            <h2 class="mt-3 text-2xl font-bold text-highlighted text-balance">
              Aporta el 10%, 30%, 50% o el 100%. Tú decides tu exposición.
            </h2>
            <p class="mt-3 text-muted leading-relaxed">
              En lugar de asumir un préstamo entero, reparte tu inversión entre muchos prestatarios.
              Diversificar reduce el riesgo: si aportas 100 € a 50 préstamos distintos, un impago
              apenas afecta a tu cartera.
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <UBadge v-for="t in [10, 30, 40, 50, 70, 100]" :key="t" color="neutral" variant="outline" :label="`${t}%`" size="lg" />
            </div>
          </div>
          <div class="rounded-xl border border-default bg-default p-5">
            <p class="text-sm font-medium text-highlighted">Ejemplo: préstamo de {{ formatEuro(10000) }}</p>
            <div class="mt-4 space-y-3">
              <div v-for="row in [
                { n: '100 personas', a: '100 € cada una', w: 'w-full' },
                { n: '20 personas', a: '500 € cada una', w: 'w-3/5' },
                { n: '4 personas', a: '2.500 € cada una', w: 'w-2/5' },
              ]" :key="row.n" class="flex items-center gap-3">
                <div class="w-28 text-sm text-muted shrink-0">{{ row.n }}</div>
                <div class="h-2 flex-1 rounded-full bg-muted">
                  <div class="h-2 rounded-full bg-primary" :class="row.w" />
                </div>
                <div class="w-24 text-right text-xs text-highlighted shrink-0">{{ row.a }}</div>
              </div>
            </div>
            <p class="mt-4 text-xs text-muted">
              El mismo préstamo puede repartirse de muchas formas. Cuantos más inversores, menor es el riesgo individual.
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>

    <!-- Trust levels -->
    <UPageSection
      id="niveles"
      headline="Niveles de confianza"
      title="Mejor historial, mejores condiciones"
      description="Cada préstamo devuelto a tiempo suma puntos. Al subir de nivel, accedes a tipos de interés más bajos y a importes más altos."
    >
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <UCard
          v-for="level in levels"
          :key="level"
          :variant="level === 'Platino' ? 'solid' : 'outline'"
          :ui="{ root: level === 'Platino' ? 'ring-2 ring-primary' : '' }"
        >
          <div class="flex items-center justify-between">
            <UIcon :name="TRUST_LEVELS[level].icon" class="size-7 text-primary" />
            <TrustBadge :level="level" size="sm" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-highlighted">{{ level }}</h3>
          <p class="mt-1 text-xs text-muted">Puntuación desde {{ TRUST_LEVELS[level].minScore }}</p>
          <USeparator class="my-4" />
          <p class="text-sm text-muted leading-relaxed">{{ TRUST_LEVELS[level].perk }}</p>
        </UCard>
      </div>
    </UPageSection>

    <!-- Featured loans -->
    <UPageSection
      headline="Marketplace"
      title="Préstamos abiertos a inversión"
      :links="[{ label: 'Ver todos', to: '/prestamos', trailingIcon: 'i-lucide-arrow-right', color: 'neutral', variant: 'subtle' }]"
    >
      <div class="grid gap-6 md:grid-cols-3">
        <LoanCard v-for="loan in featured" :key="loan.id" :loan="loan" />
      </div>
    </UPageSection>

    <!-- CTA -->
    <UContainer class="pb-16">
      <UPageCTA
        title="Empieza hoy, del lado que prefieras"
        description="Pide el préstamo que necesitas o invierte tu dinero ayudando a personas reales. Sin letra pequeña."
        variant="subtle"
        :links="[
          { label: 'Pedir préstamo', to: '/solicitar', icon: 'i-lucide-hand-coins' },
          { label: 'Explorar inversiones', to: '/prestamos', color: 'neutral', variant: 'subtle', trailingIcon: 'i-lucide-arrow-right' },
        ]"
      />
    </UContainer>
  </div>
</template>
