<template>
    <div class="relative group inline-block">
      <slot name="trigger">
        <button class="btn">Hover me</button>
      </slot>
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
               bg-gray-800 text-white text-xs px-2 py-1 rounded 
               opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50"
      >
        {{ text }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    text: string
  }>()
  </script>
  