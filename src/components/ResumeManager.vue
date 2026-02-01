<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Your Resumes</h3>
      <button
        @click="$emit('add')"
        class="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
      >
        + Add Resume
      </button>
    </div>

    <div v-if="resumes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No resumes yet. Add your first resume to start tracking performance.
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="resume in resumes"
        :key="resume.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white">{{ resume.name }}</h4>
            <p v-if="resume.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ resume.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="$emit('edit', resume)"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', resume)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-if="getKeywords(resume).length > 0" class="mt-3">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in getKeywords(resume).slice(0, 6)"
              :key="keyword"
              class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs rounded-full"
            >
              {{ keyword }}
            </span>
            <span
              v-if="getKeywords(resume).length > 6"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ getKeywords(resume).length - 6 }} more
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resumes: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add', 'edit', 'delete'])

function getKeywords(resume) {
  try {
    return JSON.parse(resume.keywords || '[]')
  } catch {
    return []
  }
}
</script>
