<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Resume' : 'Add Resume' }}
        </h2>
      </div>

      <form @submit.prevent="save" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resume Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g., Frontend Focus, Full Stack, Backend Heavy"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            v-model="form.description"
            type="text"
            placeholder="What does this resume emphasize?"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resume Content
            <span class="font-normal text-gray-500">(paste full text or LaTeX source)</span>
          </label>
          <textarea
            v-model="form.content"
            rows="10"
            placeholder="Paste your resume content here for keyword extraction..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          ></textarea>
          <button
            v-if="form.content"
            type="button"
            @click="extractKeywordsFromContent"
            class="mt-2 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            Extract keywords from content
          </button>
        </div>

        <!-- Keywords -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Keywords
          </label>
          <div class="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-h-[60px]">
            <span
              v-for="(keyword, index) in form.keywords"
              :key="keyword"
              class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm rounded-full"
            >
              {{ keyword }}
              <button
                type="button"
                @click="removeKeyword(index)"
                class="hover:text-primary-900 dark:hover:text-primary-100"
              >
                &times;
              </button>
            </span>
            <input
              v-model="newKeyword"
              @keydown.enter.prevent="addKeyword"
              @keydown.tab.prevent="addKeyword"
              type="text"
              placeholder="Type and press Enter to add..."
              class="flex-1 min-w-[150px] bg-transparent border-none outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter or Tab to add a keyword
          </div>
        </div>

        <!-- Suggested Keywords -->
        <div v-if="suggestedKeywords.length > 0">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggested keywords to add:
          </div>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="keyword in suggestedKeywords"
              :key="keyword"
              type="button"
              @click="form.keywords.push(keyword)"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300"
            >
              + {{ keyword }}
            </button>
          </div>
        </div>

        <!-- File Path -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File Path
            <span class="font-normal text-gray-500">(optional, for reference)</span>
          </label>
          <input
            v-model="form.file_path"
            type="text"
            placeholder="/path/to/resume.pdf"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { extractKeywords, getSuggestedKeywords } from '@/utils/keywords'

const props = defineProps({
  resume: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const store = useApplicationsStore()

const isEditing = computed(() => !!props.resume)

const form = ref({
  name: '',
  description: '',
  content: '',
  keywords: [],
  file_path: ''
})

const newKeyword = ref('')
const errorMessage = ref('')

const suggestedKeywords = computed(() => {
  return getSuggestedKeywords(form.value.keywords)
})

function addKeyword() {
  const keyword = newKeyword.value.trim().toLowerCase()
  if (keyword && !form.value.keywords.includes(keyword)) {
    form.value.keywords.push(keyword)
  }
  newKeyword.value = ''
}

function removeKeyword(index) {
  form.value.keywords.splice(index, 1)
}

function extractKeywordsFromContent() {
  const extracted = extractKeywords(form.value.content)
  const existing = new Set(form.value.keywords)
  extracted.forEach(k => {
    if (!existing.has(k)) {
      form.value.keywords.push(k)
    }
  })
}

async function save() {
  errorMessage.value = ''
  try {
    // Convert reactive object to plain object for IPC serialization
    const data = {
      name: form.value.name,
      description: form.value.description,
      content: form.value.content,
      keywords: [...form.value.keywords],
      file_path: form.value.file_path
    }
    if (isEditing.value) {
      await store.updateResume(props.resume.id, data)
    } else {
      await store.createResume(data)
    }
    emit('saved')
  } catch (error) {
    console.error('Failed to save resume:', error)
    errorMessage.value = error.message || 'Failed to save resume'
  }
}

onMounted(() => {
  if (props.resume) {
    form.value = {
      name: props.resume.name,
      description: props.resume.description || '',
      content: props.resume.content || '',
      keywords: JSON.parse(props.resume.keywords || '[]'),
      file_path: props.resume.file_path || ''
    }
  }
})
</script>
