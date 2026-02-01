<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" :class="{ dark: isDark }">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400">Job Tracker</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
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
    <main class="ml-64 min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Applications', path: '/applications' },
  { name: 'Resumes', path: '/resumes' },
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
