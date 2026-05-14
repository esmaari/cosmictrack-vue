<template>
    <div class="bg-surface">
      <h1 class="heading-3 text-app font-semibold mb-2 p-4">Steps</h1> 

   <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8">

      <div class="lg:col-span-2 flex flex-col items-center gap-4">
        <Spinner :show-spinner="showSpinner"></Spinner>

        <BaseButton class="z-10 self-end" variant="secondary" @click="openAddStepModal">+ Add Step</BaseButton>
        <JourneyTimeline @openEditStepModal="openEditStepModal" />
      </div>
      
    <div id="col-span-1">
    
    <div class="text-right mb-3 text-btn-link-dark hover:text-btn-link-dark-hover cursor-pointer flex flex-row-reverse"
          @click="goBackToJourneys">
          <a>Back to the journeys</a><BaseIcon icon="arrowLeft" class="w-6 h-6" />
        </div>


      <div id="journey-info-container" class="bg-app-darker p-4 lg:p-8 rounded-md">

        <h1 class="heading-3 text-on-dark">{{ journeyStore.currentJourney?.title }}</h1>
        <BaseDivider size="lg"></BaseDivider>


        <BaseTextarea    
          v-model="description" 
          label="Description of the journey"
          @blur="saveDescription"
          class="input-class"  
          placeholder="This cards are for my carreer..." 
          />

        <BaseDivider size="lg"></BaseDivider>

        <p class="text-on-dark">Categories you can add to this journey:</p>
        <div class="flex flex-wrap gap-2 mt-4 mb-16">
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
        </div>

        <div class="flex items-center justify-between mb-3">

          <div class="text-btn-link-dark hover:text-btn-link-dark-hover cursor-pointer flex flex-row-reverse items-center gap-2"
            @click="showDeleteJourneyConfirm = true">
            <span>Delete this journey</span><BaseIcon icon="delete" class="w-6 h-6" />
          </div>
        </div>

        <BaseDivider size="lg"></BaseDivider>
        <div class="flex justify-end">
          <BaseButton variant="tertiary" @click="openCategoryModal">+ Add new category</BaseButton>
        </div>

      </div>

      </div>

    </main>
      
    <!-- Modals -->
    <StepUpsertModal 
      v-model:show="showModal" 
      :journeyId="id"
      :mode="modalMode"
      :stepData="selectedStep"
      @close="showModal = false"  
      @submit="handleSubmitStep"
      @stepDeleted="handleStepDeleted"
    />

    <CategoryModal
      :show="showCategoryModal"
      action="add"
      primaryText="Save"
      secondaryText="Cancel"
      @primaryAction="saveNewCategory"
      @close="showCategoryModal = false"
    />

    <BaseModal
      :show="showDeleteJourneyConfirm"
      title="Delete Journey"
      text="Are you sure you want to delete this journey? This action cannot be undone."
      primaryText="Delete"
      secondaryText="Cancel"
      @primaryAction="handleDeleteJourney"
      @close="showDeleteJourneyConfirm = false"
    />

    </div>
  </template>
  
<script setup lang="ts">

  import { ref, onMounted, watch } from 'vue';
  import StepUpsertModal from '@/components/steps/StepUpsertModal.vue';
import BaseButton from '../components/atoms/BaseButton.vue';
import { useJourneyStore } from '@/stores/journey';
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/category';
import type { Step } from '@/stores/journey';
import JourneyTimeline from '@/components/journeys/JourneyTimeline.vue';
import BaseTextarea from '../components/atoms/BaseTextarea.vue';
import BaseDivider from '@/components/atoms/BaseDivider.vue';
import BaseIcon from '@/components/atoms/BaseIcon.vue';
import CategoryModal from '@/components/molecules/CategoryModal.vue';
import BaseModal from '@/components/molecules/BaseModal.vue';
import Spinner from '@/components/atoms/Spinner.vue';
import { useNotificationStore } from '@/stores/notification';
import { useRequireAuth } from '@/composables/useRequireAuth';
import { useRouter } from 'vue-router';


