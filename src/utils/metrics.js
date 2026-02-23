/**
 * Calculate comprehensive analytics metrics from application data
 * @param {object[]} applications - Array of application objects
 * @param {object} analytics - Raw analytics from database
 * @returns {object} - Calculated metrics
 */
export function calculateMetrics(applications, analytics) {
  const total = analytics.total || 0

  if (total === 0) {
    return {
      total: 0,
      responseRate: 0,
      positiveResponseRate: 0,
      oaRate: 0,
      screenRate: 0,
      interviewRate: 0,
      offerRate: 0,
      autoRejectRate: 0
    }
  }

  const { stagesReached = {}, statusDistribution = {}, rejectionsByStage = {}, positiveResponses = 0, interviewsReached = 0 } = analytics

  // Calculate rates based on stages reached
  const oaReached = stagesReached.online_assessment || 0
  const recruiterReached = stagesReached.recruiter_screen || 0
  const technicalReached = stagesReached.technical_screen || 0
  const onsiteReached = stagesReached.onsite_interview || 0
  const offerReached = stagesReached.offer || 0

  // Any response = moved past applied OR received rejection
  const rejected = statusDistribution.rejected || 0
  const ghosted = statusDistribution.ghosted || 0
  const anyProgress = oaReached + recruiterReached + technicalReached + onsiteReached + offerReached

  // Response rate = anything except ghosted or still pending at applied stage
  const stillApplied = statusDistribution.applied || 0
  const responded = total - ghosted - stillApplied
  const responseRate = Math.round((responded / total) * 100)

  // Positive response = reached OA, screens, interviews, or offer
  const positiveResponseRate = total > 0 ? Math.round((positiveResponses / total) * 100) : 0

  // Auto-reject = rejected at applied stage
  const autoReject = rejectionsByStage.applied || 0
  const autoRejectRate = Math.round((autoReject / total) * 100)

  return {
    total,
    responseRate,
    positiveResponseRate,
    oaRate: Math.round((oaReached / total) * 100),
    screenRate: Math.round((recruiterReached / total) * 100),
    interviewRate: Math.round((interviewsReached / total) * 100),
    offerRate: Math.round((offerReached / total) * 100),
    autoRejectRate,
    stagesReached,
    statusDistribution,
    rejectionsByStage
  }
}

/**
 * Calculate metrics for each resume
 * @param {object[]} resumeMetrics - Raw resume metrics from database
 * @returns {object[]} - Processed resume metrics with rates
 */
export function calculateResumeMetrics(resumeMetrics) {
  return resumeMetrics.map(rm => {
    const total = rm.total_applications || 0
    return {
      ...rm,
      offerRate: total > 0 ? Math.round((rm.offers / total) * 100) : 0,
      interviewRate: total > 0 ? Math.round((rm.interviews / total) * 100) : 0,
      rejectionRate: total > 0 ? Math.round((rm.rejections / total) * 100) : 0
    }
  })
}

/**
 * Format Sankey data for D3 visualization
 * @param {object} sankeyData - Raw sankey data from database
 * @returns {object} - Formatted data for D3 sankey
 */
export function formatSankeyData(sankeyData) {
  const { transitions, terminal } = sankeyData

  const statusLabels = {
    draft: 'Draft',
    applied: 'Applied',
    online_assessment: 'OA',
    recruiter_screen: 'Recruiter Screen',
    technical_screen: 'Tech Screen',
    onsite_interview: 'Onsite',
    offer: 'Offer',
    rejected: 'Rejected',
    ghosted: 'Ghosted',
    dropped: 'Dropped'
  }

  // Build nodes only from statuses that appear in transitions (avoids isolated nodes)
  const activeStatuses = new Set()

  transitions.forEach(t => {
    activeStatuses.add(t.from_status)
    activeStatuses.add(t.to_status)
  })

  // Define order for positioning
  const statusOrder = [
    'draft', 'applied', 'online_assessment', 'recruiter_screen',
    'technical_screen', 'onsite_interview', 'offer',
    'rejected', 'ghosted', 'dropped'
  ]

  const nodes = statusOrder
    .filter(s => activeStatuses.has(s))
    .map(status => ({
      id: status,
      name: statusLabels[status] || status
    }))

  // Filter links using actual node IDs to prevent D3 errors with unknown statuses
  const nodeIds = new Set(nodes.map(n => n.id))
  const links = transitions
    .filter(t => nodeIds.has(t.from_status) && nodeIds.has(t.to_status))
    .map(t => ({
      source: t.from_status,
      target: t.to_status,
      value: t.count
    }))

  return { nodes, links }
}

/**
 * Format data for pie chart
 * @param {object} statusDistribution - Status counts
 * @returns {object} - Chart.js formatted data
 */
export function formatPieChartData(statusDistribution) {
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

  const statusLabels = {
    draft: 'Draft',
    applied: 'Applied',
    online_assessment: 'Online Assessment',
    recruiter_screen: 'Recruiter Screen',
    technical_screen: 'Technical Screen',
    onsite_interview: 'Onsite Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    ghosted: 'Ghosted',
    dropped: 'Dropped'
  }

  const labels = []
  const data = []
  const backgroundColor = []

  Object.entries(statusDistribution).forEach(([status, count]) => {
    if (count > 0) {
      labels.push(statusLabels[status] || status)
      data.push(count)
      backgroundColor.push(statusColors[status] || '#9CA3AF')
    }
  })

  return {
    labels,
    datasets: [{
      data,
      backgroundColor,
      borderWidth: 0
    }]
  }
}
