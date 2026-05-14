<template>
  <div class="relative w-full max-w-3xl mx-auto mt-12">
      <div class="absolute bottom-12 left-1/2 border-2 w-px h-full"></div>
      <div v-for="(step, index) in reversedSteps" :key="step.id">
        <div
          @click="openEditStepModal(step)"
          class="relative pl-8 sm:pl-34 py-6 rounded-md mb-6 group cursor-pointer bg-app hover:bg-app-darker curser-pointer"
        >
        <div class="flex flex-col sm:flex-row items-start mb-1">
          <time
              class="sm:absolute left-6 translate-y-0.5 text-center inline-flex items-center justify-center text-xs font-semibold px-2 sm:w-24 h-6 sm:h-10 mb-3 sm:mb-0 text-btn-primary-text bg-btn-primary rounded-full"
          >
            Created: {{ formatDate(step.created_at) }}
          </time>
        </div>
   
        <div class="font-caveat font-medium text-2xl text-btn-primary-text mb-1 sm:mb-0">
          Step {{ reversedSteps.length - index }}
        </div>
          
        <h4 class="heading-4 text-btn-primary-text">{{ step.title }}</h4>
        <p class="text-btn-primary-text">{{ step.note }}</p>
       
        <time class="text-xs text-light">
          Last update: {{ formatDate(step.updated_at) }}
        </time>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
  import { useJourneyStore } from '@/stores/journey';
  import { defineEmits, computed } from 'vue';

  const journeyStore = useJourneyStore()
  
  const reversedSteps = computed(() =>
    (journeyStore.steps ?? []).slice().reverse()
  )

  const emit = defineEmits(['openEditStepModal']);

  function openEditStepModal(step: any) {
      emit('openEditStepModal', step);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  }

</script>