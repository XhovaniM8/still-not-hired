<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ application.title }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ application.company }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="store.statusColors[application.current_status]"
            >
              {{ store.statusLabels[application.current_status] }}
            </span>
            <button
              @click="$emit('edit', application)"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              Edit
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Quick Info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Applied</div>
            <div class="text-gray-900 dark:text-white">{{ formatDate(application.created_at) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ getRelativeTime(application.created_at) }}</div>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
            <div class="text-gray-900 dark:text-white">{{ formatDate(application.updated_at) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ getRelativeTime(application.updated_at) }}</div>
          </div>
          <div v-if="application.location">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Location</div>
            <div class="text-gray-900 dark:text-white">{{ application.location }}</div>
          </div>
          <div v-if="application.salary_min || application.salary_max">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Salary Range</div>
            <div class="text-gray-900 dark:text-white">
              {{ formatSalary(application.salary_min, application.salary_max) }}
            </div>
          </div>
          <div v-if="application.resume_name">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Resume</div>
            <div class="text-gray-900 dark:text-white">{{ application.resume_name }}</div>
          </div>
          <div v-if="application.posting_url">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Job Posting</div>
            <a
              :href="application.posting_url"
              target="_blank"
              class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              View posting
            </a>
          </div>
        </div>

        <!-- Status Update -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Update Status</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in availableStatuses"
              :key="status"
              @click="updateStatus(status)"
              :disabled="status === application.current_status"
              class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
              :class="status === application.current_status
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 cursor-default'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/50 text-gray-700 dark:text-gray-300'"
            >
              {{ store.statusLabels[status] }}
            </button>
          </div>
        </div>

        <!-- Status Timeline -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status History</h3>
          <StatusTimeline :history="statusHistory" />
        </div>

        <!-- Notes -->
        <div v-if="application.notes">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
          <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ application.notes }}</p>
        </div>

        <!-- Job Description Keywords -->
        <div v-if="jobKeywords.length > 0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Keywords</h3>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in jobKeywords"
              :key="keyword"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {{ keyword }}
            </span>
          </div>
        </div>

        <!-- Contacts -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Contacts</h3>
            <button
              @click="showLinkPanel = !showLinkPanel"
              class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              + Link Contact
            </button>
          </div>

          <!-- Linked contacts list -->
          <div v-if="linkedContacts.length > 0" class="space-y-2 mb-3">
            <div
              v-for="c in linkedContacts"
              :key="c.id"
              class="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 text-xs rounded-full font-medium" :class="roleColor(c.role)">
                  {{ c.role }}
                </span>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ c.name }}</div>
                  <div v-if="c.email || c.company" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ [c.company, c.email].filter(Boolean).join(' · ') }}
                  </div>
                </div>
              </div>
              <button
                @click="unlink(c.id)"
                class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs"
                title="Unlink"
              >
                ✕
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-gray-500 dark:text-gray-400 mb-3">No contacts linked yet.</p>

          <!-- Link panel -->
          <div v-if="showLinkPanel" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-2">
            <div class="flex gap-2">
              <select
                v-model="selectedContactId"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option :value="null">Select a contact...</option>
                <option
                  v-for="c in availableContacts"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.name }}{{ c.company ? ` (${c.company})` : '' }}
                </option>
              </select>
              <button
                @click="linkSelected"
                :disabled="!selectedContactId"
                class="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Link
              </button>
            </div>
            <button
              @click="showNewContactForm = true; showLinkPanel = false"
              class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              + Create new contact
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- New contact form modal (pre-linked to this application) -->
  <ContactForm
    v-if="showNewContactForm"
    :application-id="application.id"
    @close="showNewContactForm = false"
    @saved="onNewContactSaved"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import StatusTimeline from './StatusTimeline.vue'
import ContactForm from './ContactForm.vue'

const props = defineProps({
  application: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'statusUpdated'])

const store = useApplicationsStore()
const statusHistory = ref([])
const jobKeywords = ref([])
const linkedContacts = ref([])
const showLinkPanel = ref(false)
const showNewContactForm = ref(false)
const selectedContactId = ref(null)

const availableContacts = computed(() => {
  const linkedIds = new Set(linkedContacts.value.map(c => c.id))
  return store.contacts.filter(c => !linkedIds.has(c.id))
})

function roleColor(role) {
  const map = {
    'Recruiter': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Referral': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Hiring Manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'HR': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
  return map[role] || map['Other']
}

async function loadLinkedContacts() {
  linkedContacts.value = await store.getContactsForApplication(props.application.id)
}

async function linkSelected() {
  if (!selectedContactId.value) return
  await store.linkContact(props.application.id, selectedContactId.value)
  selectedContactId.value = null
  showLinkPanel.value = false
  await loadLinkedContacts()
}

async function unlink(contactId) {
  await store.unlinkContact(props.application.id, contactId)
  await loadLinkedContacts()
}

async function onNewContactSaved() {
  showNewContactForm.value = false
  await store.fetchContacts()
  await loadLinkedContacts()
}

const availableStatuses = computed(() => {
  return [...store.progressionStatuses, ...store.terminalStatuses]
})

function formatSalary(min, max) {
  const format = (n) => n ? `$${(n / 1000).toFixed(0)}k` : null
  const minF = format(min)
  const maxF = format(max)

  if (minF && maxF) return `${minF} - ${maxF}`
  if (minF) return `${minF}+`
  if (maxF) return `Up to ${maxF}`
  return '-'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins <= 1) return 'just now'
      return `${diffMins} mins ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  }
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

async function updateStatus(status) {
  if (status === props.application.current_status) return

  await store.addStatus(props.application.id, status, null)
  statusHistory.value = await store.getStatusHistory(props.application.id)
  emit('statusUpdated')
}

onMounted(async () => {
  statusHistory.value = await store.getStatusHistory(props.application.id)

  const jd = await store.getJobDescription(props.application.id)
  if (jd && jd.keywords) {
    try {
      jobKeywords.value = JSON.parse(jd.keywords)
    } catch {
      jobKeywords.value = []
    }
  }

  await store.fetchContacts()
  await loadLinkedContacts()
})
</script>
