<template>
  <div class="max-w-md w-full mx-auto px-4 py-12 my-16 flex flex-col gap-6">
    <form
      v-if="!auth.session && !registrationSent"
      @submit.prevent="handleSubmit"
      class="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <h2 class="text-center heading-2">
        {{ formType === 'login' ? 'Login to your account' : 'Create a new account' }}
      </h2>

      <BaseInput
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />

      <BaseInput
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <BaseButton type="submit" class="w-full">
        {{ formType === 'login' ? 'Login' : 'Register' }}
      </BaseButton>
    </form>

    <div
      v-else-if="registrationSent"
      class="space-y-3 bg-white p-6 rounded-xl shadow-md text-center"
    >
      <h2 class="heading-2">Check your email</h2>
      <p class="text-gray-700">
        We sent a confirmation link to <strong>{{ email }}</strong>. Verify your email to activate your account, then come back to sign in.
      </p>
      <BaseButton class="w-full" @click="resetToLogin">Back to login</BaseButton>
    </div>


    <div class="my-3 p-6 text-center">
      <p
        v-if="!auth.session && !registrationSent"
        @click="toggleFormType"
        class="mt-4 text-xl text-center text-btn-link-light hover:text-btn-link-light-hover cursor-pointer font-medium"
      >
        {{ formType === 'login' ? "Don't have an account? Register" : 'Already have an account? Login' }}
      </p>
    </div>
   
  </div>
</template>

  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import BaseInput from './atoms/BaseInput.vue';
  import BaseButton from './atoms/BaseButton.vue';
  import { useNotificationStore } from '@/stores/notification';

  const auth = useAuthStore()
  const formType = ref<'login' | 'register'>('login');
  const email = ref('');
  const password = ref('');
  const registrationSent = ref(false);
  const router = useRouter();
  const route = useRoute()
  const notify = useNotificationStore()
  
  const redirectTo = (route.query.redirect as string) || '/my-journeys'

  const toggleFormType = () => {
    formType.value = formType.value === 'login' ? 'register' : 'login';
  };

  const resetToLogin = () => {
    registrationSent.value = false
    formType.value = 'login'
  }
  
  const handleSubmit = async () => {

    try {
      if (formType.value === 'login') {
        await auth.login(email.value, password.value);
        await auth.fetchSession();
        router.push(redirectTo)
      } else {
        await auth.register(email.value, password.value);
        registrationSent.value = true
        notify.info('Please check your email to confirm your account')
      }
    } catch (err: any) {
         notify.error(err?.message ?? 'Login failed')
    }
    
  };
  </script>
  
