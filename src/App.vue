<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" :class="{ dark: isDark }">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-lg z-40 flex items-center px-4">
      <button
        @click="sidebarOpen = true"
        class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="ml-4 text-xl font-bold text-primary-600 dark:text-primary-400">Job Tracker</h1>
    </header>

    <!-- Backdrop -->
    <div
      v-if="sidebarOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-40"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
          <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400">Job Tracker</h1>
          <button
            @click="sidebarOpen = false"
            class="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="sidebarOpen = false"
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Dark Mode Toggle -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="toggleDark"
            class="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span v-if="isDark">Light Mode</span>
            <span v-else>Dark Mode</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="min-h-screen pt-16 lg:pt-0 lg:ml-64">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)
const sidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Applications', path: '/applications' },
  { name: 'Resumes', path: '/resumes' },
  { name: 'Contacts', path: '/contacts' },
  { name: 'Analytics', path: '/analytics' }
]

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('darkMode', isDark.value)
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  isDark.value = localStorage.getItem('darkMode') === 'true'
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
