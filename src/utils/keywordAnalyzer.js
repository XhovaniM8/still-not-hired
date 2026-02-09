/**
 * TF-IDF based keyword analysis for learning from saved job descriptions
 * Identifies which keywords are most valuable across a corpus of jobs
 */

import { getCanonicalKeyword, getKeywordCategory, getKeywordWeight } from './keywords.js'

/**
 * Analyze all job descriptions to find important keywords using TF-IDF
 * Keywords that appear in many jobs but not ALL jobs are most valuable
 *
 * @param {Array<{keywords: string[]}>} jobs - Array of job objects with keywords
 * @returns {Array<{keyword: string, score: number, frequency: number, category: string, weight: number}>}
 */
export function analyzeJobKeywords(jobs) {
  if (!jobs || jobs.length === 0) {
    return []
  }

  const totalJobs = jobs.length

  // Count how many jobs contain each keyword (document frequency)
  const keywordDocFrequency = new Map()

  for (const job of jobs) {
    const keywords = Array.isArray(job.keywords)
      ? job.keywords
      : (typeof job.keywords === 'string' ? JSON.parse(job.keywords || '[]') : [])

    // Use canonical form to group synonyms together
    const uniqueCanonical = new Set(keywords.map(k => getCanonicalKeyword(k.toLowerCase())))

    for (const canonical of uniqueCanonical) {
      keywordDocFrequency.set(canonical, (keywordDocFrequency.get(canonical) || 0) + 1)
    }
  }

  // Calculate TF-IDF scores
  // IDF = log(totalDocs / docsContainingTerm)
  // We also factor in keyword weight to prioritize technical keywords
  const keywordScores = []

  for (const [keyword, docCount] of keywordDocFrequency.entries()) {
    const docFrequencyRatio = docCount / totalJobs

    // Filter keywords that appear in too few (<10%) or too many (>90%) jobs
    // Keywords in 10-90% of jobs are most discriminating
    if (docFrequencyRatio < 0.1 || docFrequencyRatio > 0.9) {
      continue
    }

    // TF-IDF score: higher for keywords that appear in a moderate number of jobs
    // The sweet spot is around 30-70% frequency
    const idf = Math.log(totalJobs / docCount)
    const weight = getKeywordWeight(keyword)
    const category = getKeywordCategory(keyword)

    // Final score combines IDF with keyword importance weight and frequency
    const score = idf * docCount * (weight / 2)

    keywordScores.push({
      keyword,
      score: Math.round(score * 100) / 100,
      frequency: docCount,
      frequencyPercent: Math.round(docFrequencyRatio * 100),
      category,
      weight
    })
  }

  // Sort by score descending
  keywordScores.sort((a, b) => b.score - a.score)

  // Return top 50 most important keywords
  return keywordScores.slice(0, 50)
}

/**
 * Get keyword frequency statistics across all jobs
 * @param {Array<{keywords: string[]}>} jobs - Array of job objects
 * @returns {object} - Statistics about keyword frequencies
 */
export function getKeywordStats(jobs) {
  if (!jobs || jobs.length === 0) {
    return {
      totalJobs: 0,
      totalUniqueKeywords: 0,
      mostCommon: [],
      byCategory: {}
    }
  }

  const totalJobs = jobs.length
  const keywordCounts = new Map()

  for (const job of jobs) {
    const keywords = Array.isArray(job.keywords)
      ? job.keywords
      : (typeof job.keywords === 'string' ? JSON.parse(job.keywords || '[]') : [])

    const uniqueCanonical = new Set(keywords.map(k => getCanonicalKeyword(k.toLowerCase())))

    for (const canonical of uniqueCanonical) {
      keywordCounts.set(canonical, (keywordCounts.get(canonical) || 0) + 1)
    }
  }

  // Get most common keywords
  const sortedByCount = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword, count]) => ({
      keyword,
      count,
      percent: Math.round((count / totalJobs) * 100),
      category: getKeywordCategory(keyword)
    }))

  // Group by category
  const byCategory = {
    core_technical: sortedByCount.filter(k => k.category === 'core_technical'),
    tools: sortedByCount.filter(k => k.category === 'tools'),
    concepts: sortedByCount.filter(k => k.category === 'concepts'),
    soft_skills: sortedByCount.filter(k => k.category === 'soft_skills')
  }

  return {
    totalJobs,
    totalUniqueKeywords: keywordCounts.size,
    mostCommon: sortedByCount.slice(0, 20),
    byCategory
  }
}

