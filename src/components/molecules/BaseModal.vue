<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-app/50 flex items-center justify-center z-50 overflow-y-auto overflow-x-hidden"
    @click.self="close"
  >
    <div
      class="bg-surface p-8 rounded-md shadow-md w-full max-w-5xl"
      @click.stop
    >
      <h1 class="heading-4 mb-4">{{ title }}</h1>

      <div class="mb-4">
        <slot>
          <p>{{ text }}</p>
        </slot>
      </div>

      <hr></hr>
      <div class="flex justify-end gap-2">
        <BaseButton :disabled="disablePrimary"
         @click="primaryAction">
          {{ primaryText }}
        </BaseButton>
        
        <BaseButton variant="tertiary" @click="close">
          {{ secondaryText }}
        </BaseButton>
     
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/atoms/BaseButton.vue'
  
  const props = defineProps<{
    show: Boolean
    title: string
    text?: string
    primaryText: string
    secondaryText: string
    disablePrimary?: boolean
  }>()
  
  const emit = defineEmits<{
  (e: 'close'): void
  (e: 'primaryAction'): void
  (e: 'update:show', value: boolean): void
}>()

const close = () => {
  emit('update:show', false)
  emit('close')
}
  
const primaryAction = () => {
  emit('primaryAction')
}  
</script>
  