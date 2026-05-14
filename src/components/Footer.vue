<template>
  <footer class="bg-footer-heading py-6 sticky">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      
      <!-- Navigation Links -->
      <div class="flex flex-wrap gap-6 text-sm">
        <RouterLink to="/about" 
          :class="isActive('/about') ? 'text-btn-link-light-pressed' : 'text-btn-link-light hover:text-btn-link-light-hover'" 
          >About</RouterLink>
                   
        <RouterLink to="/impressum" 
          :class="isActive('/impressum') ? 'text-btn-link-light-pressed' : 'text-btn-link-light hover:text-btn-link-light-hover'" 
         >Impressum (Legal Disclosure)</RouterLink>

        <RouterLink to="/privacy" 
          :class="isActive('/privacy') ? 'text-btn-link-light-pressed' : 'text-btn-link-light hover:text-btn-link-light-hover'" 
         >Privacy</RouterLink>
      </div>

      <!-- Copyright -->
      <p class="text-sm text-on-dark text-center md:text-right">
        &copy; 2025 CosmicTrack. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useRoute  } from 'vue-router'
  
  const route = useRoute()
  const isActive = (path: string) => route.path === path
</script>
