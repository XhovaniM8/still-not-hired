const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const database = require('./database')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // ✅ Correct dev vs production handling
  if (app.isPackaged) {
    // Production: load built Vite files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    // Development: load Vite dev server
    mainWindow.loadURL('http://localhost:5173')
    // Uncomment if you want DevTools in dev
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
}

app.whenReady().then(() => {
  database.initialize()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/* =======================
   IPC HANDLERS
   ======================= */

// Applications
ipcMain.handle('applications:getAll', async () => {
  try {
    return database.getAllApplications()
  } catch (error) {
    console.error('Failed to get applications:', error)
    throw new Error('Failed to fetch applications')
  }
})

ipcMain.handle('applications:getById', async (_, id) => {
  try {
    return database.getApplicationById(id)
  } catch (error) {
    console.error('Failed to get application:', error)
    throw new Error('Failed to fetch application')
  }
})

ipcMain.handle('applications:create', async (_, data) => {
  try {
    return database.createApplication(data)
  } catch (error) {
    console.error('Failed to create application:', error)
    throw new Error(error.message || 'Failed to create application')
  }
})

ipcMain.handle('applications:update', async (_, id, data) => {
  try {
    return database.updateApplication(id, data)
  } catch (error) {
    console.error('Failed to update application:', error)
    throw new Error(error.message || 'Failed to update application')
  }
})

ipcMain.handle('applications:delete', async (_, id) => {
  try {
    return database.deleteApplication(id)
  } catch (error) {
    console.error('Failed to delete application:', error)
    throw new Error('Failed to delete application')
  }
})

// Status history
ipcMain.handle('status:getHistory', (_, applicationId) => {
  return database.getStatusHistory(applicationId)
})

ipcMain.handle('status:add', (_, applicationId, status, notes) => {
  return database.addStatusHistory(applicationId, status, notes)
})

// Resumes
ipcMain.handle('resumes:getAll', async () => {
  try {
    return database.getAllResumes()
  } catch (error) {
    console.error('Failed to get resumes:', error)
    throw new Error('Failed to fetch resumes')
  }
})

ipcMain.handle('resumes:getById', async (_, id) => {
  try {
    return database.getResumeById(id)
  } catch (error) {
    console.error('Failed to get resume:', error)
    throw new Error('Failed to fetch resume')
  }
})

ipcMain.handle('resumes:create', async (_, data) => {
  try {
    return database.createResume(data)
  } catch (error) {
    console.error('Failed to create resume:', error)
    throw new Error(error.message || 'Failed to create resume')
  }
})

ipcMain.handle('resumes:update', async (_, id, data) => {
  try {
    return database.updateResume(id, data)
  } catch (error) {
    console.error('Failed to update resume:', error)
    throw new Error(error.message || 'Failed to update resume')
  }
})

ipcMain.handle('resumes:delete', async (_, id) => {
  try {
    return database.deleteResume(id)
  } catch (error) {
    console.error('Failed to delete resume:', error)
    throw new Error('Failed to delete resume')
  }
})

// Job descriptions
ipcMain.handle('jobDescriptions:getByApplication', (_, applicationId) => {
  return database.getJobDescription(applicationId)
})

ipcMain.handle('jobDescriptions:save', (_, applicationId, content, keywords) => {
  return database.saveJobDescription(applicationId, content, keywords)
})

// Analytics
ipcMain.handle('analytics:getMetrics', () => {
  return database.getAnalyticsMetrics()
})

ipcMain.handle('analytics:getSankeyData', () => {
  return database.getSankeyData()
})

ipcMain.handle('analytics:getResumeMetrics', () => {
  return database.getResumeMetrics()
})

// Export
ipcMain.handle('data:export', (_, format) => {
  return database.exportData(format)
})

