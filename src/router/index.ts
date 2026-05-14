import { createRouter, createWebHistory } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'

import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import MyJourneysView from '@/views/MyJourneysView.vue'
import JourneyDetailView from '@/views/JourneyDetailView.vue'
import cosTraStyleguide from '@/views/cosTraStyleguide.vue'
import AuthForm from '@/components/AuthForm.vue'
import About from '@/views/About.vue'
import Impressum from '@/views/Impressum.vue'
import Privacy from '@/views/Privacy.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/auth', name: 'AuthForm', component: AuthForm },
  { path: '/about', name: 'About', component: About },
  { path: '/impressum', name: 'Impressum', component: Impressum },
  { path: '/privacy', name: 'Privacy', component: Privacy },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true } },
  { path: '/my-journeys', name: 'MyJourneys', component: MyJourneysView, meta: { requiresAuth: true } },
  { path: '/costrastyleguide', name: 'StyleGuide', component: cosTraStyleguide },
  { path: '/journeys/:id', name: 'JourneyDetail', component: JourneyDetailView, props: true, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory('/cosmictrack/'), 
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const notify = useNotificationStore()

  // Ensure session is loaded
  if (!auth.sessionChecked) {
    try {
      await auth.fetchSession()
    } catch (err) {
      console.error('Auth fetch failed:', err)
      notify.error('Failed to check session')
    }
  }

  if (to.meta.requiresAuth && !auth.user) {
    next({ name: 'AuthForm', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
