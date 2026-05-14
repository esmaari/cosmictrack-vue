<template>
  <div class="flex flex-col min-h-screen bg-app">
    <!-- Navbar -->
    <Navbar v-if="auth.user !== undefined" :user="auth.user" />
  <!-- Main content -->
     <main class="flex-grow">
        <RouterView />
  </main>
  
 

    <!-- Footer -->
    <Footer />
    <Notification />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Notification from './components/molecules/Notification.vue'

const auth = useAuthStore();

onMounted(() => {
  auth.fetchSession()
})
</script>
