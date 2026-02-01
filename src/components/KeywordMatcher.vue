<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Resume Match Scores</h3>

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
          <span class="text-lg font-bold" :class="getScoreColor(match.score)">
            {{ match.score }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="getScoreBarColor(match.score)"
            :style="{ width: `${match.score}%` }"
          ></div>
        </div>

        <!-- Matching Keywords -->
        <div v-if="match.matching.length > 0" class="mb-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Matching:</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in match.matching.slice(0, 10)"
              :key="keyword"
              class="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full"
            >
              {{ keyword }}
            </span>
            <span
              v-if="match.matching.length > 10"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ match.matching.length - 10 }} more
            </span>
          </div>
        </div>

        <!-- Missing Keywords -->
        <div v-if="match.missing.length > 0">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Missing:</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in match.missing.slice(0, 8)"
              :key="keyword"
              class="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-full"
            >
              {{ keyword }}
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
import { computed } from 'vue'
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
</script>
