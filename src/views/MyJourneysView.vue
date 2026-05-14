<template>
  <h1 class="heading-3 text-on-dark font-semibold mb-2 p-4">My Journeys</h1>

  <main class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8">

    <div id="categories-container" class="bg-app-darker p-8 rounded-md">
    
      <div class="flex justify-between">
        <h4 class="heading-4 text-on-dark font-semibold mb-2">Categories</h4>
        <BaseButton @click="openCategoryModal">+ Add new</BaseButton>
      </div>

      <BaseDivider size="lg"></BaseDivider>
    
      <BaseButton 
          variant="tertiaryOnDark"
          icon="favorite"
          class="mb-6"
          @click="showOnlyFavorites = !showOnlyFavorites"
        >
          {{ showOnlyFavorites ? 'Show All' : 'Show Favorites Only' }}
      </BaseButton>

      <!-- ToDo: divider -->

      <CategoryMultiSelect
        :selected="selectedCategories"
        @update:selected="updateSelected"
      />

    </div>

    <div id="journeys-container" class="bg-app-darker p-8 rounded-md">
      <div class="flex justify-between ">
        <h2 class="heading-4 text-on-dark font-semibold mb-2">Journeys</h2>
        <div class="w-80">
          <CreateJourney />
        </div>
      </div>

      <BaseDivider size="lg"></BaseDivider>

      <Spinner :show-spinner="showSpinner"></Spinner>
      
      <JourneyCard
        v-for="journey in filteredJourneys"
        :key="journey.id"
        :id="journey.id"
        :heading="journey.title"
        :description="journey.description"
        :icon="journey.icon"
        :is-favorite="journey.isFavorite"
        :created-at="journey.created_at"
        :updated-at="journey.updated_at"
        :categories="categoryStore.getCategoriesForJourney(journey.id)"
        @toggleFavorite="(newValue) => handleToggleFavorite(journey.id, newValue)"
      />
    </div>

    <CategoryModal
      :show="showCategoryModal"
      action="add"
      primaryText="Save"
      secondaryText="Cancel"
      @primaryAction="saveNewCategory"
      @close="showCategoryModal = false"
    />

  
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useJourneyStore } from '@/stores/journey';
import { useCategoryStore } from '@/stores/category';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '../components/atoms/BaseButton.vue';
import CategoryMultiSelect from '@/components/molecules/CategoryMultiSelect.vue';
import type { Journey } from '@/stores/journey';
import type { Category } from '@/stores/category';
import JourneyCard from '@/components/molecules/JourneyCard.vue';
import CategoryModal from '@/components/molecules/CategoryModal.vue';
import BaseDivider from '@/components/atoms/BaseDivider.vue';
import Spinner from '@/components/atoms/Spinner.vue';
import CreateJourney from '@/components/journeys/CreateJourney.vue';
import { useNotificationStore } from '@/stores/notification';

const auth = useAuthStore();
const journeyStore = useJourneyStore();
const categoryStore = useCategoryStore();
const notify = useNotificationStore();
const showOnlyFavorites = ref(false);
const selectedCategories = ref<Category[]>([]);
const showCategoryModal = ref(false);
const showSpinner = ref(false);

const journeysWithCategories = ref<{
  journey: Journey;
  categories: Category[];
}[]>([]);

const buildJourneyCategoryList = async () => {
  if (!auth.user?.id) return
  const journeyIds = journeyStore.journeys.map((j) => j.id)

  try {
    await categoryStore.fetchCategoriesByJourneyIds(journeyIds)
  } catch (error) {
    console.error('Error fetching categories for journeys:', error)
    notify.error('Failed to load categories for journeys')
    return
  } 

  const enriched = await Promise.all(
    journeyStore.journeys.map(async (j) => {
      const cats = categoryStore.getCategoriesForJourney(j.id);
      return {
        journey: j,
        categories: cats,
      };
    })
  );
  journeysWithCategories.value = enriched;
}

const filteredJourneys = computed(() => {
  // Henüz veri yüklenmediyse, hiçbir şey gösterme
  if (journeysWithCategories.value.length === 0) {
    return []
  }

  let list = journeysWithCategories.value

  if (showOnlyFavorites.value) {
    list = list.filter(item => item.journey.isFavorite)
  }

  // Sadece kullanıcı bir kategori seçmişse filtre uygula
  if (selectedCategories.value.length > 0) {
    const selectedIds = selectedCategories.value.map(cat => cat.id)
    list = list.filter(item =>
      item.categories.some(cat => selectedIds.includes(cat.id))
    )
  }

  return list.map(item => item.journey)
})

function updateSelected(val: Category[]) {
  selectedCategories.value = val

  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedCategories', JSON.stringify(val))
  }
}

async function saveNewCategory(payload: { id?: string; title: string; color: string }) {
  if (!auth.user?.id) return; 

  try {
    await categoryStore.upsertCategory(auth.user.id, payload.title, payload.id, payload.color)
    await categoryStore.fetchUserCategories(auth.user.id)
    notify.success('Category saved')
  } catch (err: any) {
    notify.error(err?.message ?? 'Failed to save category')
  }
}

const handleToggleFavorite = async (journeyId: string, newValue: boolean) => {
  if (!auth.user?.id) return;

  try {
    await journeyStore.toggleFavorite(journeyId, auth.user.id, newValue);
    notify.success(newValue ? 'Journey marked as favorite' : 'Journey removed from favorites');
  } catch (err) {
    notify.error('Failed to update favorite status');
  }

};

const openCategoryModal = async () => {
  showCategoryModal.value=true;
};


onMounted(async () => {
  showSpinner.value = true;
  if (!auth.user?.id) await auth.fetchSession();
  if (!auth.user?.id) { showSpinner.value = false; return; }

  try {
    await journeyStore.fetchJourneys(auth.user.id);
    await categoryStore.fetchUserCategories(auth.user.id);
  } catch (err) {
    notify.error('Failed to load journeys or categories');
  } finally {
    showSpinner.value = false;
  }

  const saved = localStorage.getItem('selectedCategories');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        selectedCategories.value = parsed;
      }
    } catch (err) {
      console.error('Invalid JSON in selectedCategories');
    }
  }
});

watch(
  () => journeyStore.journeys,
  async () => {
    await buildJourneyCategoryList()
  },
  { immediate: true, deep: true }
)
</script>
