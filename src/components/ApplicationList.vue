<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="app in applications"
          :key="app.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
          @click="$emit('select', app)"
        >
          <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">
            {{ app.company }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
            {{ app.title }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="store.statusColors[app.current_status]"
            >
              {{ store.statusLabels[app.current_status] }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="text-gray-900 dark:text-white">{{ formatDate(app.created_at) }}</div>
            <div class="text-gray-500 dark:text-gray-400 text-xs">{{ getRelativeTime(app.created_at) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="text-gray-900 dark:text-white">{{ formatDate(app.updated_at) }}</div>
            <div class="text-gray-500 dark:text-gray-400 text-xs">{{ getRelativeTime(app.updated_at) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="applications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
      No applications found
    </div>
  </div>
</template>

<script setup>
import { useApplicationsStore } from '@/stores/applications'

defineProps({
  applications: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select'])

const store = useApplicationsStore()

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins <= 1) return 'just now'
      return `${diffMins} mins ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}
</script>