const auth = useAuthStore()
const journeyStore = useJourneyStore()
const categoryStore = useCategoryStore()
const notify = useNotificationStore()
const router = useRouter()
  const showCategoryModal = ref(false);
  const showSpinner = ref(false);
  const showDeleteJourneyConfirm = ref(false);

  const props = defineProps  <{
    id: string
  }>()

  const selectedCategories = ref<string[]>([]) // v-model ile bağlanır

  const showModal = ref(false);
  const modalMode = ref<'add' | 'edit-note'>('add')
  const selectedStep = ref<Step | null>(null)
  const description = ref('')

  function openEditStepModal(step: Step) {
    modalMode.value = 'edit-note'
    showModal.value = true
    selectedStep.value = step
  }

  function openAddStepModal() {
    modalMode.value = 'add'
    showModal.value = true
    selectedStep.value = null
  }

  const goBackToJourneys = () => {
    router.push('/my-journeys')
  }

  const handleDeleteJourney = async () => {
    if (!journeyStore.currentJourney?.id) return
    try {
      await journeyStore.deleteJourney(journeyStore.currentJourney.id)
      notify.success('Journey deleted')
      showDeleteJourneyConfirm.value = false
      // redirect to my journeys
      window.location.href = '/my-journeys'
    } catch (err: any) {
      notify.error(err?.message ?? 'Failed to delete journey')
    }
  }

  const handleCategoryToggle = async (catId: string) => {
    const isAlreadySelected = selectedCategories.value.includes(catId)

    try {
     if (isAlreadySelected) {
      await categoryStore.deleteCatFromJourney(catId, journeyStore.currentJourney!.id)
      selectedCategories.value = selectedCategories.value.filter(id => id !== catId)
    } else {
      await categoryStore.addCatToTheJourney(catId, journeyStore.currentJourney!.id)
      selectedCategories.value.push(catId)
    }
    } catch (err: any) {
      notify.error(err?.message ?? 'Failed to update category for journey')  
    }
  } 
  


  const openCategoryModal = async () => {
    showCategoryModal.value=true;
  };

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

  const handleSubmitStep = async(data: any) => {

    if (!auth.user?.id) {
      await auth.fetchSession()
    }

    if (!auth.user?.id) {
      console.warn('No user!')
      return
    }

    try {
      if (modalMode.value === 'edit-note') {
        await journeyStore.upsertStep(auth.user.id, props.id, {
          id: data.id,
          note: data.note
        });
        notify.success('Step updated')
      } else {
        await journeyStore.upsertStep(auth.user.id, props.id, data);
        notify.success('Step added')
      }

      await journeyStore.showJourneySteps(props.id); // update step list
      showModal.value = false;
      selectedStep.value = null;
    } catch (err: any) {
      notify.error(err?.message ?? 'Failed to save step')
    }
  }

  const handleStepDeleted = async (stepId: number) => {
    try {
      await journeyStore.showJourneySteps(props.id)
      showModal.value = false
      selectedStep.value = null
    } catch (err: any) {
      notify.error(err?.message ?? 'Failed to refresh steps')
    }
  }

  onMounted(async () => {
    showSpinner.value = true;
    try {
      const user = await useRequireAuth()
      // Journey and steps
      await journeyStore.fetchCurrentJourney(props.id)
      await journeyStore.showJourneySteps(props.id)

      // Categories
      if (categoryStore.categories.length === 0) {
        await categoryStore.fetchUserCategories(user.id)
      }

      // Selected categories for the journey
      if (!journeyStore.currentJourney) return

      const ids = await categoryStore.fetchCategoriesForJourney(journeyStore.currentJourney.id)
      selectedCategories.value = ids
     
    } catch (err: any) {
      notify.error(err?.message ?? 'Failed to load journey data')
     
    } finally {
      showSpinner.value = false;
    }

  })

  const saveDescription = async () => {
    const current = journeyStore.currentJourney;
    if (!current?.id) return;

    await journeyStore.updateJourneyDescription(description.value, Number(current.id))
    await journeyStore.fetchCurrentJourney(current.id)
  }

  watch(() => journeyStore.currentJourney, (val) => {
    if (val) {
      description.value = val.description
    }
  }, { immediate: true })

</script>
  
