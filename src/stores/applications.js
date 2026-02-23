import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useApplicationsStore = defineStore('applications', () => {
  const applications = ref([])
  const resumes = ref([])
  const contacts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const statusLabels = {
    draft: 'Draft',
    applied: 'Applied',
    online_assessment: 'Online Assessment',
    recruiter_screen: 'Recruiter Screen',
    technical_screen: 'Technical Screen',
    onsite_interview: 'Onsite Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    ghosted: 'Ghosted',
    dropped: 'Dropped'
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    online_assessment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    recruiter_screen: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    technical_screen: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    onsite_interview: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    ghosted: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    dropped: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }

  const progressionStatuses = ['draft', 'applied', 'online_assessment', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'offer']
  const terminalStatuses = ['rejected', 'ghosted', 'dropped']

  // Computed
  const applicationCount = computed(() => applications.value.length)

  const statusDistribution = computed(() => {
    const dist = {}
    applications.value.forEach(app => {
      const status = app.current_status || 'draft'
      dist[status] = (dist[status] || 0) + 1
    })
    return dist
  })

  // Actions
  async function fetchApplications() {
    loading.value = true
    try {
      applications.value = await window.electronAPI.applications.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchResumes() {
    try {
      resumes.value = await window.electronAPI.resumes.getAll()
    } catch (e) {
      error.value = e.message
    }
  }

  async function createApplication(data) {
    const result = await window.electronAPI.applications.create(data)
    await fetchApplications()
    return result
  }

  async function updateApplication(id, data) {
    await window.electronAPI.applications.update(id, data)
    await fetchApplications()
  }

  async function deleteApplication(id) {
    await window.electronAPI.applications.delete(id)
    await fetchApplications()
  }

  async function addStatus(applicationId, status, notes) {
    await window.electronAPI.status.add(applicationId, status, notes)
    await fetchApplications()
  }

  async function getStatusHistory(applicationId) {
    return await window.electronAPI.status.getHistory(applicationId)
  }

  async function updateStatusHistory(id, data) {
    await window.electronAPI.status.update(id, data)
    await fetchApplications()
  }

  async function deleteStatusHistory(id) {
    await window.electronAPI.status.delete(id)
    await fetchApplications()
  }

  async function createResume(data) {
    const result = await window.electronAPI.resumes.create(data)
    await fetchResumes()
    return result
  }

  async function updateResume(id, data) {
    await window.electronAPI.resumes.update(id, data)
    await fetchResumes()
  }

  async function deleteResume(id) {
    await window.electronAPI.resumes.delete(id)
    await fetchResumes()
  }

  async function getJobDescription(applicationId) {
    return await window.electronAPI.jobDescriptions.getByApplication(applicationId)
  }

  async function saveJobDescription(applicationId, content, keywords) {
    return await window.electronAPI.jobDescriptions.save(applicationId, content, keywords)
  }

  async function getAnalytics() {
    return await window.electronAPI.analytics.getMetrics()
  }

  async function getSankeyData() {
    return await window.electronAPI.analytics.getSankeyData()
  }

  async function getResumeMetrics() {
    return await window.electronAPI.analytics.getResumeMetrics()
  }

  async function getApplicationsByPeriod(period, startDate, endDate) {
    return await window.electronAPI.analytics.getApplicationsByPeriod(period, startDate, endDate)
  }

  async function getCumulativeApplications(period) {
    return await window.electronAPI.analytics.getCumulativeApplications(period)
  }

  async function getVelocityMetrics() {
    return await window.electronAPI.analytics.getVelocityMetrics()
  }

  async function getStageDuration() {
    return await window.electronAPI.analytics.getStageDuration()
  }

  async function getApplicationsAtStage(stages) {
    return await window.electronAPI.analytics.getApplicationsAtStage(stages)
  }

  async function exportData(format) {
    return await window.electronAPI.data.export(format)
  }

  async function fetchContacts() {
    try {
      contacts.value = await window.electronAPI.contacts.getAll()
    } catch (e) {
      error.value = e.message
    }
  }

  async function createContact(data) {
    const result = await window.electronAPI.contacts.create(data)
    await fetchContacts()
    return result
  }

  async function updateContact(id, data) {
    await window.electronAPI.contacts.update(id, data)
    await fetchContacts()
  }

  async function deleteContact(id) {
    await window.electronAPI.contacts.delete(id)
    await fetchContacts()
  }

  async function getContactsForApplication(applicationId) {
    return await window.electronAPI.contacts.getByApplication(applicationId)
  }

  async function linkContact(applicationId, contactId) {
    return await window.electronAPI.contacts.link(applicationId, contactId)
  }

  async function unlinkContact(applicationId, contactId) {
    return await window.electronAPI.contacts.unlink(applicationId, contactId)
  }

  return {
    applications,
    resumes,
    contacts,
    loading,
    error,
    statusLabels,
    statusColors,
    progressionStatuses,
    terminalStatuses,
    applicationCount,
    statusDistribution,
    fetchApplications,
    fetchResumes,
    createApplication,
    updateApplication,
    deleteApplication,
    addStatus,
    getStatusHistory,
    updateStatusHistory,
    deleteStatusHistory,
    createResume,
    updateResume,
    deleteResume,
    getJobDescription,
    saveJobDescription,
    getAnalytics,
    getSankeyData,
    getResumeMetrics,
    getApplicationsByPeriod,
    getCumulativeApplications,
    getVelocityMetrics,
    getStageDuration,
    getApplicationsAtStage,
    exportData,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    getContactsForApplication,
    linkContact,
    unlinkContact
  }
})
