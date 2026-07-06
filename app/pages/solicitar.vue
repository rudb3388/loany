<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { TRUST_LEVELS, formatEuro } from '~/composables/useData'

const toast = useToast()

const schema = z.object({
  title: z.string().min(4, 'Describe brevemente el propósito'),
  purpose: z.string().min(10, 'Cuéntanos para qué necesitas el préstamo'),
  amount: z.number().min(300, 'El mínimo es 300 €').max(50000, 'El máximo es 50.000 €'),
  termMonths: z.number().min(6).max(60),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  purpose: '',
  amount: 5000,
  termMonths: 24,
})

// Simulated trust profile of the current borrower
const trustLevel = ref<'Bronce' | 'Plata' | 'Oro' | 'Platino'>('Oro')
const trustOptions = [
  { label: 'Bronce', value: 'Bronce' },
  { label: 'Plata', value: 'Plata' },
  { label: 'Oro', value: 'Oro' },
  { label: 'Platino', value: 'Platino' },
]

// Rate depends on trust level and term
const estimatedRate = computed(() => {
  const base: Record<string, number> = { Bronce: 11.5, Plata: 8.5, Oro: 6.5, Platino: 5.0 }
  const termAdj = ((state.termMonths ?? 24) - 24) / 12 * 0.4
  return Math.max(4, +(base[trustLevel.value] + termAdj).toFixed(1))
})

const maxByLevel: Record<string, number> = { Bronce: 3000, Plata: 10000, Oro: 25000, Platino: 50000 }

const monthlyPayment = computed(() => {
  const p = state.amount ?? 0
  const n = state.termMonths ?? 24
  const r = estimatedRate.value / 100 / 12
  if (r === 0) return p / n
  return (p * r) / (1 - Math.pow(1 + r, -n))
})

const submitted = ref(false)

function onSubmit(_event: FormSubmitEvent<Schema>) {
  submitted.value = true
  toast.add({
    title: 'Solicitud enviada',
    description: 'Tu préstamo se ha publicado en el marketplace para financiación.',
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}
</script>

<template>
  <UContainer class="py-8">
    <UPageHeader
      title="Solicita tu préstamo"
      description="Pide desde 300 € hasta 50.000 €. Tu nivel de confianza determina el tipo de interés y el importe máximo."
      :ui="{ root: 'py-4' }"
    />

    <div v-if="!submitted" class="mt-6 grid gap-8 lg:grid-cols-3">
      <!-- Form -->
      <div class="lg:col-span-2">
        <UCard>
          <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormField name="title" label="Título del préstamo" required>
              <UInput v-model="state.title" placeholder="Ej. Renovación de equipo de trabajo" size="lg" />
            </UFormField>

            <UFormField name="purpose" label="¿Para qué lo necesitas?" required>
              <UTextarea v-model="state.purpose" :rows="3" placeholder="Explica el destino del préstamo. La transparencia genera más confianza en los inversores." />
            </UFormField>

            <UFormField name="amount" :label="`Importe: ${formatEuro(state.amount ?? 0)}`" required :hint="`Máx. para nivel ${trustLevel}: ${formatEuro(maxByLevel[trustLevel])}`">
              <USlider v-model="state.amount" :min="300" :max="50000" :step="100" class="my-3" />
              <UInput v-model="state.amount" type="number" :min="300" :max="50000" icon="i-lucide-euro" />
            </UFormField>

            <UFormField name="termMonths" :label="`Plazo de devolución: ${state.termMonths} meses`" required>
              <USlider v-model="state.termMonths" :min="6" :max="60" :step="6" class="my-3" />
            </UFormField>

            <UFormField label="Tu nivel de confianza (simulado)" hint="En producción se calcula con tu historial">
              <USelect v-model="trustLevel" :items="trustOptions" value-key="value" class="w-full" />
            </UFormField>

            <UAlert
              v-if="(state.amount ?? 0) > maxByLevel[trustLevel]"
              color="warning"
              variant="subtle"
              icon="i-lucide-triangle-alert"
              title="Importe por encima de tu nivel"
              :description="`Con nivel ${trustLevel} puedes pedir hasta ${formatEuro(maxByLevel[trustLevel])}. Sube de nivel devolviendo préstamos a tiempo.`"
            />

            <UButton type="submit" label="Publicar solicitud" size="lg" icon="i-lucide-send" />
          </UForm>
        </UCard>
      </div>

      <!-- Live summary -->
      <div>
        <UCard :ui="{ root: 'sticky top-24' }">
          <template #header>
            <p class="font-semibold text-highlighted">Condiciones estimadas</p>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Nivel de confianza</span>
              <TrustBadge :level="trustLevel" size="sm" />
            </div>
            <div class="rounded-lg bg-primary/10 p-4 text-center">
              <p class="text-xs text-primary">Tipo de interés estimado</p>
              <p class="text-3xl font-bold text-primary">{{ estimatedRate }}%</p>
              <p class="text-xs text-muted">{{ TRUST_LEVELS[trustLevel].perk }}</p>
            </div>
            <USeparator />
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Importe</span>
              <span class="font-medium text-highlighted">{{ formatEuro(state.amount ?? 0) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Plazo</span>
              <span class="font-medium text-highlighted">{{ state.termMonths }} meses</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Cuota mensual aprox.</span>
              <span class="font-bold text-highlighted">{{ formatEuro(monthlyPayment) }}</span>
            </div>
            <p class="text-xs text-muted">
              Estimación orientativa. Los inversores financiarán tu préstamo en fracciones.
            </p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Success state -->
    <UCard v-else class="mt-6">
      <div class="flex flex-col items-center gap-4 py-10 text-center">
        <div class="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UIcon name="i-lucide-check" class="size-8" />
        </div>
        <h2 class="text-xl font-bold text-highlighted">¡Solicitud publicada!</h2>
        <p class="max-w-md text-muted">
          Tu préstamo de <strong>{{ formatEuro(state.amount ?? 0) }}</strong> a un {{ estimatedRate }}% ya está visible
          en el marketplace. Los inversores empezarán a aportar fracciones muy pronto.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <UButton to="/prestamos" label="Ver el marketplace" icon="i-lucide-store" />
          <UButton to="/panel/prestatario" label="Ir a mi panel" color="neutral" variant="subtle" />
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
