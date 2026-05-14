<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
  >
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-6 h-6 mr-2"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  variant: {
    type: String as () => 'primary'|'secondary'|'success'|'warning' |'error' |'link' |'tertiary' | 'tertiaryOnDark',
    default: 'primary',
  },
  icon: {
    type: String,
    default:'',
  },
  size: {
    type: String as () => 'sm'|'md'|'lg'|'full'|undefined,
    default: undefined,
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => 'button'|'submit'|'reset',
    default: 'button',
  },
})

const base = 'btn'
const variantMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  link: 'btn-link',
  tertiary: 'btn-tertiary',
  tertiaryOnDark: 'btn-tertiary-on-dark'
} as const

const sizeMap = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  full: 'btn-block'
} as const

const buttonClasses = computed(() => [
  base,
  variantMap[props.variant],
  props.size ? sizeMap[props.size] : '',
  props.block ? 'btn-block' : '',
].filter(Boolean).join(' '))

</script>
