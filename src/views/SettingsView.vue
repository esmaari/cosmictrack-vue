<template>
  <div>
    <h3 class="heading-3 text-surface font-semibold mb-2 p-4">Settings</h3>

    <main class="grid grid-cols-2 gap-6 p-8">
      <!-- Sol Menü -->
      <div class="bg-surface p-4">
        <ul>
          <li>
            <BaseButton
              variant="link"
              @click="activeTab = 'categories'"
            >
              Categories
            </BaseButton>
          </li>

          <li>
            <BaseButton
              variant="link"
              @click="activeTab = 'notifications'"
            >
              Notifications
            </BaseButton>
          </li>

          <li>
            <BaseButton
              variant="link"
              @click="activeTab = 'export'"
            >
              Export / Import
            </BaseButton>
          </li>
        </ul>
      </div>

      <!-- Sağ İçerik -->
      <div class="bg-surface p-4">
        <div v-if="activeTab === 'categories'">
          <div class="flex items-center justify-between mb-4">
            <h4 class="heading-4 text-primary">Your categories</h4>
            <BaseButton variant="secondary" @click="openAddCategory">
              + Add category
            </BaseButton>
          </div>

          <div class="flex flex-wrap gap-2">
            <CategoryActionChip
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :label="cat.title"
              :color="cat.color"
              :showToggle="false"
              @edit="openEditCategory(cat)"
            />
            <p v-if="!categoryStore.categories.length" class="text-sm text-light">
              No categories yet. Add one to get started.
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'notifications'">
          <p class="text-sm text-gray-500">Notification preferences (coming soon)</p>
        </div>

        <div v-else-if="activeTab === 'export'">
          <p class="text-sm text-gray-500">Data export/import (coming soon)</p>
        </div>
      </div>
    </main>

    <CategoryModal
      :show="showCategoryModal"
      :action="categoryModalAction"
      primaryText="Save"
      secondaryText="Cancel"
      :selectedCategoryId="selectedCategoryId"
      :selectedCategoryTitle="selectedCategoryTitle"
      :selectedCategoryColor="selectedCategoryColor"
      @primaryAction="handleSaveCategory"
      @deleteCategory="handleDeleteCategory"
      @close="showCategoryModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import CategoryActionChip from '@/components/atoms/CategoryActionChip.vue'
import CategoryModal from '@/components/molecules/CategoryModal.vue'
import { useCategoryStore, type Category } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useRequireAuth } from '@/composables/useRequireAuth'

const activeTab = ref<'categories' | 'notifications' | 'export'>('categories')
const categoryModalAction = ref<'add' | 'edit'>('add')
const showCategoryModal = ref(false)
const selectedCategoryId = ref<string | undefined>(undefined)
const selectedCategoryTitle = ref('')
const selectedCategoryColor = ref('')

const categoryStore = useCategoryStore()
const auth = useAuthStore()
const notify = useNotificationStore()

const openAddCategory = () => {
  categoryModalAction.value = 'add'
  selectedCategoryId.value = undefined
  selectedCategoryTitle.value = ''
  selectedCategoryColor.value = ''
  showCategoryModal.value = true
}

const openEditCategory = (cat: Category) => {
  categoryModalAction.value = 'edit'
  selectedCategoryId.value = cat.id
  selectedCategoryTitle.value = cat.title
  selectedCategoryColor.value = cat.color || ''
  showCategoryModal.value = true
}

const handleSaveCategory = async (payload: { id?: string; title: string; color: string }) => {
  if (!auth.user?.id) return
  try {
    await categoryStore.upsertCategory(auth.user.id, payload.title, payload.id, payload.color)
    await categoryStore.fetchUserCategories(auth.user.id)
    notify.success('Category saved')
  } catch (err: any) {
    notify.error(err?.message ?? 'Failed to save category')
    return
  } finally {
    showCategoryModal.value = false
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
  } finally {
    showCategoryModal.value = false
  }
}

onMounted(async () => {
  try {
    const user = await useRequireAuth()
    await categoryStore.fetchUserCategories(user.id)
  } catch (err: any) {
    // useRequireAuth already notifies; no-op
    if (err?.message !== 'AUTH_REQUIRED') {
      notify.error(err?.message ?? 'Failed to load categories')
    }
  }
})
</script>
