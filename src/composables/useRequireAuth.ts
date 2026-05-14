// src/composables/useRequireAuth.ts
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

export const useRequireAuth = async () => {
  const auth = useAuthStore()
  const notify = useNotificationStore()

  if (!auth.user) {
    await auth.fetchSession()
  }
  if (!auth.user?.id) {
    notify.error('Please sign in')
    throw new Error('AUTH_REQUIRED')
  }
  return auth.user
}
