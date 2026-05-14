<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-app/50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div
      class="bg-surface p-8 rounded-md shadow-md w-full max-w-5xl"
      @click.stop
    >
      <h1 class="heading-4 mb-4">{{ title }}</h1>


      <form class="space-y-4 mt-4">
          <BaseInput v-model="categoryName" label="Category Name:" placeholder="e.g. my family" />
          <div class="pt-4">
            <p>Choose a color for the category:</p>
            <div class="flex gap-2 flex-wrap mt-1">
              <div
                v-for="color in colorOptions"
                :key="color.name"
                class="w-6 h-6 rounded-full cursor-pointer border-2"
                :style="{ backgroundColor: color.value }"
                :class="categoryColor === color.name ? 'border-app scale-110' : 'border-transparent'"
                @click="categoryColor = color.name"
              ></div>
            </div>
          </div>
      </form>

      <div 
        v-if="props.action==='edit'"
        class="text-right mb-3 text-mars-red hover:text-mystic-pink cursor-pointer flex flex-row-reverse"
        @click="handleDeleteCategory"
      >
        <a>Delete this category</a>
        <BaseIcon icon="delete" class="w-6 h-6" />
      </div>

      <hr></hr>
      <div class="flex justify-end gap-2">
        <BaseButton :disabled="disablePrimary"
         @click="primaryAction">
          {{ primaryText }}
        </BaseButton>
        
        <BaseButton variant="tertiary" @click="close">
          {{ secondaryText }}
        </BaseButton>
     
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">

  import { ref, computed, watch } from 'vue';
  import BaseInput from '../atoms/BaseInput.vue';
  import BaseIcon from '../atoms/BaseIcon.vue'
  import BaseButton from '@/components/atoms/BaseButton.vue'

  const title = computed(() => {
    return props.action === 'add' ? 'Add new category' : 'Edit category'
  })

  const categoryName = ref('')
  const categoryColor = ref('')
  
  const props = defineProps<{
    show: Boolean
    selectedCategoryId?: string 
    selectedCategoryTitle?: string 
    selectedCategoryColor?: string 
    action: string
    primaryText: string
    secondaryText: string
    disablePrimary?: boolean
  }>()

  watch(
    () => props.show,
    (isOpen) => {
    if (isOpen) {
      categoryName.value = props.selectedCategoryTitle || ''
      categoryColor.value = props.selectedCategoryColor || ''
    }
  },
  { immediate: true }
  )

  const colorOptions = [
  { name: 'bg-cat-energy', value: 'var(--color-cat-energy)' },
  { name: 'bg-cat-love', value: 'var(--color-cat-love)' },
  { name: 'bg-cat-nature', value: 'var(--color-cat-nature)' },
  { name: 'bg-cat-spiritual', value: 'var(--color-cat-spiritual)' },
  { name: 'bg-cat-priority', value: 'var(--color-cat-priority)' },
  { name: 'bg-cat-knowledge', value: 'var(--color-cat-knowledge)' },
  { name: 'bg-cat-work', value: 'var(--color-cat-work)' },
  { name: 'bg-cat-neutral', value: 'var(--color-cat-neutral)' }
]
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'primaryAction', payload: { id?: string; title: string; color: string }): void
    (e: 'deleteCategory'): void
    (e: 'update:show', value: boolean): void
  }>()

const close = () => {
  emit('update:show', false)
  emit('close')
}
  
const primaryAction = () => {
  emit('primaryAction', {
    id: props.selectedCategoryId,
    title: categoryName.value,
    color: categoryColor.value 
  })
  close();
}  

const handleDeleteCategory = () => {
  emit('deleteCategory');
  close();
}


</script>
  
