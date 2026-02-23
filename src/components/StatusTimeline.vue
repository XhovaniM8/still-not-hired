<template>
  <div class="relative">
    <div v-if="history.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      No status history yet
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in history"
        :key="item.id"
        class="flex gap-4 group"
      >
        <!-- Timeline indicator -->
        <div class="flex flex-col items-center shrink-0">
          <div
            class="w-3 h-3 rounded-full"
            :class="getStatusDotColor(item.status)"
          ></div>
          <div
            v-if="index < history.length - 1"
            class="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"
          ></div>
        </div>

        <!-- Content: view mode -->
        <div v-if="editingId !== item.id" class="flex-1 pb-4 min-w-0">
          <div class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full shrink-0"
                :class="store.statusColors[item.status]"
              >
                {{ store.statusLabels[item.status] }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatDate(item.created_at) }}
              </span>
            </div>
            <div v-if="editable" class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                @click="startEdit(item)"
                class="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                title="Edit"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>
          <p v-if="item.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ item.notes }}
          </p>
        </div>

        <!-- Content: edit mode -->
        <div v-else class="flex-1 pb-4 min-w-0">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
            <div class="flex gap-2">
              <select
                v-model="editForm.status"
                class="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
              >
                <option v-for="s in allStatuses" :key="s" :value="s">
                  {{ store.statusLabels[s] }}
                </option>
              </select>
              <input
                v-model="editForm.created_at"
                type="datetime-local"
                class="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <textarea
              v-model="editForm.notes"
              placeholder="Notes (optional)"
              rows="2"
              class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 resize-none"
            ></textarea>
            <div class="flex gap-2 justify-end">
              <button
                @click="cancelEdit"
                class="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                @click="saveEdit(item.id)"
                class="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-700 dark:text-red-300 mb-2">
        Delete this "{{ store.statusLabels[deleteTarget.status] }}" entry?
      </p>
      <div class="flex gap-2">
        <button
          @click="deleteTarget = null"
          class="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          @click="doDelete(deleteTarget.id)"
          class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApplicationsStore } from '@/stores/applications'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['updated'])

const store = useApplicationsStore()

const editingId = ref(null)
const editForm = ref({ status: '', notes: '', created_at: '' })
const deleteTarget = ref(null)

const allStatuses = computed(() => [...store.progressionStatuses, ...store.terminalStatuses])

function getStatusDotColor(status) {
  const colors = {
    draft: 'bg-gray-400',
    applied: 'bg-blue-500',
    online_assessment: 'bg-purple-500',
    recruiter_screen: 'bg-indigo-500',
    technical_screen: 'bg-cyan-500',
    onsite_interview: 'bg-amber-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
    ghosted: 'bg-gray-400',
    dropped: 'bg-orange-500'
  }
  return colors[status] || 'bg-gray-400'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Convert "2024-01-15 10:30:00" → "2024-01-15T10:30" for datetime-local input
function toInputDate(dateString) {
  if (!dateString) return ''
  return dateString.replace(' ', 'T').slice(0, 16)
}

// Convert "2024-01-15T10:30" → "2024-01-15 10:30:00" for SQLite
function fromInputDate(inputVal) {
  if (!inputVal) return null
  return inputVal.replace('T', ' ') + ':00'
}

function startEdit(item) {
  deleteTarget.value = null
  editingId.value = item.id
  editForm.value = {
    status: item.status,
    notes: item.notes || '',
    created_at: toInputDate(item.created_at)
  }
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(id) {
  await store.updateStatusHistory(id, {
    status: editForm.value.status,
    notes: editForm.value.notes || null,
    created_at: fromInputDate(editForm.value.created_at)
  })
  editingId.value = null
  emit('updated')
}

function confirmDelete(item) {
  editingId.value = null
  deleteTarget.value = item
}

async function doDelete(id) {
  await store.deleteStatusHistory(id)
  deleteTarget.value = null
  emit('updated')
}
</script>
