<template>
    <div class="form-group mb-4">
      <label
        v-if="label"
        v-bind="$attrs"
        :for="id"
        class="block text-sm font-medium mb-1 text-light"
      >
        {{ label }}
      </label>
      <input
        v-model="model"
        :id="id"
        v-bind="$attrs"
        :readonly="readonly"
        :type="type"
        @blur="$emit('blur')"
        :placeholder="placeholder"
        :class="[
          'w-full px-3 py-2 bg-input text-primary',
          error ? 'border-error border-2' : 'border-border-neutral',
          readonly 
            ? 'border-0 bg-transparent opacity-70 cursor-default focus:outline-none focus:ring-0 pl-0'
            : 'border rounded-md focus:outline-none focus:ring-1 focus:ring-ring-neutral'
        ]"

      />
    </div>
  </template>
  
  <script setup lang="ts">
  
  const model = defineModel<string>()
  const emit = defineEmits(['blur'])
  
  const props = defineProps({
    id: String,
    label: String,
    placeholder: String,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    error: {
      type: Boolean,
      default: false,
    },
  })
  </script>
  