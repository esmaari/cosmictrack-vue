<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in notifications"
        :key="toast.id"
        class="rounded-lg shadow-lg px-4 py-3 text-sm border flex items-start gap-3 cursor-pointer"
        :class="variantClass(toast.type)"
        role="status"
        aria-live="polite"
        @click="remove(toast.id)"
      >
        <div class="mt-0.5">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="flex-1">
          {{ toast.message }}
        </div>
        <button
          class="text-xs text-btn-link-dark hover:text-btn-link-dark-hover"
          type="button"
          aria-label="Dismiss notification"
          @click.stop="remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)

const remove = (id: number) => store.remove(id)

const variantClass = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-cat-nature text-primary border-cat-nature/60'
    case 'error':
      return 'bg-error/10 text-error border-error/50'
    default:
      return 'bg-surface text-primary border-border-neutral'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
