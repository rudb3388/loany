<script setup lang="ts">
import { TRUST_LEVELS, formatEuro, useData } from '~/composables/useData'

// Current borrower = Lucía (b1)
const { getBorrower, loansByBorrower } = useData()
const me = computed(() => getBorrower('b1')!)
const myLoans = computed(() => loansByBorrower('b1'))

const active = computed(() => myLoans.value.filter((l) => l.status !== 'devuelto'))
const totalOutstanding = computed(() => active.value.reduce((s, l) => s + l.amount, 0))
const totalFunded = computed(() => myLoans.value.reduce((s, l) => s + l.funded, 0))

const nextLevel = 'Platino'
</script>

<template>
    <UContainer class="py-8">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
                <UAvatar :text="me.initials" size="lg" :ui="{ root: 'bg-elevated' }" />
                <div>
                    <p class="text-sm text-muted">Panel de prestatario</p>
                    <h1 class="text-xl font-bold text-highlighted">Hola, {{ me.name.split(' ')[0] }}</h1>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <TrustBadge :level="me.trustLevel" size="lg" />
                <UButton to="/solicitar" label="Nuevo préstamo" icon="i-lucide-plus" />
            </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <UCard variant="soft" :ui="{ body: 'p-4' }">
                <div class="flex items-center gap-2 text-muted">
                    <UIcon name="i-lucide-wallet" class="size-4" /><span class="text-xs">Deuda viva</span>
                </div>
                <p class="mt-1 text-2xl font-bold text-highlighted">{{ formatEuro(totalOutstanding) }}</p>
            </UCard>
            <UCard variant="soft" :ui="{ body: 'p-4' }">
                <div class="flex items-center gap-2 text-muted">
                    <UIcon name="i-lucide-banknote" class="size-4" />
                    <span class="text-xs">Financiado históricamente</span>
                </div>

                <p class="mt-1 text-2xl font-bold text-highlighted">
                    {{ formatEuro(totalFunded) }}
                </p>

                <p class="mt-1 text-xs text-muted">
                    Suma de todos los préstamos obtenidos en la plataforma
                </p>
            </UCard>
            <UCard variant="soft" :ui="{ body: 'p-4' }">
                <div class="flex items-center gap-2 text-muted">
                    <UIcon name="i-lucide-timer" class="size-4" /><span class="text-xs">Puntualidad</span>
                </div>
                <p class="mt-1 text-2xl font-bold text-highlighted">{{ me.onTimeRate }}%</p>
            </UCard>
            <UCard variant="soft" :ui="{ body: 'p-4' }">
                <div class="flex items-center gap-2 text-muted">
                    <UIcon name="i-lucide-star" class="size-4" /><span class="text-xs">Puntuación</span>
                </div>
                <p class="mt-1 text-2xl font-bold text-highlighted">{{ me.scorePoints }}</p>
            </UCard>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
            <!-- My loans -->
            <div class="lg:col-span-2 space-y-4">
                <h2 class="text-lg font-semibold text-highlighted">Mis préstamos</h2>
                <UCard v-for="loan in myLoans" :key="loan.id" variant="outline">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <UBadge
                                    :color="loan.status === 'financiando' ? 'info' : loan.status === 'activo' ? 'primary' : 'neutral'"
                                    variant="subtle" class="capitalize" :label="loan.status" />
                                <span class="text-xs text-muted">{{ loan.createdAt }}</span>
                            </div>
                            <h3 class="mt-1 font-medium text-highlighted">{{ loan.title }}</h3>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-highlighted">{{ formatEuro(loan.amount) }}</p>
                            <p class="text-xs text-muted">{{ loan.interestRate }}% · {{ loan.termMonths }} m</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="mb-1 flex justify-between text-xs">
                            <span class="text-muted">{{ loan.contributions.length }} inversores</span>
                            <span class="font-medium text-highlighted">{{ Math.round((loan.funded / loan.amount) * 100)
                                }}% financiado</span>
                        </div>
                        <UProgress :model-value="Math.round((loan.funded / loan.amount) * 100)" :max="100" size="sm" />
                    </div>
                    <div class="mt-3 flex gap-2">
                        <UButton :to="`/prestamos/${loan.id}`" label="Ver detalle" size="sm" variant="subtle"
                            color="neutral" />
                    </div>
                </UCard>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <UCard>
                    <p class="font-medium text-highlighted">Tu nivel de confianza</p>
                    <div class="mt-3 flex items-center justify-between">
                        <TrustBadge :level="me.trustLevel" size="lg" />
                        <UIcon :name="TRUST_LEVELS[me.trustLevel].icon" class="size-7 text-primary" />
                    </div>
                    <p class="mt-3 text-sm text-muted">{{ TRUST_LEVELS[me.trustLevel].perk }}</p>
                    <USeparator class="my-4" />
                    <p class="text-xs text-muted">
                        Mantén tus pagos puntuales para conservar el nivel {{ nextLevel }} y sus tipos de interés
                        mínimos.
                    </p>
                    <UButton to="/perfil/b1" label="Ver mi perfil público" variant="subtle" color="neutral" block
                        class="mt-4" trailing-icon="i-lucide-external-link" />
                </UCard>

                <UCard variant="subtle">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-lightbulb" class="size-5 text-primary" />
                        <p class="font-medium text-highlighted">Consejo</p>
                    </div>
                    <p class="mt-2 text-sm text-muted">
                        Los préstamos con una descripción clara del propósito se financian hasta un 40% más rápido.
                    </p>
                </UCard>
            </div>
        </div>
    </UContainer>
</template>
