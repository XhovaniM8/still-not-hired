<template>
  <div class="w-full">
    <!-- Controls -->
    <div class="flex flex-wrap gap-4 mb-4">
      <!-- Period Selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-400">Period:</label>
        <select
          v-model="selectedPeriod"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <!-- Chart Type Toggle -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-400">Chart:</label>
        <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            @click="chartType = 'bar'"
            :class="[
              'px-3 py-1.5 text-sm',
              chartType === 'bar'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            Bar
          </button>
          <button
            @click="chartType = 'line'"
            :class="[
              'px-3 py-1.5 text-sm',
              chartType === 'line'
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            Line
          </button>
        </div>
      </div>

      <!-- Cumulative Toggle -->
      <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
        <input
          type="checkbox"
          v-model="showCumulative"
          class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
        />
        Show cumulative
      </label>
    </div>

    <!-- Chart -->
    <div class="h-64">
      <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
      <Line v-else :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  fetchData: {
    type: Function,
    required: true
  }
})

const selectedPeriod = ref('weekly')
const chartType = ref('bar')
const showCumulative = ref(false)
const data = ref([])
const loading = ref(false)

// Detect dark mode
const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})

async function loadData() {
  loading.value = true
  try {
    data.value = await props.fetchData(selectedPeriod.value)
  } catch (e) {
    console.error('Failed to load time series data:', e)
    data.value = []
  } finally {
    loading.value = false
  }
}

const chartData = computed(() => {
  const labels = data.value.map(d => formatLabel(d.period))
  const counts = data.value.map(d => d.count)
  const cumulative = data.value.map(d => d.cumulative)

  const datasets = [
    {
      label: 'Applications',
      data: counts,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
      borderRadius: chartType.value === 'bar' ? 4 : 0,
      tension: 0.3
    }
  ]

  if (showCumulative.value) {
    datasets.push({
      label: 'Cumulative',
      data: cumulative,
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 2,
      type: 'line',
      yAxisID: 'y1',
      tension: 0.3,
      fill: true
    })
  }

  return { labels, datasets }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      display: showCumulative.value,
      labels: {
        color: isDark.value ? '#D1D5DB' : '#374151'
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? '#374151' : '#FFFFFF',
      titleColor: isDark.value ? '#F9FAFB' : '#111827',
      bodyColor: isDark.value ? '#D1D5DB' : '#374151',
      borderColor: isDark.value ? '#4B5563' : '#E5E7EB',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: isDark.value ? '#374151' : '#E5E7EB'
      },
      ticks: {
        color: isDark.value ? '#9CA3AF' : '#6B7280'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? '#374151' : '#E5E7EB'
      },
      ticks: {
        color: isDark.value ? '#9CA3AF' : '#6B7280',
        stepSize: 1
      }
    },
    ...(showCumulative.value ? {
      y1: {
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: isDark.value ? '#9CA3AF' : '#6B7280'
        }
      }
    } : {})
  }
}))

function formatLabel(period) {
  if (!period) return ''

  // Weekly format: 2024-W05
  if (period.includes('-W')) {
    const [year, week] = period.split('-W')
    return `W${week} '${year.slice(2)}`
  }

  // Monthly format: 2024-01
  if (/^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} '${year.slice(2)}`
  }

  // Daily format: 2024-01-15
  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const [y, m, d] = period.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Yearly format: 2024
  return period
}

watch(selectedPeriod, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>
