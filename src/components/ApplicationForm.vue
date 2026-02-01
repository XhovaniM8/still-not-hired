<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Application' : 'Add Application' }}
        </h2>
      </div>

      <form @submit.prevent="save" class="p-6 space-y-4">
        <!-- Company & Title -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
            <input
              v-model="form.company"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="e.g., San Francisco, CA or Remote"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Salary Range -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Min</label>
            <input
              v-model.number="form.salary_min"
              type="number"
              placeholder="e.g., 100000"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Max</label>
            <input
              v-model.number="form.salary_max"
              type="number"
              placeholder="e.g., 150000"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <!-- Posting URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Posting URL</label>
          <input
            v-model="form.posting_url"
            type="url"
            placeholder="https://..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Resume Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume Used</label>
          <select
            v-model="form.resume_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option :value="null">No resume selected</option>
            <option v-for="resume in store.resumes" :key="resume.id" :value="resume.id">
              {{ resume.name }}
            </option>
          </select>
        </div>

        <!-- Initial Status (only for new applications) -->
        <div v-if="!isEditing">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Status</label>
          <select
            v-model="form.initial_status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="draft">Draft (for resume matching)</option>
            <option value="applied">Applied</option>
          </select>
        </div>

        <!-- Job Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Description
            <span class="font-normal text-gray-500">(for keyword matching)</span>
          </label>
          <textarea
            v-model="jobDescription"
            rows="4"
            placeholder="Paste the job description here to enable resume matching..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <!-- Keyword Matcher (if job description provided) -->
        <KeywordMatcher
          v-if="jobDescription && store.resumes.length > 0"
          :job-description="jobDescription"
          :resumes="store.resumes"
          @select-resume="form.resume_id = $event"
        />

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Any additional notes..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="saveError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-400">{{ saveError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            :disabled="saving"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { extractKeywords } from '@/utils/keywords'
import KeywordMatcher from './KeywordMatcher.vue'

const props = defineProps({
  application: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const store = useApplicationsStore()

const isEditing = computed(() => !!props.application)

const form = ref({
  company: '',
  title: '',
  location: '',
  salary_min: null,
  salary_max: null,
  posting_url: '',
  resume_id: null,
  notes: '',
  initial_status: 'draft'
})

const jobDescription = ref('')
const saveError = ref('')
const saving = ref(false)

async function save() {
  saveError.value = ''
  saving.value = true

  try {
    if (isEditing.value) {
      await store.updateApplication(props.application.id, { ...form.value })

      // Save job description if provided
      if (jobDescription.value) {
        const keywords = extractKeywords(jobDescription.value)
        await store.saveJobDescription(props.application.id, jobDescription.value, keywords)
      }
    } else {
      const result = await store.createApplication({ ...form.value })

      // Save job description if provided
      if (jobDescription.value && result?.id) {
        const keywords = extractKeywords(jobDescription.value)
        await store.saveJobDescription(result.id, jobDescription.value, keywords)
      }
    }

    emit('saved')
  } catch (error) {
    console.error('Failed to save application:', error)
    saveError.value = error.message || 'Failed to save application. Please try again.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (props.application) {
    form.value = {
      company: props.application.company,
      title: props.application.title,
      location: props.application.location || '',
      salary_min: props.application.salary_min,
      salary_max: props.application.salary_max,
      posting_url: props.application.posting_url || '',
      resume_id: props.application.resume_id,
      notes: props.application.notes || '',
      initial_status: 'applied'
    }

    // Load existing job description
    const jd = await store.getJobDescription(props.application.id)
    if (jd) {
      jobDescription.value = jd.content || ''
    }
  }
})
</script>
