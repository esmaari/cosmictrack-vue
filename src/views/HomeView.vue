<template>
<main class="relative min-h-screen">

    <div class="absolute inset-0 bg-[url('/images/CT_bg.png')] bg-cover bg-center"></div>


    <img 
      src="/images/Moon_and_stars.svg"
      class="absolute sm:left-16 md:left-40 lg:left-48"
    />

    <img 
  src="/images/witchfool.png"
  class="absolute w-24 sm:w-32 md:w-40 lg:w-48 top-4 sm:top-12 md:top-24 right-4 sm:right-8 md:right-16 lg:right-80"
/>

  <div class="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 max-w-xl">
      <AppIntro />
      <CreateJourney v-if="session"/>

      <div class="flex justify-center mt-12 gap-5 w-full ">
            <img 
  src="/icons/cup.svg" class="w-16 text-btn-primary"
/>
            <img 
  src="/icons/sword.svg" class="w-16 text-btn-primary"
/>
            <img 
  src="/icons/wand.svg" class="w-16 text-btn-primary"
/>
            <img 
  src="/icons/pentacle.svg" class="w-16 text-btn-primary"
/>
      </div>
  </div>


  </main>
</template>


<script setup lang="ts">

import AppIntro from '@/components/AppIntro.vue'
import CreateJourney from '@/components/journeys/CreateJourney.vue';
import { supabase } from '@/lib/supabase';
import { ref, onMounted, computed } from 'vue';

const user = ref(false)
const session = ref();

const showRegisterForm = () => {
  user.value = !user.value
}

onMounted(async () => {
  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession();

  session.value = currentSession;
  user.value = true
});

</script>

