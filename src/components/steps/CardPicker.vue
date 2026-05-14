<template>
  <div id="cardpicker" class="text-center">
    <label class="text-app mb-4">
       {{ editModalTitle }} 
    </label>

    <!-- ADD MODE -->
    <div
      v-if="props.mode === 'add' && !cardsConfirmed"
      class="grid grid-cols-26 justify-center gap-2 px-6 py-4 max-w-[1000px] mx-auto"
    >
    
      <div
        v-for="(card, index) in allCards"
        :key="card.id"
        @click="toggleCard(index)"
        class="w-12 h-24 rounded-md overflow-hidden cursor-pointer transition-all duration-300 transform border bg-shadow-veil"
        :class="[
          card.selected
            ? 'border-solar-gold border-2 scale-105 z-20 shadow-lg'
            : 'border-cosmic-indigo z-10 hover:-translate-y-2 hover:shadow-xl hover:brightness-110',
          showFronts ? ' cursor-not-allowed pointer-events-none' : ''
        ]"

      >
        <img
          v-if="showFronts && card.selected"
          :src="card.image"
          :alt="card.name"
          class="w-full h-full cursor-not-allowed"
        />
        <img
          v-else
          src="/cards/back.png"
          alt="Back"
          class="w-full h-full object-cover opacity-60"
        />
      </div>
    </div>

    <!-- EDIT-NOTE MODE -->
    <div
      v-else-if="props.mode === 'edit-note' || cardsConfirmed"
      class="flex flex-wrap justify-center gap-2 mt-4"
    >
      <div
        v-for="card in selectedCards"
        :key="card.id"
        class="w-[110px] h-[200px] rounded-md overflow-hidden border border-solar-gold bg-shadow-veil"
      >
        <img
          :src="card.image"
          :alt="card.name"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Confirm -->
    <BaseButton 
      variant="secondary"
      type="button"
      v-show="props.mode === 'add' && !cardsConfirmed"
      :disabled="selectedCards.length !== 3"
      @click="confirmSelection()"
      >
      Confirm Cards
    </BaseButton>

  </div>
</template>

<script setup lang="ts">
import { tarotCards } from '@/data/tarotCards.ts'
import { ref, computed, watch } from 'vue';
import BaseButton from '../atoms/BaseButton.vue';

const showFronts = ref(false)
const cardsConfirmed = ref(false)
const selectedCards = computed(() => allCards.value.filter(c => c.selected))
const emit = defineEmits(['confirmCards', 'titleIsMissing'])
const editModalTitle = computed(() => { 
  return props.mode==='edit-note'
   ? 'Your selected cards'
   : 'Choose 3 cards'})

const props = defineProps<{
  selectedCardIds?: number[]
  mode: string
  question: string
}>()

const allCards = ref(
  [...tarotCards]
    .sort(() => 0.5 - Math.random()) // Shuffle
    .map(card => ({
      ...card,
      selected: false
    }))
)

function toggleCard(index: number) {
  if (showFronts.value) return; // Kartlar onaylandıysa tıklanamaz

  const card = allCards.value[index];
  if (card.selected) {
    card.selected = false;
  } else if (selectedCards.value.length < 3) {
    card.selected = true;
  }
}

function confirmSelection() {

  if (!props.question.trim()) {
    emit('titleIsMissing'); 
  } else {
    showFronts.value = true;
    const selectedIds = selectedCards.value.map(card => card.id);
    const selectedCardNames = selectedCards.value.map(card => card.name);
    emit('confirmCards', selectedIds, selectedCardNames); 
    cardsConfirmed.value = true;
  }


}

watch(
  () => props.selectedCardIds,
  (ids) => {
    if (ids?.length) {
      allCards.value.forEach(card => {
        card.selected = ids.includes(card.id)
      })
      showFronts.value = true
    }
  },
  { immediate: true } // first run
)

</script>

