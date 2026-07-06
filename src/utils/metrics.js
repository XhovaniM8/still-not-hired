// Pipeline order shared by the Sankey diagram and status pie chart, so both
// visualizations lay statuses out the same way.
export const STATUS_ORDER = [
  'draft', 'applied', 'online_assessment', 'recruiter_screen',
  'technical_screen', 'onsite_interview', 'offer',
  'rejected', 'ghosted', 'dropped'
]

export const STATUS_COLORS = {
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

/**
 * Round a count/total ratio to a percentage with 1 decimal place.
 * Whole-number rounding hides real events at low sample sizes (e.g. 1/263
 * rounds to 0% and makes a real offer look like it never happened).
 * @param {number} count
 * @param {number} total
 * @returns {number}
 */
export function calcRate(count, total) {
  if (!total) return 0
  return Math.round((count / total) * 1000) / 10
}

// Reported interview-to-application ratio for competitive technical fields
// (e.g. MS Computer Engineering grads) is commonly 1:100 to 1:40 applications.
// Offer rate isn't a useful per-resume benchmark the same way: most
// candidates only ever accept one offer, so it's a low, near-binary count
// that doesn't discriminate between resumes the way interview rate does.
export const INTERVIEW_RATE_BENCHMARK = { low: 1, high: 2.5 }

/**
 * Compare an interview rate against the industry benchmark range.
 * @param {number} rate - Interview rate as a percentage (e.g. 7.6 for 7.6%)
 * @returns {'below'|'within'|'above'}
 */
export function getInterviewRateBenchmarkStatus(rate) {
  if (rate < INTERVIEW_RATE_BENCHMARK.low) return 'below'
  if (rate > INTERVIEW_RATE_BENCHMARK.high) return 'above'
  return 'within'
}

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
      onsiteRate: 0,
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
  const responseRate = calcRate(responded, total)

  // Positive response = reached OA, screens, interviews, or offer
  const positiveResponseRate = calcRate(positiveResponses, total)

  // Auto-reject = rejected at applied stage
  const autoReject = rejectionsByStage.applied || 0
  const autoRejectRate = calcRate(autoReject, total)

  return {
    total,
    responseRate,
    positiveResponseRate,
    positiveResponses,
    oaRate: calcRate(oaReached, total),
    screenRate: calcRate(recruiterReached, total),
    interviewRate: calcRate(interviewsReached, total),
    interviewsReached,
    onsiteRate: calcRate(onsiteReached, total),
    offerRate: calcRate(offerReached, total),
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
  return resumeMetrics
    .map(rm => {
      const total = rm.total_applications || 0
      return {
        ...rm,
        offerRate: calcRate(rm.offers, total),
        interviewRate: calcRate(rm.interviews, total),
        rejectionRate: calcRate(rm.rejections, total)
      }
    })
    // Interview rate is the primary signal here, not offer rate: a candidate
    // typically accepts only one offer ever, so offer count is a near-binary
    // value that doesn't meaningfully distinguish one resume from another.
    .sort((a, b) => b.interviewRate - a.interviewRate)
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

  const nodes = STATUS_ORDER
    .filter(s => activeStatuses.has(s))
    .map(status => ({
      id: status,
      name: statusLabels[status] || status
    }))

  // Filter links: both nodes must exist AND the transition must go forward in the
  // status order (prevents cycles that crash d3-sankey)
  const nodeIds = new Set(nodes.map(n => n.id))
  const links = transitions
    .filter(t => {
      if (!nodeIds.has(t.from_status) || !nodeIds.has(t.to_status)) return false
      const fromIdx = STATUS_ORDER.indexOf(t.from_status)
      const toIdx = STATUS_ORDER.indexOf(t.to_status)
      return toIdx > fromIdx
    })
    .map(t => ({
      source: t.from_status,
      target: t.to_status,
      value: t.count
    }))

  return { nodes, links }
}

const PIE_STATUS_LABELS = {
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

/**
 * Format data for the status distribution pie/doughnut chart.
 * Slices are ordered by the applications pipeline (not object insertion
 * order) so the chart lines up with the Sankey diagram and funnel above it.
 * @param {object} statusDistribution - Status counts
 * @returns {object} - Chart.js formatted data
 */
export function formatPieChartData(statusDistribution) {
  const total = Object.values(statusDistribution).reduce((sum, c) => sum + c, 0)

  const labels = []
  const data = []
  const backgroundColor = []
  const percentages = []

  STATUS_ORDER.forEach(status => {
    const count = statusDistribution[status] || 0
    if (count > 0) {
      labels.push(PIE_STATUS_LABELS[status] || status)
      data.push(count)
      backgroundColor.push(STATUS_COLORS[status] || '#9CA3AF')
      percentages.push(calcRate(count, total))
    }
  })

  return {
    labels,
    total,
    percentages,
    datasets: [{
      data,
      backgroundColor,
      hoverOffset: 8
    }]
  }
}
