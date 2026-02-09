<template>
  <div ref="container" class="w-full" :style="{ minHeight: containerHeight + 'px' }"></div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const container = ref(null)

const statusColors = {
  draft: '#9CA3AF',
  applied: '#3B82F6',
  online_assessment: '#8B5CF6',
  recruiter_screen: '#6366F1',
  technical_screen: '#06B6D4',
  onsite_interview: '#F59E0B',
  offer: '#10B981',
  rejected: '#EF4444',
  ghosted: '#6B7280',
  dropped: '#F97316'
}

// Dynamic height based on node count
const containerHeight = computed(() => {
  if (!props.data || !props.data.nodes) return 320
  const nodeCount = props.data.nodes.length
  // Minimum 320px, add 40px per node above 6
  return Math.max(320, 200 + nodeCount * 35)
})

function renderChart() {
  if (!container.value || !props.data) return

  // Clear previous chart
  d3.select(container.value).selectAll('*').remove()

  const { nodes, links } = props.data

  if (nodes.length === 0 || links.length === 0) {
    d3.select(container.value)
      .append('div')
      .attr('class', 'flex items-center justify-center h-full text-gray-500')
      .text('Not enough data to display flow diagram')
    return
  }

  const width = container.value.clientWidth
  const height = containerHeight.value
  const margin = { top: 20, right: 140, bottom: 20, left: 20 }

  const svg = d3.select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Dynamic node padding based on available space and node count
  const availableHeight = height - margin.top - margin.bottom
  const nodeCount = nodes.length
  const dynamicPadding = Math.max(8, Math.min(20, Math.floor(availableHeight / (nodeCount + 1))))

  const sankeyGenerator = sankey()
    .nodeId(d => d.id)
    .nodeWidth(15)
    .nodePadding(dynamicPadding)
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])

  const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
    nodes: nodes.map(d => ({ ...d })),
    links: links.map(d => ({ ...d }))
  })

  // Draw links
  svg.append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(sankeyLinks)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', d => {
      return statusColors[d.source.id] || '#9CA3AF'
    })
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('stroke-opacity', 0.4)
    .on('mouseover', function() {
      d3.select(this).attr('stroke-opacity', 0.7)
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-opacity', 0.4)
    })
    .append('title')
    .text(d => `${d.source.name} → ${d.target.name}: ${d.value}`)

  // Draw nodes
  svg.append('g')
    .selectAll('rect')
    .data(sankeyNodes)
    .join('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('width', d => d.x1 - d.x0)
    .attr('fill', d => statusColors[d.id] || '#9CA3AF')
    .attr('rx', 3)
    .append('title')
    .text(d => `${d.name}: ${d.value}`)

  // Draw labels with collision detection
  const labelPositions = []

  svg.append('g')
    .selectAll('text')
    .data(sankeyNodes)
    .join('text')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr('y', d => {
      let targetY = (d.y1 + d.y0) / 2
      const isRightSide = d.x0 >= width / 2

      // Check for collision with existing labels on same side
      const sameLabels = labelPositions.filter(p => p.rightSide === isRightSide)
      for (const existing of sameLabels) {
        if (Math.abs(targetY - existing.y) < 14) {
          // Adjust position to avoid overlap
          targetY = existing.y + 14
        }
      }

      labelPositions.push({ y: targetY, rightSide: isRightSide })
      return targetY
    })
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .attr('class', 'text-xs fill-current text-gray-700 dark:text-gray-300')
    .text(d => `${d.name} (${d.value})`)
}

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

onMounted(() => {
  renderChart()
  window.addEventListener('resize', renderChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', renderChart)
})
</script>
