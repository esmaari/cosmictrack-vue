<template>

     <label
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        class="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer text-divine-light"
        :class="cat.color"
      >
        <input
          type="checkbox"
          :value="cat.id"
          :checked="selectedCategories.includes(cat.id)"
          @change="handleCategoryToggle(cat.id)"
          class="form-checkbox"
        />
        {{ cat.title }}
      </label>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

const emit = defineEmits<{
  (e: 'toggle', catId: string): void
}>()

defineProps<{
  selectedCategories: string[];
}>()

const handleCategoryToggle = (catId: string) => {
  emit('toggle', catId)
}
</script>
