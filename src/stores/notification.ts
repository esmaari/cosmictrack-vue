import { defineStore } from 'pinia'
import { ref } from 'vue'

type NotificationType = 'success' | 'error' | 'info'

type Notification = {
  id: number
  type: NotificationType
  message: string
  timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let counter = 0

  function push(message: string, type: NotificationType = 'info', timeout = 3000) {
    const id = ++counter
    notifications.value.push({ id, type, message, timeout })

    if (timeout && timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }

    return id
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const success = (message: string, timeout?: number) => push(message, 'success', timeout ?? 2500)
  const error = (message: string, timeout?: number) => push(message, 'error', timeout ?? 5000)
  const info = (message: string, timeout?: number) => push(message, 'info', timeout ?? 3000)

  return {
    notifications,
    push,
    remove,
    success,
    error,
    info,
  }
})
