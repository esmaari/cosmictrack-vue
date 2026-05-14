<template>
  <div
    class="relative flex flex-col sm:flex-row gap-4 bg-surface border border-border-dark rounded-xl shadow-md hover:shadow-xl transition-shadow p-4 w-full max-w-3xl cursor-pointer mb-4"
  >
    <div
      class="flex-grow"
      @click="goToJourney"
    >
      <h3 class="heading-3 pl-1">{{ props.heading }}</h3>
      <p class="my-4 pl-1">{{ props.description }}</p>
      
     <CategoryLabelChip
        v-for="cat in categories"
        :key="cat.id"
        :label="cat.title"
        :color="cat.color"
      />

      <div class="mt-2 flex flex-wrap gap-4 text-sm pl-1">
        <p class="sm text-light"> {{ formatedDates }}</p>
      </div>
    </div>

    <!-- Favorite Button (Tıklanabilir ama yönlendirme yapmaz) -->
    <div class="flex-shrink-0 hidden sm:flex items-start">
      <div @click.stop="toggleFavorite" class="flex items-center gap-1 cursor-pointer text-solar-gold hover:scale-105 transition-transform text-sm">
        <template v-if="props.isFavorite">
          <component :is="SolidHeartIcon" class="w-5 h-5 text-mars-red" />
        </template>
        <template v-else>
          <component :is="HeartIcon" class="w-5 h-5 text-mars-red" />
        </template>
      </div>
</div>

  </div>
</template>

<script setup lang="ts">
    import type { Category } from '@/stores/category'
    import CategoryLabelChip from '../atoms/CategoryLabelChip.vue'
    import { HeartIcon } from '@heroicons/vue/24/outline'
    import { HeartIcon as SolidHeartIcon } from '@heroicons/vue/24/solid'
    import { useRouter } from 'vue-router'
    import { computed } from 'vue'
    const router = useRouter()

    const props = defineProps({
        id: {
          type: [String, Number],
          required: true,
        } ,
        heading: { 
          type: String, 
          required: true },
        description: { 
          type: String, 
          required: true },
        icon: { 
          type: String, 
          default: 'sparkles' },
        isFavorite: { 
          type: Boolean, 
          default: false },
        createdAt: { 
          type: String, 
          required: true },
        updatedAt: { 
          type: String, 
          default: '' },
        categories: {
          type: Array as () => Category[],
          default: () => []
        }
  })

    const isFavorite = computed(() => props.isFavorite)
    const categories = computed(() => props.categories)

    const formatedDates = computed(() => {
      const created = props.createdAt?.split('T')[0] || ''
      const updated = props.updatedAt ? props.updatedAt.split('T')[0] : ''
      return `Created: ${created}  |  Updated: ${updated || created}`
    })

    const emit = defineEmits<{
      (e: 'toggleFavorite', newValue: boolean): void
    }>()

    function toggleFavorite() {
      const newValue = !isFavorite.value
      emit('toggleFavorite', newValue)
    }

    const goToJourney = () => {
      router.push(`/journeys/${props.id}`)
    }

</script>
