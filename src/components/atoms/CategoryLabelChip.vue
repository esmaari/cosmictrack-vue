<template>
  <span
    class="inline-block rounded-full px-2 mx-1 py-0.5 text-xs text-divine-light"
    :class="chipColorClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  color?: string
}>()

const chipColorClass = computed(() => {
  return props.color?.trim() ? props.color : 'bg-cosmic-indigo'
})

</script>
