<template>

  <form ref="formRef" @submit.prevent="handleRealSubmit">
    <BaseModal
      :show="props.show"
      :title="props.mode === 'edit-note' ? 'Edit Step' : 'Add New Step'"
      primaryText="Save"
      secondaryText="Cancel"
      @primaryAction="submitForm"
      @close="closeModal"
      :disablePrimary="props.mode === 'add' && (form.cards.length !== 3 || form.title.trim().length === 0)"
      >
      <template #default>
        <div class="modal">

          <div class="mt-4">   
          <BaseInput
            v-model="form.title"
            label="Your Question or Intention"
            placeholder="e.g. What should I focus on this month?"
            required
            :readonly="props.mode === 'edit-note'"
            :error="showTitleInputError"
          />

          <CardPicker 
            @confirmCards="handleCards"
            @titleIsMissing="titleIsMissing"
            :selectedCardIds="selectedCardIds"
            :question="form.title"
            :mode="props.mode"
          />

          <!-- Meaning Preview TODO: NLP -->
          <div class="my-6 text-left">
            <p class="block text-sm font-medium mb-1 text-light">Meaning</p>
            <div class="flex flex-wrap gap-2">
              <p v-if="form.meaning">{{ form.meaning }}</p>
              <p v-else class="text-light text-sm">AI-assisted interpretation coming soon.</p>
            </div>
          </div>

            <BaseTextarea v-model="form.note" label="Notes" placeholder="This was for my career life..."></BaseTextarea>
            <div 
              v-if="props.mode === 'edit-note'"
              class="text-right mb-3 text-btn-link-dark hover:text-btn-link-dark-hover cursor-pointer flex flex-row-reverse"
              @click="openDeleteConfirm"
            ><a>Delete this step from the journey</a><BaseIcon icon="delete" class="w-6 h-6" />
            </div>

          </div>
          
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :show="showDeleteConfirm"
      title="Delete Step"
      text="Are you sure you want to delete this step?"
      primaryText="Delete"
      secondaryText="Cancel"
      @primaryAction="handleDelete"
      @close="showDeleteConfirm = false"
      :disablePrimary="false"
    />
  </form>

</template>


<script setup lang="ts">

  import { reactive, watch, ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useJourneyStore } from '@/stores/journey';
  import CardPicker from './CardPicker.vue';
  import type { Step } from '@/stores/journey';
  import BaseModal from '@/components/molecules/BaseModal.vue';
  import BaseInput from '../atoms/BaseInput.vue';
  import BaseTextarea from '../atoms/BaseTextarea.vue';
  import BaseIcon from '../atoms/BaseIcon.vue';
  import { useNotificationStore } from '@/stores/notification';

  import { askAI } from '@/services/ai';


  // AI settings
  const aiLoading = ref(false)
  const aiError   = ref<string|null>(null)
  const aiText    = ref('')

  const currentCardNames = ref<string[]>([])
  const showTitleInputError = ref(false)

  const props = defineProps<{ 
    journeyId: string 
    show: Boolean
    mode: string
    stepData?: Step | null
  }>();

  const emit = defineEmits(['update:show', 'submit', 'stepDeleted'])

  const auth = useAuthStore()
  const journeyStore = useJourneyStore()
  const notify = useNotificationStore()
  const showDeleteConfirm = ref(false)

  const selectedCardIds = ref<number[] | undefined>(undefined)

  const formRef = ref<HTMLFormElement | null>(null)



  function submitForm() {
    formRef.value?.requestSubmit()
  }

  type Form = { title: string; cards: number[]; meaning: string; note: string }

  const initialForm = (): Form => ({
    title: '',
    cards: [],
    meaning: '',
    note: ''
  })

  const form = reactive<Form>(initialForm())

  const resetForm = () => {
    Object.assign(form, initialForm())  
  }

  function closeModal() {
    emit('update:show', false)
    resetForm()
  }

  function handleRealSubmit() {

    if (props.mode === 'edit-note' && props.stepData) {
      emit('submit', {
        id: props.stepData.id,
        note: form.note
      })
    } else {
      emit('submit', { ...form })
    }

    closeModal()
  }

  function titleIsMissing() {
    showTitleInputError.value = true
  }

  function handleCards(cardIds: number[], cardNames: string[]) {
    form.cards = cardIds              
    currentCardNames.value = cardNames // sadece UI için
    // getAiResponse({
    //   title: form.title,
    //   cardNames: cardNames,                
    // })
 
  }

  async function getAiResponse(data: { title: string; cardNames: string[] }) {
    aiLoading.value = true
    aiError.value = null

    try {
      aiText.value = await askAI(
        `Write one sentence about these Tarot cards: ${data.cardNames.join(', ')}. 
        The question is: ${data.title}. Use the language of the title. If it is in Turkish translate also the card names in to Turkish.`
      )
    } catch (e: any) {
      aiError.value = e?.message ?? String(e)
      console.error('AI error:', e)
    } finally {
      aiLoading.value = false
    }

    form.meaning = aiText.value ?? ''
  }

  function openDeleteConfirm() {
    if (!props.stepData?.id) return
    showDeleteConfirm.value = true
  }

  function handleDelete() {
    if (!props.stepData?.id) return;
      journeyStore.deleteStep(props.stepData.id)
        .then(() => notify.success('Step deleted'))
        .catch((err: any) => notify.error(err?.message ?? 'Failed to delete step'))
        .finally(() => {
          emit('stepDeleted', props.stepData?.id);
          closeModal(); // modalı kapat
          showDeleteConfirm.value = false
        })
  }

  watch(
    () => props.stepData,
    (step) => {
      const isEdit = props.mode === 'edit-note'

      form.title = isEdit && step?.title ? step.title : ''
      form.meaning = isEdit && step?.meaning ? step.meaning : ''
      form.note = isEdit && step?.note ? step.note : ''
      
      selectedCardIds.value = isEdit && step?.cards
        ? (typeof step.cards === 'string' ? JSON.parse(step.cards) : step.cards)
        : []

      // extractedKeywords'i tetikleyen cards verisini temizle:
      form.cards = isEdit && step?.cards
        ? (typeof step.cards === 'string' ? JSON.parse(step.cards) : step.cards)
        : []
    },
    { immediate: true }
  )

  watch(() => form.title, (v) => {
    if (v.trim()) showTitleInputError.value = false
  })

</script>
