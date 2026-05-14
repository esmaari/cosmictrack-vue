<template>
  <Disclosure as="nav" class="bg-footer-heading" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-18 items-center justify-between">
        <!-- Mobile menu button -->
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-btn-primary-text hover:bg-btn-primary-hover focus:ring-2 focus:ring-btn-primary-text focus:outline-hidden focus:ring-inset"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <!-- Logo -->
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <RouterLink to="/">
              <img class="h-14 w-auto" src="/logos/Logo_CT_Badge.png" alt="CosmicTrack" />
            </RouterLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden sm:ml-6 sm:block py-2">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="px-3 py-2 text-xl font-semibold"
                :class="isActive(item.href) ? 'text-btn-link-light-pressed' : 'text-btn-link-light hover:text-btn-link-light-hover'" 

              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Right side (Login/Register or User dropdown) -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <template v-if="props.user === undefined">
            <!-- Loading or nothing -->
          </template>

          <RouterLink
            v-else-if="props.user === null"
            class="px-4 py-2 rounded-md text-white transition bg-solar-gold"
            to="/auth"
          >
            Login / Register
          </RouterLink>

          <Menu v-else as="div" class="relative ml-3">
            <div>
              <MenuButton
                class="relative flex rounded-full bg-btn-primary text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="size-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
              >
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/profile"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >
                    Your Profile
                  </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="/settings"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="logoutUser"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="block rounded-md px-3 py-2 text-base font-medium"
          :class="isActive(item.href) ? 'bg-btn-primary text-btn-primary-text' : 'text-btn-primary-text hover:bg-btn-primary-hover'"
        >
          {{ item.name }}
        </RouterLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const props = defineProps<{
  user: any
}>()

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'My Journeys', href: '/my-journeys' }
]

const isActive = (path: string) => route.path === path

const logoutUser = async () => {
  await auth.logout()
  router.push('/')
}
</script>
