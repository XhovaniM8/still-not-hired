<template>
  <Pie :data="data" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, PieController)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const value = context.raw
          const percentage = Math.round((value / total) * 100)
          return `${context.label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}))
</script>
