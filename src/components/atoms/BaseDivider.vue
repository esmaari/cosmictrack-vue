<template>
  <div :class="dividerClasses"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md'
})

const dividerClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-full h-px bg-border-dark my-1'
    case 'sm': return 'w-full h-px bg-border-dark my-3'
    case 'md': return 'w-full h-px bg-border-dark my-5'
    case 'lg': return 'w-full h-px bg-border-dark my-6'
    case 'xl': return 'w-full h-px bg-border-dark my-8'
    default:   return 'w-full h-px bg-border-dark my-12'
  }
})
</script>
