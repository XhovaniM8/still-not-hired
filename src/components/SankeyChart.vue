<template>
  <div ref="container" class="w-full" :style="{ minHeight: containerHeight + 'px' }"></div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
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

const containerHeight = computed(() => {
  if (!props.data || !props.data.nodes) return 320
  const nodeCount = props.data.nodes.length
  return Math.max(320, 200 + nodeCount * 38)
})

function renderChart() {
  if (!container.value || !props.data) return

  const width = container.value.clientWidth
  if (width === 0) return

  d3.select(container.value).selectAll('*').remove()

  const { nodes, links } = props.data

  if (nodes.length === 0 || links.length === 0) {
    d3.select(container.value)
      .append('div')
      .attr('class', 'flex items-center justify-center h-full text-gray-500')
      .text('Not enough data to display flow diagram')
    return
  }

  const isDark = document.documentElement.classList.contains('dark')
  const labelColor = isDark ? '#E5E7EB' : '#374151'
  const labelSecondaryColor = isDark ? '#9CA3AF' : '#6B7280'

  const height = containerHeight.value
  const margin = { top: 20, right: 160, bottom: 20, left: 20 }

  const svg = d3.select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const availableHeight = height - margin.top - margin.bottom
  const nodeCount = nodes.length
  const dynamicPadding = Math.max(10, Math.min(24, Math.floor(availableHeight / (nodeCount + 1))))

  const sankeyGenerator = sankey()
    .nodeId(d => d.id)
    .nodeWidth(18)
    .nodePadding(dynamicPadding)
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])

  let sankeyNodes, sankeyLinks
  try {
    const result = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    })
    sankeyNodes = result.nodes
    sankeyLinks = result.links
  } catch (e) {
    console.error('Sankey layout error:', e)
    d3.select(container.value).selectAll('*').remove()
    d3.select(container.value)
      .append('div')
      .attr('class', 'flex items-center justify-center h-64 text-gray-500')
      .text('Unable to display flow diagram')
    return
  }

  // Create gradient defs for links
  const defs = svg.append('defs')
  sankeyLinks.forEach((link, i) => {
    const gradient = defs.append('linearGradient')
      .attr('id', `sg-${i}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', link.source.x1)
      .attr('x2', link.target.x0)

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', statusColors[link.source.id] || '#9CA3AF')
      .attr('stop-opacity', 0.7)

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', statusColors[link.target.id] || '#9CA3AF')
      .attr('stop-opacity', 0.5)
  })

  // Draw links with gradient
  svg.append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(sankeyLinks)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', (d, i) => `url(#sg-${i})`)
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('stroke-opacity', 0.5)
    .style('transition', 'stroke-opacity 0.2s')
    .on('mouseover', function() {
      d3.select(this).attr('stroke-opacity', 0.85)
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-opacity', 0.5)
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
    .attr('rx', 4)
    .attr('stroke', isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
    .attr('stroke-width', 1)
    .append('title')
    .text(d => `${d.name}: ${d.value}`)

  // Draw labels with collision detection
  const labelPositions = []

  svg.append('g')
    .selectAll('text')
    .data(sankeyNodes)
    .join('text')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8)
    .attr('y', d => {
      let targetY = (d.y1 + d.y0) / 2
      const isRightSide = d.x0 >= width / 2

      const sameLabels = labelPositions.filter(p => p.rightSide === isRightSide)
      for (const existing of sameLabels) {
        if (Math.abs(targetY - existing.y) < 15) {
          targetY = existing.y + 15
        }
      }

      labelPositions.push({ y: targetY, rightSide: isRightSide })
      return targetY
    })
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .style('font-size', '12px')
    .style('font-family', 'inherit')
    .style('fill', labelColor)
    .style('font-weight', '500')
    .text(d => `${d.name} (${d.value})`)
}

watch(() => props.data, () => {
  nextTick(renderChart)
}, { deep: true })

let resizeObserver = null

onMounted(async () => {
  await nextTick()
  renderChart()
  resizeObserver = new ResizeObserver(renderChart)
  if (container.value) resizeObserver.observe(container.value)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>
