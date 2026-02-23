<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
      <button
        @click="showForm = true"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Add Contact
      </button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, email, or company..."
        class="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
      />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Role</th>
            <th class="px-4 py-3 text-left">Company</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Phone</th>
            <th class="px-4 py-3 text-left">Apps</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr v-if="filteredContacts.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              {{ search ? 'No contacts match your search.' : 'No contacts yet. Add your first contact!' }}
            </td>
          </tr>
          <tr
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ contact.name }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 text-xs rounded-full font-medium" :class="roleColor(contact.role)">
                {{ contact.role }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ contact.company || '—' }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ contact.email || '—' }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ contact.phone || '—' }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ contact.app_count }}</td>
            <td class="px-4 py-3 text-right">
              <button
                @click="editContact(contact)"
                class="text-primary-600 hover:text-primary-800 dark:text-primary-400 mr-3"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(contact)"
                class="text-red-600 hover:text-red-800 dark:text-red-400"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <ContactForm
      v-if="showForm"
      :contact="editingContact"
      @close="closeForm"
      @saved="onSaved"
    />

    <!-- Delete Confirmation -->
    <div v-if="deletingContact" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Contact</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>{{ deletingContact.name }}</strong>? This will also remove them from all linked applications.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="deletingContact = null"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="doDelete"
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
import ContactForm from '@/components/ContactForm.vue'

const store = useApplicationsStore()

const search = ref('')
const showForm = ref(false)
const editingContact = ref(null)
const deletingContact = ref(null)

const filteredContacts = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return store.contacts
  return store.contacts.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.email && c.email.toLowerCase().includes(q)) ||
    (c.company && c.company.toLowerCase().includes(q))
  )
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

function editContact(contact) {
  editingContact.value = contact
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingContact.value = null
}

async function onSaved() {
  closeForm()
  await store.fetchContacts()
}

function confirmDelete(contact) {
  deletingContact.value = contact
}

async function doDelete() {
  await store.deleteContact(deletingContact.value.id)
  deletingContact.value = null
}

onMounted(() => {
  store.fetchContacts()
})
</script>
