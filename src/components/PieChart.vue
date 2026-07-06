<template>
  <div class="relative h-full">
    <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'
import { calcRate } from '@/utils/metrics'
import { useDarkMode } from '@/composables/useDarkMode'

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const { isDark } = useDarkMode()

// vue-chartjs needs a distinct border color per slice so segments read as
// separate wedges instead of bleeding together; match the card background
// so it looks like a gap rather than an outline.
const chartData = computed(() => ({
  ...props.data,
  datasets: props.data.datasets.map(ds => ({
    ...ds,
    borderColor: isDark.value ? '#1f2937' : '#ffffff',
    borderWidth: 2
  }))
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12 },
        color: isDark.value ? '#d1d5db' : '#374151',
        generateLabels(chart) {
          const { labels, datasets } = chart.data
          const percentages = props.data.percentages || []
          return labels.map((label, i) => ({
            text: `${label} — ${datasets[0].data[i]} (${percentages[i] ?? 0}%)`,
            fillStyle: datasets[0].backgroundColor[i],
            strokeStyle: datasets[0].backgroundColor[i],
            hidden: false,
            index: i
          }))
        }
      }
    },
    tooltip: {
      callbacks: {
        label(context) {
          const percentages = props.data.percentages || []
          const percentage = percentages[context.dataIndex] ?? calcRate(context.raw, props.data.total || 1)
          return `${context.label}: ${context.raw} (${percentage}%)`
        }
      }
    }
  }
}))

// Draws the total application count in the center of the doughnut hole.
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const total = props.data.total
    if (!total) return

    const { ctx, chartArea } = chart
    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '600 22px system-ui, sans-serif'
    ctx.fillStyle = isDark.value ? '#f3f4f6' : '#111827'
    ctx.fillText(String(total), centerX, centerY - 10)

    ctx.font = '400 12px system-ui, sans-serif'
    ctx.fillStyle = isDark.value ? '#9ca3af' : '#6b7280'
    ctx.fillText(total === 1 ? 'application' : 'applications', centerX, centerY + 12)

    ctx.restore()
  }
}
</script>
