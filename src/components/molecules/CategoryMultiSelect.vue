<template>
  <Combobox v-slot="{ open }" :key="reloadKey" multiple :modelValue="selected">

    <div class="mt-4">
    <p class="text-on-dark">Sorted by:</p>
    <CategoryActionChip 
      v-for="cat in selected"
      :key="cat.id + reloadKey"
      :label="cat.title"
      :color="cat.color"
      @edit="openEditModal(cat)"
      @toggle="toggleCategory(cat)"
    />
    </div>
    
    <ComboboxLabel class="block text-on-dark mt-6">Sort by categories:</ComboboxLabel>

    <div class="relative">
      <div class="flex flex-wrap gap-1 p-1 border rounded-md bg-white shadow-sm">
        <ComboboxInput
          class="w-full px-3 py-2 bg-input text-primary border-0 opacity-70 focus:outline-none focus:ring-0 cursor-text"
          placeholder="Search categories..."
          @input="query = $event.target.value"
        />
        <ComboboxButton class="absolute right-2 top-3">
           <BaseIcon
              :icon="open ? 'dropup' : 'dropdown'"
              class="w-6 h-6 cursor-pointer"
            />
        </ComboboxButton>
      </div>

      <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-input shadow-lg ring-1 ring-red ring-opacity-5 text-sm">
        <ComboboxOption
          v-for="category in filteredAllCategories"
          :key="category.id"
          :value="category"
          class="font-md border-b-1 border-border-neutral cursor-pointer flex select-none relative py-2 pl-2 pr-4 pt-3 hover:bg-surface"
          @click="toggleCategory(category)"
        >
          <CategoryLabelChip
            :label="category.title"
            :color="category.color"
          />
          <BaseIcon icon="check" class="w-4 h-4" v-if="selected.some((c) => c.id === category.id)" />
        </ComboboxOption>
      </ComboboxOptions>
      <span v-if="isOpen !== open" class="hidden">{{ setOpen(open) }}</span>
    </div>
  </Combobox>

    <CategoryModal
      :show="showCategoryModal"
      action="edit"
      primaryText="Save"
      secondaryText="Cancel"
      :selectedCategoryId="selectedCategoryId"
      :selectedCategoryTitle="selectedCategoryTitle"
      :selectedCategoryColor="selectedCategoryColor"
      @primaryAction="saveEditedCategory"
      @deleteCategory="handleDeleteCategory"
      @close="showCategoryModal = false"
    />


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import { useJourneyStore } from '@/stores/journey'
import { useNotificationStore } from '@/stores/notification'

import BaseIcon from '../atoms/BaseIcon.vue'
import BaseInput from '../atoms/BaseInput.vue'
import CategoryActionChip from '../atoms/CategoryActionChip.vue'
import CategoryLabelChip from '../atoms/CategoryLabelChip.vue'
import CategoryModal from './CategoryModal.vue'

import type { Category } from '@/stores/category'

import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  ComboboxLabel
} from '@headlessui/vue'


// PROPS ve EMITS
const props = defineProps<{
  selected: Category[]
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: Category[]): void
}>()

// STORE'lar
const auth = useAuthStore()
const categoryStore = useCategoryStore()
const journeyStore = useJourneyStore()
const notify = useNotificationStore()

// STATE
const reloadKey = ref(0)
const query = ref('')
const isOpen = ref(false)
const showEditModal = ref(false)
const showCategoryModal = ref(false)
const selectedCategoryTitle = ref('')
const selectedCategoryId = ref<string | undefined>(undefined)
const selectedCategoryColor = ref('')


const filteredAllCategories = computed(() => {
  return query.value === ''
    ? categoryStore.categories
    : categoryStore.categories.filter((cat) =>
        cat.title.toLowerCase().includes(query.value.toLowerCase())
      )
})

function toggleCategory(category: Category) {
  const exists = props.selected.find((c) => c.id === category.id)
  let updated: Category[]
  if (exists) {
    updated = props.selected.filter((c) => c.id !== category.id)
  } else {
    updated = [...props.selected, category]
  }

  emit('update:selected', updated)
}

function openEditModal(cat: Category) {
  selectedCategoryTitle.value = cat.title
  selectedCategoryId.value = cat.id
  selectedCategoryColor.value = cat.color 
  showCategoryModal.value = true

}

async function saveEditedCategory(payload: { id?: string; title: string; color: string }) {
  if (!auth.user?.id || !selectedCategoryTitle.value.trim()) return;

  const selectedIds = props.selected.map((cat) => cat.id)

  try {
    await categoryStore.upsertCategory(auth.user.id, payload.title, payload.id, payload.color)
    await categoryStore.fetchUserCategories(auth.user.id)
    notify.success('Category updated')
  } catch (err: any) {
    notify.error(err?.message ?? 'Failed to update category')
    return
  }

  const updatedSelected = categoryStore.categories.filter((cat) =>
    selectedIds.includes(cat.id)
  )

  // update and persist selected categories
  emit('update:selected', updatedSelected)
  localStorage.setItem('selectedCategories', JSON.stringify(updatedSelected))

  showEditModal.value = false
  selectedCategoryTitle.value = ''
  selectedCategoryId.value = undefined

  await journeyStore.fetchJourneys(auth.user.id)
  categoryStore.triggerCategoryRefetch()

}

const setOpen = (val: boolean) => {
  isOpen.value = val
  if (!val) {
    query.value = ''
  }
}


const handleDeleteCategory = async () => {
  if (!selectedCategoryId.value || !auth.user?.id) return

  try {
    await categoryStore.deleteCategory(selectedCategoryId.value, auth.user.id)
    await categoryStore.fetchUserCategories(auth.user.id)
    notify.success('Category deleted')
  } catch (err: any) {
    notify.error(err?.message ?? 'Failed to delete category')
    return
  }

  // Seçili kategorilerden silineni çıkar
  const selected = JSON.parse(localStorage.getItem('selectedCategories') || '[]')

  const filtered = selected.filter((cat: Category) => cat.id !== selectedCategoryId.value)

  emit('update:selected', filtered)

  localStorage.setItem('selectedCategories', JSON.stringify(filtered))
  showEditModal.value = false
  categoryStore.triggerCategoryRefetch()

}

</script>
