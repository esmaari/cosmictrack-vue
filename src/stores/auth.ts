import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import type { Session, User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const user = ref<User | null>(null)
  const sessionChecked = ref(false)

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Fetch session error:', error.message)
      sessionChecked.value = true
      return
    }
    session.value = data.session
    user.value = data.session?.user ?? null
    sessionChecked.value = true
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    session.value = data.session
    user.value = data.session?.user ?? null
  }

    const logout = async () => {
        try {
            // 🔒 SADECE local tarayıcı oturumunu sonlandırır
            const { error } = await supabase.auth.signOut({ scope: 'local' })

            if (error) {
                console.error('Logout error:', error.message)

            // Eğer logout başarısız olursa, manuel temizleme yap
            localStorage.removeItem('supabase.auth.token')
            session.value = null
            user.value = null
            sessionChecked.value = false
            window.location.reload()
            return
          }

          // Başarılı çıkış → store temizlenir
          session.value = null
          user.value = null
          sessionChecked.value = false
        } catch (err) {
            console.error('Unexpected logout error:', err)

            // Yine hata varsa, elle logout yap
            localStorage.removeItem('supabase.auth.token')
            session.value = null
            user.value = null
            sessionChecked.value = false
            window.location.reload()
        }
    }
  
  

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    await fetchSession()
  }

  return {
    session,
    user,
    sessionChecked,
    fetchSession,
    login,
    logout,
    register
  }
})
