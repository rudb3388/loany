<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  { label: 'Cómo funciona', to: '/#como-funciona' },
  { label: 'Invertir', to: '/prestamos', icon: 'i-lucide-trending-up' },
  { label: 'Niveles de confianza', to: '/#niveles' },
  { label: 'Prestatario', to: '/panel/prestatario', icon: 'i-lucide-hand-coins' },
  { label: 'Inversor', to: '/panel/inversor', icon: 'i-lucide-wallet' },
]
</script>

<template>
  <UApp>
    <UHeader :ui="{ center: 'hidden' }">
      <template #title>
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-highlighted">
          <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-inverted">
            <UIcon name="i-lucide-handshake" class="size-5" />
          </span>
          <span class="text-lg">Confianza</span>
        </NuxtLink>
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />
        <UButton to="/solicitar" label="Pedir préstamo" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
        <UButton to="/prestamos" label="Empezar a invertir" icon="i-lucide-arrow-right" trailing />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
        <div class="mt-4 flex flex-col gap-2">
          <UButton to="/solicitar" label="Pedir préstamo" color="neutral" variant="subtle" block />
          <UButton to="/prestamos" label="Empezar a invertir" block />
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #top>
        <UContainer class="py-8">
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div class="flex items-center gap-2 font-semibold text-highlighted">
                <span class="flex size-7 items-center justify-center rounded-lg bg-primary text-inverted">
                  <UIcon name="i-lucide-handshake" class="size-4" />
                </span>
                Confianza
              </div>
              <p class="mt-3 text-sm text-muted">
                Préstamos entre personas, financiados por la comunidad. Transparente y regulado.
              </p>
            </div>
            <div>
              <p class="text-sm font-semibold text-highlighted">Plataforma</p>
              <ul class="mt-3 space-y-2 text-sm text-muted">
                <li><NuxtLink to="/prestamos" class="hover:text-default">Marketplace</NuxtLink></li>
                <li><NuxtLink to="/solicitar" class="hover:text-default">Pedir préstamo</NuxtLink></li>
                <li><NuxtLink to="/panel/inversor" class="hover:text-default">Panel de inversor</NuxtLink></li>
              </ul>
            </div>
            <div>
              <p class="text-sm font-semibold text-highlighted">Confianza</p>
              <ul class="mt-3 space-y-2 text-sm text-muted">
                <li><NuxtLink to="/#niveles" class="hover:text-default">Niveles</NuxtLink></li>
                <li><NuxtLink to="/perfil/b1" class="hover:text-default">Perfiles verificados</NuxtLink></li>
              </ul>
            </div>
            <div>
              <p class="text-sm font-semibold text-highlighted">Legal</p>
              <ul class="mt-3 space-y-2 text-sm text-muted">
                <li><span>Protección de datos (RGPD)</span></li>
                <li><span>Términos y condiciones</span></li>
              </ul>
            </div>
          </div>
        </UContainer>
      </template>

      <template #left>
        <p class="text-muted text-sm">© {{ new Date().getFullYear() }} Confianza. Prototipo demostrativo.</p>
      </template>
      <template #right>
        <UBadge color="neutral" variant="subtle" label="Datos de ejemplo" icon="i-lucide-info" />
      </template>
    </UFooter>
  </UApp>
</template>
