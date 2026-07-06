<script setup lang="ts">
import { TRUST_LEVELS, type TrustLevel } from '../composables/useData.ts'

const props = withDefaults(
  defineProps<{ level: TrustLevel; size?: 'sm' | 'md' | 'lg' }>(),
  { size: 'md' },
)

const meta = computed(() => TRUST_LEVELS[props.level])
</script>

<template>
  <UBadge :color="meta.color" variant="subtle" :size="size" :icon="meta.icon" :label="level" />
</template>
