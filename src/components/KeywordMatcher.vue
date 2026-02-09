<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Resume Match Scores</h3>
      <button
        v-if="matches.length > 0"
        @click="showDetails = !showDetails"
        class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
      >
        {{ showDetails ? 'Hide details' : 'Show details' }}
      </button>
    </div>

    <div v-if="matches.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      No resumes available for matching
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(match, index) in matches"
        :key="match.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 transition-colors cursor-pointer"
        :class="index === 0 ? 'border-green-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'"
        @click="$emit('select-resume', match.id)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">{{ match.name }}</span>
            <span
              v-if="index === 0"
              class="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full"
            >
              Best Match
            </span>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold" :class="getScoreColor(match.score)">
              {{ match.score }}%
            </span>
            <div v-if="match.simpleScore !== match.weightedScore" class="text-xs text-gray-500 dark:text-gray-400">
              ({{ match.simpleScore }}% unweighted)
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="getScoreBarColor(match.score)"
            :style="{ width: `${match.score}%` }"
          ></div>
        </div>

        <!-- Exact Matching Keywords -->
        <div v-if="match.matchingExact && match.matchingExact.length > 0" class="mb-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Exact matches ({{ match.matchingExact.length }}):
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="m in showDetails ? match.matchingExact : match.matchingExact.slice(0, 8)"
              :key="m.keyword"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="getCategoryBadgeClass(m.category, true)"
              :title="`Weight: ${m.weight} (${m.category})`"
            >
              {{ m.keyword }}
            </span>
            <span
              v-if="!showDetails && match.matchingExact.length > 8"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ match.matchingExact.length - 8 }} more
            </span>
          </div>
        </div>

        <!-- Synonym Matching Keywords -->
        <div v-if="showDetails && match.matchingSynonym && match.matchingSynonym.length > 0" class="mb-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Synonym matches ({{ match.matchingSynonym.length }}):
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="m in match.matchingSynonym"
              :key="m.jobKeyword"
              class="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              :title="`'${m.resumeKeyword}' in resume matches '${m.jobKeyword}' in job`"
            >
              {{ m.jobKeyword }} ~ {{ m.resumeKeyword }}
            </span>
          </div>
        </div>

        <!-- Missing Keywords (grouped by category when details shown) -->
        <div v-if="match.missing && match.missing.length > 0">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Missing ({{ match.missing.length }}):
          </div>

          <!-- Detailed view: grouped by category -->
          <div v-if="showDetails && match.missingByCategory" class="space-y-2">
            <div v-if="match.missingByCategory.core_technical.length > 0">
              <div class="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                Core Technical (high priority):
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="m in match.missingByCategory.core_technical"
                  :key="m.keyword"
                  class="px-2 py-0.5 bg-red-200 dark:bg-red-900/70 text-red-800 dark:text-red-200 text-xs rounded-full font-medium"
                >
                  {{ m.keyword }}
                </span>
              </div>
            </div>
            <div v-if="match.missingByCategory.tools.length > 0">
              <div class="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">
                Tools (medium priority):
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="m in match.missingByCategory.tools"
                  :key="m.keyword"
                  class="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                >
                  {{ m.keyword }}
                </span>
              </div>
            </div>
            <div v-if="match.missingByCategory.concepts.length > 0">
              <div class="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                Concepts:
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="m in match.missingByCategory.concepts"
                  :key="m.keyword"
                  class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs rounded-full"
                >
                  {{ m.keyword }}
                </span>
              </div>
            </div>
            <div v-if="match.missingByCategory.soft_skills.length > 0">
              <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Soft Skills (low priority):
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="m in match.missingByCategory.soft_skills"
                  :key="m.keyword"
                  class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  {{ m.keyword }}
                </span>
              </div>
            </div>
          </div>

          <!-- Simple view: flat list sorted by weight -->
          <div v-else class="flex flex-wrap gap-1">
            <span
              v-for="m in match.missing.slice(0, 8)"
              :key="m.keyword"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="getMissingBadgeClass(m.category)"
            >
              {{ m.keyword }}
            </span>
            <span
              v-if="match.missing.length > 8"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ match.missing.length - 8 }} more
            </span>
          </div>
        </div>
      </div>

      <!-- Recommendation -->
      <div v-if="matches.length > 0" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <span class="text-green-600 dark:text-green-400">→</span>
        <span>Recommendation: Use <strong class="text-gray-900 dark:text-white">{{ matches[0].name }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { extractKeywords, matchResumesToJob } from '@/utils/keywords'

const props = defineProps({
  jobDescription: {
    type: String,
    default: ''
  },
  resumes: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-resume'])

const showDetails = ref(false)

const matches = computed(() => {
  if (!props.jobDescription || props.resumes.length === 0) {
    return []
  }

  const jobKeywords = extractKeywords(props.jobDescription)
  return matchResumesToJob(props.resumes, jobKeywords)
})

function getScoreColor(score) {
  if (score >= 70) return 'text-green-600 dark:text-green-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function getScoreBarColor(score) {
  if (score >= 70) return 'bg-green-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

function getCategoryBadgeClass(category, isMatching) {
  if (isMatching) {
    switch (category) {
      case 'core_technical':
        return 'bg-green-200 dark:bg-green-900/70 text-green-800 dark:text-green-200 font-medium'
      case 'tools':
        return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      case 'concepts':
        return 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
      case 'soft_skills':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      default:
        return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
    }
  }
  return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
}

function getMissingBadgeClass(category) {
  switch (category) {
    case 'core_technical':
      return 'bg-red-200 dark:bg-red-900/70 text-red-800 dark:text-red-200 font-medium'
    case 'tools':
      return 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
    case 'concepts':
      return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
    case 'soft_skills':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    default:
      return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
  }
}
</script>
