<template>
  <div v-if="Object.keys(durations).length > 0" class="space-y-3">
    <div v-for="stage in orderedStages" :key="stage.status">
      <div class="flex justify-between text-sm mb-1">
        <span class="text-gray-600 dark:text-gray-400">{{ stage.label }}</span>
        <span class="text-gray-900 dark:text-white font-medium">{{ stage.days }} days avg</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="getBarColor(stage.status)"
          :style="{ width: `${(stage.days / maxDays) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
  <div v-else class="text-gray-500 dark:text-gray-400 text-center py-8">
    No stage duration data available
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useApplicationsStore } from '@/stores/applications'

const props = defineProps({
  durations: {
    type: Object,
    required: true
  }
})

const store = useApplicationsStore()

const stageOrder = ['applied', 'online_assessment', 'recruiter_screen', 'technical_screen', 'onsite_interview']

const orderedStages = computed(() => {
  return stageOrder
    .filter(status => props.durations[status] !== undefined)
    .map(status => ({
      status,
      label: store.statusLabels[status] || status,
      days: props.durations[status]
    }))
})

const maxDays = computed(() => {
  const values = Object.values(props.durations)
  return values.length > 0 ? Math.max(...values, 1) : 1
})

function getBarColor(status) {
  const colors = {
    applied: 'bg-blue-500',
    online_assessment: 'bg-purple-500',
    recruiter_screen: 'bg-indigo-500',
    technical_screen: 'bg-cyan-500',
    onsite_interview: 'bg-amber-500'
  }
  return colors[status] || 'bg-gray-500'
}
</script>
