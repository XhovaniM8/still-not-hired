const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Applications
  applications: {
    getAll: () => ipcRenderer.invoke('applications:getAll'),
    getById: (id) => ipcRenderer.invoke('applications:getById', id),
    create: (data) => ipcRenderer.invoke('applications:create', data),
    update: (id, data) => ipcRenderer.invoke('applications:update', id, data),
    delete: (id) => ipcRenderer.invoke('applications:delete', id)
  },

  // Status History
  status: {
    getHistory: (applicationId) => ipcRenderer.invoke('status:getHistory', applicationId),
    add: (applicationId, status, notes) => ipcRenderer.invoke('status:add', applicationId, status, notes)
  },

  // Resumes
  resumes: {
    getAll: () => ipcRenderer.invoke('resumes:getAll'),
    getById: (id) => ipcRenderer.invoke('resumes:getById', id),
    create: (data) => ipcRenderer.invoke('resumes:create', data),
    update: (id, data) => ipcRenderer.invoke('resumes:update', id, data),
    delete: (id) => ipcRenderer.invoke('resumes:delete', id)
  },

  // Job Descriptions
  jobDescriptions: {
    getByApplication: (applicationId) => ipcRenderer.invoke('jobDescriptions:getByApplication', applicationId),
    save: (applicationId, content, keywords) => ipcRenderer.invoke('jobDescriptions:save', applicationId, content, keywords)
  },

  // Analytics
  analytics: {
    getMetrics: () => ipcRenderer.invoke('analytics:getMetrics'),
    getSankeyData: () => ipcRenderer.invoke('analytics:getSankeyData'),
    getResumeMetrics: () => ipcRenderer.invoke('analytics:getResumeMetrics'),
    getApplicationsByPeriod: (period, startDate, endDate) => ipcRenderer.invoke('analytics:getApplicationsByPeriod', period, startDate, endDate),
    getCumulativeApplications: (period) => ipcRenderer.invoke('analytics:getCumulativeApplications', period),
    getVelocityMetrics: () => ipcRenderer.invoke('analytics:getVelocityMetrics'),
    getStageDuration: () => ipcRenderer.invoke('analytics:getStageDuration')
  },

  // Data Export
  data: {
    export: (format) => ipcRenderer.invoke('data:export', format)
  },

  // Contacts
  contacts: {
    getAll: () => ipcRenderer.invoke('contacts:getAll'),
    create: (data) => ipcRenderer.invoke('contacts:create', data),
    update: (id, data) => ipcRenderer.invoke('contacts:update', id, data),
    delete: (id) => ipcRenderer.invoke('contacts:delete', id),
    getByApplication: (applicationId) => ipcRenderer.invoke('contacts:getByApplication', applicationId),
    link: (applicationId, contactId) => ipcRenderer.invoke('contacts:link', applicationId, contactId),
    unlink: (applicationId, contactId) => ipcRenderer.invoke('contacts:unlink', applicationId, contactId)
  }
})
