<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ metrics.total }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Positive Response</div>
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{{ metrics.positiveResponseRate }}%</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">OA, screens, or interviews</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Interview Rate</div>
        <div class="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">{{ metrics.interviewRate }}%</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Offer Rate</div>
        <div class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ metrics.offerRate }}%</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Status Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
        <div v-if="Object.keys(metrics.statusDistribution || {}).length > 0" class="h-64">
          <PieChart :data="pieChartData" />
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-500">
          No applications yet
        </div>
      </div>

      <!-- Funnel Metrics -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Funnel</h2>
        <div class="space-y-4">
          <div v-for="stage in funnelStages" :key="stage.key">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">{{ stage.label }}</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ stage.rate }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="stage.color"
                :style="{ width: `${stage.rate}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Applications -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
        <router-link to="/applications" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
          View all →
        </router-link>
      </div>
      <div v-if="recentApplications.length > 0" class="space-y-3">
        <div
          v-for="app in recentApplications"
          :key="app.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{{ app.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ app.company }}</div>
          </div>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="store.statusColors[app.current_status]"
          >
            {{ store.statusLabels[app.current_status] }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        No applications yet. <router-link to="/applications" class="text-primary-600 hover:underline">Add your first application</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { calculateMetrics, formatPieChartData } from '@/utils/metrics'
import PieChart from '@/components/PieChart.vue'

const store = useApplicationsStore()
const analytics = ref({})

const metrics = computed(() => {
  return calculateMetrics(store.applications, analytics.value)
})

const pieChartData = computed(() => {
  return formatPieChartData(metrics.value.statusDistribution || {})
})

const funnelStages = computed(() => [
  { key: 'positive', label: 'Positive Response', rate: metrics.value.positiveResponseRate, color: 'bg-purple-500' },
  { key: 'oa', label: 'Online Assessment', rate: metrics.value.oaRate, color: 'bg-violet-500' },
  { key: 'screen', label: 'Recruiter Screen', rate: metrics.value.screenRate, color: 'bg-indigo-500' },
  { key: 'interview', label: 'Onsite Interview', rate: metrics.value.interviewRate, color: 'bg-amber-500' },
  { key: 'offer', label: 'Offer', rate: metrics.value.offerRate, color: 'bg-green-500' }
])

const recentApplications = computed(() => {
  return store.applications.slice(0, 5)
})

onMounted(async () => {
  await store.fetchApplications()
  analytics.value = await store.getAnalytics()
})
</script>
