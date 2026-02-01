<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Resumes</h1>
      <button
        @click="openEditor()"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        + Add Resume
      </button>
    </div>

    <!-- Resumes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="resume in store.resumes"
        :key="resume.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ resume.name }}</h3>
          <div class="flex gap-2">
            <button
              @click="openEditor(resume)"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(resume)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <p v-if="resume.description" class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {{ resume.description }}
        </p>

        <div class="mb-4">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Keywords</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in getKeywords(resume).slice(0, 8)"
              :key="keyword"
              class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs rounded-full"
            >
              {{ keyword }}
            </span>
            <span
              v-if="getKeywords(resume).length > 8"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ getKeywords(resume).length - 8 }} more
            </span>
          </div>
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400">
          Added {{ formatDate(resume.created_at) }}
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="store.resumes.length === 0"
        class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400"
      >
        No resumes yet. Add your first resume to start tracking which one performs best.
      </div>
    </div>

    <!-- Resume Editor Modal -->
    <ResumeEditor
      v-if="showEditor"
      :resume="selectedResume"
      @close="closeEditor"
      @saved="onSaved"
    />

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Resume?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{{ resumeToDelete?.name }}"? Applications using this resume will not be deleted.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="deleteResume"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import ResumeEditor from '@/components/ResumeEditor.vue'

const store = useApplicationsStore()

const showEditor = ref(false)
const selectedResume = ref(null)
const showDeleteConfirm = ref(false)
const resumeToDelete = ref(null)

function getKeywords(resume) {
  try {
    return JSON.parse(resume.keywords || '[]')
  } catch {
    return []
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function openEditor(resume = null) {
  selectedResume.value = resume
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
  selectedResume.value = null
}

function onSaved() {
  closeEditor()
}

function confirmDelete(resume) {
  resumeToDelete.value = resume
  showDeleteConfirm.value = true
}

async function deleteResume() {
  if (resumeToDelete.value) {
    await store.deleteResume(resumeToDelete.value.id)
    showDeleteConfirm.value = false
    resumeToDelete.value = null
  }
}

onMounted(() => {
  store.fetchResumes()
})
</script>
