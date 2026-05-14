<template>
  <component
    :is="resolvedIcon"
    v-bind="attrs"
    @click="$emit('click', $event)"
  />
</template>

<script setup lang="ts">
import {
  PlayIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  SparklesIcon,
  MoonIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  KeyIcon,
  GlobeAltIcon,
  FireIcon,
  CloudIcon,
  ChevronDoubleUpIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArchiveBoxXMarkIcon
} from '@heroicons/vue/24/outline'

import { HeartIcon as SolidHeartIcon } from '@heroicons/vue/24/solid'
import { PencilIcon } from '@heroicons/vue/24/solid'

import { computed } from 'vue'
import { useAttrs } from 'vue'
import type { Component } from 'vue'


const props = defineProps<{
  icon: string
}>()

const emit = defineEmits(['click'])

const attrs = useAttrs()

const resolvedIcon = computed(() => {
  const icons: Record<string, Component> = {

    play: PlayIcon,
    bars: Bars3Icon,
    bell: BellIcon,
    x: XMarkIcon,
    sparkles: SparklesIcon,
    moon: MoonIcon,
    star: StarIcon,
    eye: EyeIcon,
    heart: HeartIcon,
    favorite: SolidHeartIcon,
    key: KeyIcon,
    globe: GlobeAltIcon,
    fire: FireIcon,
    cloud: CloudIcon,
    up: ChevronDoubleUpIcon,
    arrowLeft: ArrowLeftIcon,
    bookmark: BookmarkIcon,
    edit: PencilIcon,
    check: CheckIcon,
    dropdown: ChevronDownIcon,
    dropup: ChevronUpIcon,
    delete: ArchiveBoxXMarkIcon
  }

  return icons[props.icon] || PlayIcon
})
</script>
