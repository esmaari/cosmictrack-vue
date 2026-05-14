<template>
  <span 
    class="inline-flex rounded-full px-2 m-1 py-0.5 text-divine-light"
    :class="chipColorClass"
  >
    <!-- Düzenleme iconu -->
    <BaseIcon 
      icon="edit" 
      class="w-4 h-4 m-1 text-divine-light cursor-pointer"
      @click.stop="$emit('edit')" 
    />

    {{ label }}

    <!-- Silme/çıkartma iconu (opsiyonel) -->
    <BaseIcon 
      v-if="showToggle"
      icon="x" 
      class="w-5 h-5 m-0.5 text-moon-pearl cursor-pointer"
      @click.stop="$emit('toggle')"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

defineEmits(['edit', 'toggle'])

const props = withDefaults(defineProps<{
  label: string
  color?: string
  showToggle?: boolean
}>(), {
  showToggle: true
})

const chipColorClass = computed(() => {
  return props.color?.trim() ? props.color : 'bg-cosmic-indigo'
})
</script>
