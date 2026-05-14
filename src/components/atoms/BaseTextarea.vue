<template>
  <div class="form-group mb-4">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium mb-1 text-light"
    >
      {{ label }}
    </label>
    <textarea
      v-model="model"
      :id="id"
      :placeholder="placeholder"
      :rows="rows"
      @blur="$emit('blur')"
      :class="[
        'w-full px-3 py-2 border rounded-md bg-input placeholder-light focus:outline-none focus:ring-1',
        error ? 'border-error' : 'border-border-neutral',
        'text-primary focus:ring-ring-neutral'
      ]"
    />
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['blur'])
const model = defineModel<string>()

const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 4,
  },
  error: {
    type: Boolean,
    default: false,
  },
})
</script>
