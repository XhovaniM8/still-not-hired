<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        + Add Application
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by company or title..."
        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Statuses</option>
        <option v-for="status in allStatuses" :key="status" :value="status">
          {{ store.statusLabels[status] }}
        </option>
      </select>
    </div>

    <!-- Applications List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table class="w-full min-w-[500px]">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell w-40">Location</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">Status</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell w-28">Resume</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Applied</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell w-24">Updated</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="app in filteredApplications"
            :key="app.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
            @click="viewApplication(app)"
          >
            <td class="px-3 py-3 text-gray-900 dark:text-white font-medium max-w-0">
              <div class="truncate" :title="app.company">{{ app.company }}</div>
            </td>
            <td class="px-3 py-3 text-gray-700 dark:text-gray-300 max-w-0">
              <div class="truncate" :title="app.title">{{ app.title }}</div>
            </td>
            <td class="px-3 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell text-sm whitespace-nowrap">
              {{ app.location || '-' }}
            </td>
            <td class="px-3 py-3 whitespace-nowrap">
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full"
                :class="store.statusColors[app.current_status]"
              >
                {{ store.statusLabels[app.current_status] }}
              </span>
            </td>
            <td class="px-3 py-3 text-gray-500 dark:text-gray-400 text-sm hidden lg:table-cell max-w-[7rem]">
              <div class="truncate">{{ app.resume_name || '-' }}</div>
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400 text-sm">
              {{ formatDate(app.created_at) }}
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400 text-sm hidden sm:table-cell">
              {{ formatDate(app.updated_at) }}
            </td>
            <td class="px-3 py-3 whitespace-nowrap">
              <button
                @click.stop="openModal(app)"
                class="text-primary-600 hover:text-primary-800 dark:text-primary-400 mr-2 text-sm"
              >
                Edit
              </button>
              <button
                @click.stop="confirmDelete(app)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredApplications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No applications found
      </div>
    </div>

    <!-- Application Form Modal -->
    <ApplicationForm
      v-if="showModal"
      :application="selectedApplication"
      @close="closeModal"
      @saved="onSaved"
    />

    <!-- Application Detail Modal -->
    <ApplicationDetail
      v-if="showDetailModal"
      :application="detailApplication"
      @close="showDetailModal = false"
      @edit="editFromDetail"
      @statusUpdated="onStatusUpdated"
    />

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Application?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete the application for {{ applicationToDelete?.title }} at {{ applicationToDelete?.company }}?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="deleteApplication"
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
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import ApplicationForm from '@/components/ApplicationForm.vue'
import ApplicationDetail from '@/components/ApplicationDetail.vue'

const store = useApplicationsStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showDetailModal = ref(false)
const selectedApplication = ref(null)
const detailApplication = ref(null)
const showDeleteConfirm = ref(false)
const applicationToDelete = ref(null)

const allStatuses = computed(() => [
  ...store.progressionStatuses,
  ...store.terminalStatuses
])

const filteredApplications = computed(() => {
  return store.applications.filter(app => {
    const matchesSearch = !searchQuery.value ||
      app.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.title.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !statusFilter.value || app.current_status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

function openModal(application = null) {
  selectedApplication.value = application
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedApplication.value = null
}

function onSaved() {
  closeModal()
}

function viewApplication(app) {
  detailApplication.value = app
  showDetailModal.value = true
}

function editFromDetail(app) {
  showDetailModal.value = false
  openModal(app)
}

async function onStatusUpdated() {
  await store.fetchApplications()
  // Update the detail view with fresh data from the store
  if (detailApplication.value) {
    detailApplication.value = store.applications.find(a => a.id === detailApplication.value.id)
  }
}

function confirmDelete(app) {
  applicationToDelete.value = app
  showDeleteConfirm.value = true
}

async function deleteApplication() {
  if (applicationToDelete.value) {
    await store.deleteApplication(applicationToDelete.value.id)
    showDeleteConfirm.value = false
    applicationToDelete.value = null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  store.fetchApplications()
  store.fetchResumes()
})
</script>
