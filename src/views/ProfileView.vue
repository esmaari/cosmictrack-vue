<template>

   <div class="">
      <h3 class="heading-3 text-surface font-semibold mb-2 p-4">My Profile</h3> 

      <main class="grid grid-cols-2 gap-6 p-8">

        <div class="bg-surface p-4">

<ul>
  <li>
    <BaseButton
      variant="link"
      @click="activeTab = 'account'"
    >
      Your Account info
    </BaseButton>
  </li>

  <li>
    <BaseButton
      variant="link"
      @click="activeTab = 'password'"
    >
      Password change
    </BaseButton>
  </li>

  <li>
    <BaseButton
      variant="link"
      @click="activeTab = 'avatar'"
    >
      Avatar
    </BaseButton>
  </li>
</ul>




         
          <BaseButton class="w-full" @click="logout">Logout</BaseButton>
        </div>

        <div class="bg-surface p-4">
          <div v-if="activeTab === 'account'" class="text-center space-y-1">
            <p class="text-lg font-medium">Email: {{ auth.user?.email }}</p>
            <p class="text-sm text-gray-500">User ID: {{ auth.user?.id }}</p>
          </div>
          
          <div v-else-if="activeTab === 'password'" class="text-center space-y-1">
             <p class="text-lg font-medium">Change your password</p>
          </div>

          <div v-else-if="activeTab === 'avatar'" class="text-center space-y-1">
            <p class="text-lg font-medium">Change your avatar</p>
          </div>
  
        </div>
        
   
      </main>
  </div>

  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

const logout = async () => {
  await auth.logout()
}

const activeTab = ref<'account' | 'password' | 'avatar'>('account')



</script>
