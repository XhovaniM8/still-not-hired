<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Applications</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ metrics.total }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Positive Response</div>
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ metrics.positiveResponseRate }}%</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Interview Rate</div>
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ metrics.interviewRate }}%</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Offer Rate</div>
        <div class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ metrics.offerRate }}%</div>
      </div>
    </div>

    <!-- Funnel Visualization -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Funnel</h3>
      <div class="space-y-3">
        <div v-for="stage in funnelStages" :key="stage.key">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600 dark:text-gray-400">{{ stage.label }}</span>
            <span class="text-gray-900 dark:text-white font-medium">
              {{ stage.count }} ({{ stage.rate }}%)
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :class="stage.color"
              :style="{ width: `${stage.rate}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({
      total: 0,
      positiveResponseRate: 0,
      oaRate: 0,
      screenRate: 0,
      interviewRate: 0,
      offerRate: 0,
      stagesReached: {}
    })
  }
})

const funnelStages = computed(() => {
  const { stagesReached = {}, total } = props.metrics
  if (total === 0) return []

  return [
    { key: 'applied', label: 'Applied', count: total, rate: 100, color: 'bg-blue-500' },
    { key: 'oa', label: 'Online Assessment', count: stagesReached.online_assessment || 0, rate: props.metrics.oaRate, color: 'bg-purple-500' },
    { key: 'recruiter', label: 'Recruiter Screen', count: stagesReached.recruiter_screen || 0, rate: props.metrics.screenRate, color: 'bg-indigo-500' },
    { key: 'tech', label: 'Technical Screen', count: stagesReached.technical_screen || 0, rate: Math.round(((stagesReached.technical_screen || 0) / total) * 100), color: 'bg-cyan-500' },
    { key: 'onsite', label: 'Onsite Interview', count: stagesReached.onsite_interview || 0, rate: props.metrics.interviewRate, color: 'bg-amber-500' },
    { key: 'offer', label: 'Offer', count: stagesReached.offer || 0, rate: props.metrics.offerRate, color: 'bg-green-500' }
  ]
})
</script>
