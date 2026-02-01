<template>
  <div class="relative">
    <div v-if="history.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      No status history yet
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in history"
        :key="item.id"
        class="flex gap-4"
      >
        <!-- Timeline indicator -->
        <div class="flex flex-col items-center">
          <div
            class="w-3 h-3 rounded-full"
            :class="getStatusDotColor(item.status)"
          ></div>
          <div
            v-if="index < history.length - 1"
            class="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"
          ></div>
        </div>

        <!-- Content -->
        <div class="flex-1 pb-4">
          <div class="flex items-center gap-2">
            <span
              class="px-2 py-0.5 text-xs font-medium rounded-full"
              :class="store.statusColors[item.status]"
            >
              {{ store.statusLabels[item.status] }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(item.created_at) }}
            </span>
          </div>
          <p v-if="item.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ item.notes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApplicationsStore } from '@/stores/applications'

defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const store = useApplicationsStore()

function getStatusDotColor(status) {
  const colors = {
    draft: 'bg-gray-400',
    applied: 'bg-blue-500',
    online_assessment: 'bg-purple-500',
    recruiter_screen: 'bg-indigo-500',
    technical_screen: 'bg-cyan-500',
    onsite_interview: 'bg-amber-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
    ghosted: 'bg-gray-400',
    dropped: 'bg-orange-500'
  }
  return colors[status] || 'bg-gray-400'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
