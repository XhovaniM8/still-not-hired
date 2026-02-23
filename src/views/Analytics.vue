<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <div class="flex gap-2">
        <button
          @click="exportData('json')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Export JSON
        </button>
        <button
          @click="exportData('csv')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Total</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.total }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Response Rate</div>
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ metrics.responseRate }}%</div>
      </div>

      <!-- OA Rate with tooltip -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative cursor-default"
        @mouseenter="activeTooltip = 'oa'"
        @mouseleave="activeTooltip = null"
      >
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">OA Rate</div>
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ metrics.oaRate }}%</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ stageApps.oa.length }} apps</div>
        <div
          v-if="activeTooltip === 'oa' && stageApps.oa.length > 0"
          class="absolute z-50 top-full left-0 mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 pointer-events-none"
        >
          <div class="font-semibold mb-2 text-purple-300">Reached Online Assessment ({{ stageApps.oa.length }})</div>
          <div class="space-y-1">
            <div v-for="app in stageApps.oa" :key="app.id" class="flex gap-2 min-w-0">
              <span class="font-medium truncate">{{ app.company }}</span>
              <span class="text-gray-400 truncate shrink-0 max-w-[130px]">{{ app.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Screen Rate with tooltip -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative cursor-default"
        @mouseenter="activeTooltip = 'screen'"
        @mouseleave="activeTooltip = null"
      >
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Screen Rate</div>
        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ metrics.screenRate }}%</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ stageApps.screen.length }} apps</div>
        <div
          v-if="activeTooltip === 'screen' && stageApps.screen.length > 0"
          class="absolute z-50 top-full left-0 mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 pointer-events-none"
        >
          <div class="font-semibold mb-2 text-indigo-300">Reached Recruiter Screen ({{ stageApps.screen.length }})</div>
          <div class="space-y-1">
            <div v-for="app in stageApps.screen" :key="app.id" class="flex gap-2 min-w-0">
              <span class="font-medium truncate">{{ app.company }}</span>
              <span class="text-gray-400 truncate shrink-0 max-w-[130px]">{{ app.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interview Rate with tooltip -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative cursor-default"
        @mouseenter="activeTooltip = 'interview'"
        @mouseleave="activeTooltip = null"
      >
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Interview Rate</div>
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ metrics.interviewRate }}%</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ stageApps.interview.length }} apps</div>
        <div
          v-if="activeTooltip === 'interview' && stageApps.interview.length > 0"
          class="absolute z-50 top-full left-0 mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 pointer-events-none"
        >
          <div class="font-semibold mb-2 text-amber-300">Reached Interview Stage ({{ stageApps.interview.length }})</div>
          <div class="space-y-1">
            <div v-for="app in stageApps.interview" :key="app.id" class="flex gap-2 min-w-0">
              <span class="font-medium truncate">{{ app.company }}</span>
              <span class="text-gray-400 truncate shrink-0 max-w-[130px]">{{ app.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Offer Rate</div>
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ metrics.offerRate }}%</div>
      </div>
    </div>

    <!-- Velocity Metrics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Last 2 Weeks</div>
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ velocity.last2Weeks }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">applications</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Week-over-Week</div>
        <div class="text-2xl font-bold" :class="velocity.weekOverWeekChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
          {{ velocity.weekOverWeekChange >= 0 ? '+' : '' }}{{ velocity.weekOverWeekChange }}%
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">vs prev 2 weeks</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Per Week</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ velocity.avgPerWeek }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">all time</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Days Since Last</div>
        <div class="text-2xl font-bold" :class="velocity.daysSinceLastApp > 7 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'">
          {{ velocity.daysSinceLastApp !== null ? velocity.daysSinceLastApp : '-' }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">application</div>
      </div>
    </div>

    <!-- Application Activity Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Activity</h2>
      <TimeSeriesChart :fetch-data="fetchTimeSeriesData" />
    </div>

    <!-- Sankey Diagram -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 overflow-hidden">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Flow</h2>
      <SankeyChart v-if="sankeyData" :data="sankeyData" />
      <div v-else class="h-64 flex items-center justify-center text-gray-500">
        Add applications to see the flow diagram
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Rejection Analysis -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rejection Analysis</h2>
        <div v-if="Object.keys(metrics.rejectionsByStage || {}).length > 0" class="space-y-3">
          <div v-for="(count, stage) in metrics.rejectionsByStage" :key="stage">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Rejected at {{ store.statusLabels[stage] }}</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-red-500"
                :style="{ width: `${(count / metrics.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400 text-center py-8">
          No rejection data yet
        </div>
      </div>

      <!-- Auto-Reject Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Auto-Reject Rate (rejected at applied)</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ metrics.autoRejectRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-red-400"
                :style="{ width: `${metrics.autoRejectRate}%` }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Positive Response Rate</span>
              <span class="text-gray-900 dark:text-white font-medium">{{ metrics.positiveResponseRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-green-500"
                :style="{ width: `${metrics.positiveResponseRate}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage Duration -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Time in Each Stage</h2>
      <StageDuration :durations="stageDurations" />
    </div>

    <!-- Resume Performance -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Performance</h2>
      <div v-if="resumeMetrics.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Resume</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Applications</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Interviews</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Offers</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Offer Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="rm in resumeMetrics" :key="rm.id">
              <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ rm.name }}</td>
              <td class="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{{ rm.total_applications }}</td>
              <td class="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{{ rm.interviews }}</td>
              <td class="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{{ rm.offers }}</td>
              <td class="px-4 py-3 text-right">
                <span :class="rm.offerRate > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
                  {{ rm.offerRate }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-gray-500 dark:text-gray-400 text-center py-8">
        Add resumes and applications to see performance comparison
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { calculateMetrics, calculateResumeMetrics, formatSankeyData } from '@/utils/metrics'
import SankeyChart from '@/components/SankeyChart.vue'
import TimeSeriesChart from '@/components/TimeSeriesChart.vue'
import StageDuration from '@/components/StageDuration.vue'

const store = useApplicationsStore()

const metrics = ref({
  total: 0,
  responseRate: 0,
  positiveResponseRate: 0,
  oaRate: 0,
  screenRate: 0,
  interviewRate: 0,
  offerRate: 0,
  autoRejectRate: 0,
  rejectionsByStage: {}
})
const sankeyData = ref(null)
const resumeMetrics = ref([])
const velocity = ref({
  last2Weeks: 0,
  prev2Weeks: 0,
  weekOverWeekChange: 0,
  avgPerWeek: 0,
  daysSinceLastApp: null
})
const stageDurations = ref({})
const activeTooltip = ref(null)
const stageApps = ref({ oa: [], screen: [], interview: [] })

async function fetchTimeSeriesData(period) {
  return await store.getCumulativeApplications(period)
}

async function loadAnalytics() {
  const analytics = await store.getAnalytics()
  metrics.value = calculateMetrics(store.applications, analytics)

  const rawSankey = await store.getSankeyData()
  if (rawSankey.transitions.length > 0) {
    sankeyData.value = formatSankeyData(rawSankey)
  }

  const rawResumeMetrics = await store.getResumeMetrics()
  resumeMetrics.value = calculateResumeMetrics(rawResumeMetrics)

  // Load velocity metrics
  velocity.value = await store.getVelocityMetrics()

  // Load stage durations
  stageDurations.value = await store.getStageDuration()

  // Load apps per stage for tooltips
  const [oaApps, screenApps, interviewApps] = await Promise.all([
    store.getApplicationsAtStage(['online_assessment']),
    store.getApplicationsAtStage(['recruiter_screen']),
    store.getApplicationsAtStage(['recruiter_screen', 'technical_screen', 'onsite_interview'])
  ])
  stageApps.value = { oa: oaApps, screen: screenApps, interview: interviewApps }
}

async function exportData(format) {
  const data = await store.exportData(format)
  if (data) {
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `job-tracker-export.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }
}

onMounted(async () => {
  await store.fetchApplications()
  await loadAnalytics()
})
</script>