/**
 * Compare resume keywords against analyzed job corpus
 * Returns recommendations for keywords to add based on frequency in target jobs
 *
 * @param {string[]} resumeKeywords - Keywords in the resume
 * @param {Array<{keywords: string[]}>} targetJobs - Jobs to analyze
 * @returns {object} - Analysis with recommendations
 */
export function analyzeResumeGaps(resumeKeywords, targetJobs) {
  if (!targetJobs || targetJobs.length === 0) {
    return {
      coverage: 0,
      matchingKeywords: [],
      missingHighValue: [],
      recommendations: []
    }
  }

  const importantKeywords = analyzeJobKeywords(targetJobs)
  const resumeCanonical = new Set(resumeKeywords.map(k => getCanonicalKeyword(k.toLowerCase())))

  const matchingKeywords = []
  const missingHighValue = []

  for (const kw of importantKeywords) {
    if (resumeCanonical.has(kw.keyword)) {
      matchingKeywords.push(kw)
    } else {
      missingHighValue.push(kw)
    }
  }

  // Coverage: what percentage of important keywords does resume have?
  const coverage = importantKeywords.length > 0
    ? Math.round((matchingKeywords.length / importantKeywords.length) * 100)
    : 0

  // Recommendations: top missing keywords, prioritized by score and category
  const recommendations = missingHighValue
    .filter(kw => kw.category === 'core_technical' || kw.category === 'tools')
    .slice(0, 10)
    .map(kw => ({
      keyword: kw.keyword,
      reason: `Appears in ${kw.frequencyPercent}% of your saved jobs`,
      category: kw.category,
      priority: kw.category === 'core_technical' ? 'high' : 'medium'
    }))

  return {
    coverage,
    matchingKeywords,
    missingHighValue: missingHighValue.slice(0, 20),
    recommendations
  }
}

/**
 * Find jobs that best match a resume
 * @param {string[]} resumeKeywords - Keywords from resume
 * @param {Array<{id: string|number, keywords: string[]}>} jobs - Jobs to rank
 * @returns {Array<{job: object, matchScore: number, matchingKeywords: string[]}>}
 */
export function rankJobsByMatch(resumeKeywords, jobs) {
  const resumeCanonical = new Set(resumeKeywords.map(k => getCanonicalKeyword(k.toLowerCase())))

  const rankedJobs = jobs.map(job => {
    const jobKeywords = Array.isArray(job.keywords)
      ? job.keywords
      : (typeof job.keywords === 'string' ? JSON.parse(job.keywords || '[]') : [])

    const jobCanonical = jobKeywords.map(k => getCanonicalKeyword(k.toLowerCase()))
    const matchingKeywords = jobCanonical.filter(k => resumeCanonical.has(k))

    // Calculate weighted match score
    let matchedWeight = 0
    let totalWeight = 0
    for (const kw of jobCanonical) {
      const weight = getKeywordWeight(kw)
      totalWeight += weight
      if (resumeCanonical.has(kw)) {
        matchedWeight += weight
      }
    }

    const matchScore = totalWeight > 0
      ? Math.round((matchedWeight / totalWeight) * 100)
      : 0

    return {
      job,
      matchScore,
      matchingKeywords: [...new Set(matchingKeywords)],
      totalJobKeywords: jobCanonical.length
    }
  })

  // Sort by match score descending
  rankedJobs.sort((a, b) => b.matchScore - a.matchScore)

  return rankedJobs
}
