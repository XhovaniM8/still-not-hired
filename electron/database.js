const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

let db

function initialize() {
  const dbPath = path.join(app.getPath('userData'), 'job-tracker.db')
  db = new Database(dbPath)

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      content TEXT,
      keywords TEXT DEFAULT '[]',
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      posting_url TEXT,
      resume_id INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS job_descriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL UNIQUE,
      content TEXT,
      keywords TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_status_history_app ON status_history(application_id);
    CREATE INDEX IF NOT EXISTS idx_applications_resume ON applications(resume_id);
  `)

  return db
}

function seedTestData() {
  // Create test resumes
  const resumeStmt = db.prepare(`
    INSERT INTO resumes (name, description, keywords)
    VALUES (?, ?, ?)
  `)

  const resume1 = resumeStmt.run('Frontend Focus', 'Emphasizes React, TypeScript, and UI/UX skills',
    JSON.stringify(['react', 'typescript', 'javascript', 'css', 'html', 'tailwind', 'testing', 'agile', 'git']))
  const resume2 = resumeStmt.run('Full Stack', 'Balanced frontend and backend experience',
    JSON.stringify(['react', 'node', 'nodejs', 'python', 'sql', 'postgresql', 'aws', 'docker', 'rest', 'git']))
  const resume3 = resumeStmt.run('Backend Heavy', 'Focus on APIs, databases, and infrastructure',
    JSON.stringify(['python', 'java', 'sql', 'postgresql', 'aws', 'docker', 'kubernetes', 'microservices', 'rest']))

  const companies = [
    { company: 'Google', title: 'Senior Frontend Engineer', location: 'Mountain View, CA', salary_min: 180000, salary_max: 250000 },
    { company: 'Meta', title: 'Software Engineer', location: 'Menlo Park, CA', salary_min: 170000, salary_max: 240000 },
    { company: 'Apple', title: 'Full Stack Developer', location: 'Cupertino, CA', salary_min: 175000, salary_max: 235000 },
    { company: 'Amazon', title: 'SDE II', location: 'Seattle, WA', salary_min: 160000, salary_max: 220000 },
    { company: 'Microsoft', title: 'Software Engineer II', location: 'Redmond, WA', salary_min: 155000, salary_max: 210000 },
    { company: 'Netflix', title: 'Senior Software Engineer', location: 'Los Gatos, CA', salary_min: 200000, salary_max: 300000 },
    { company: 'Stripe', title: 'Frontend Engineer', location: 'San Francisco, CA', salary_min: 170000, salary_max: 230000 },
    { company: 'Airbnb', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 165000, salary_max: 225000 },
    { company: 'Uber', title: 'Senior Software Engineer', location: 'San Francisco, CA', salary_min: 175000, salary_max: 245000 },
    { company: 'Lyft', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 150000, salary_max: 200000 },
    { company: 'Dropbox', title: 'Full Stack Engineer', location: 'San Francisco, CA', salary_min: 160000, salary_max: 220000 },
    { company: 'Slack', title: 'Frontend Developer', location: 'San Francisco, CA', salary_min: 155000, salary_max: 205000 },
    { company: 'Twitter', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 160000, salary_max: 215000 },
    { company: 'LinkedIn', title: 'Senior Software Engineer', location: 'Sunnyvale, CA', salary_min: 170000, salary_max: 235000 },
    { company: 'Shopify', title: 'Full Stack Developer', location: 'Remote', salary_min: 140000, salary_max: 190000 },
    { company: 'Coinbase', title: 'Software Engineer', location: 'Remote', salary_min: 165000, salary_max: 225000 },
    { company: 'Robinhood', title: 'Frontend Engineer', location: 'Menlo Park, CA', salary_min: 150000, salary_max: 200000 },
    { company: 'Plaid', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 155000, salary_max: 210000 },
    { company: 'Figma', title: 'Product Engineer', location: 'San Francisco, CA', salary_min: 165000, salary_max: 230000 },
    { company: 'Notion', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 160000, salary_max: 220000 },
    { company: 'Discord', title: 'Full Stack Engineer', location: 'San Francisco, CA', salary_min: 155000, salary_max: 215000 },
    { company: 'Zoom', title: 'Software Developer', location: 'San Jose, CA', salary_min: 145000, salary_max: 195000 },
    { company: 'Databricks', title: 'Software Engineer', location: 'San Francisco, CA', salary_min: 175000, salary_max: 250000 },
    { company: 'Snowflake', title: 'Senior Engineer', location: 'San Mateo, CA', salary_min: 180000, salary_max: 260000 },
    { company: 'Palantir', title: 'Forward Deployed Engineer', location: 'Palo Alto, CA', salary_min: 160000, salary_max: 220000 },
  ]

  const resumeIds = [resume1.lastInsertRowid, resume2.lastInsertRowid, resume3.lastInsertRowid]

  // Status progression scenarios
  const scenarios = [
    // Offers (3)
    ['applied', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'offer'],
    ['applied', 'online_assessment', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'offer'],
    ['applied', 'recruiter_screen', 'onsite_interview', 'offer'],
    // Onsite then rejected (4)
    ['applied', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'rejected'],
    ['applied', 'online_assessment', 'recruiter_screen', 'onsite_interview', 'rejected'],
    ['applied', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'rejected'],
    ['applied', 'recruiter_screen', 'onsite_interview', 'rejected'],
    // Technical screen rejected (3)
    ['applied', 'recruiter_screen', 'technical_screen', 'rejected'],
    ['applied', 'online_assessment', 'technical_screen', 'rejected'],
    ['applied', 'technical_screen', 'rejected'],
    // Recruiter screen rejected (3)
    ['applied', 'recruiter_screen', 'rejected'],
    ['applied', 'recruiter_screen', 'rejected'],
    ['applied', 'online_assessment', 'recruiter_screen', 'rejected'],
    // OA rejected (2)
    ['applied', 'online_assessment', 'rejected'],
    ['applied', 'online_assessment', 'rejected'],
    // Auto-rejected at applied (5)
    ['applied', 'rejected'],
    ['applied', 'rejected'],
    ['applied', 'rejected'],
    ['applied', 'rejected'],
    ['applied', 'rejected'],
    // Ghosted (3)
    ['applied', 'ghosted'],
    ['applied', 'recruiter_screen', 'ghosted'],
    ['applied', 'online_assessment', 'ghosted'],
    // Dropped by candidate (2)
    ['applied', 'recruiter_screen', 'dropped'],
    ['applied', 'recruiter_screen', 'technical_screen', 'dropped'],
  ]

  const appStmt = db.prepare(`
    INSERT INTO applications (company, title, location, salary_min, salary_max, resume_id, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `)

  const statusStmt = db.prepare(`
    INSERT INTO status_history (application_id, status, notes, created_at)
    VALUES (?, ?, ?, datetime('now', ?))
  `)

  companies.forEach((job, index) => {
    const scenario = scenarios[index % scenarios.length]
    const resumeId = resumeIds[index % 3]
    const daysAgo = Math.floor(Math.random() * 60) + 1

    const result = appStmt.run(
      job.company,
      job.title,
      job.location,
      job.salary_min,
      job.salary_max,
      resumeId,
      `Applied via company careers page`,
      `-${daysAgo} days`
    )

    const appId = result.lastInsertRowid

    // Add status history with progressive dates
    scenario.forEach((status, statusIndex) => {
      const statusDaysAgo = daysAgo - (statusIndex * 3)
      statusStmt.run(
        appId,
        status,
        status === 'rejected' ? 'Did not move forward' :
          status === 'offer' ? 'Verbal offer received' :
          status === 'ghosted' ? 'No response after 3 weeks' :
          status === 'dropped' ? 'Accepted another offer' : null,
        `-${Math.max(0, statusDaysAgo)} days`
      )
    })
  })

  console.log('Seeded test data: 3 resumes and 25 applications')
}

// Applications
function getAllApplications() {
  const stmt = db.prepare(`
    SELECT
      a.*,
      r.name as resume_name,
      (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) as current_status
    FROM applications a
    LEFT JOIN resumes r ON a.resume_id = r.id
    ORDER BY a.updated_at DESC
  `)
  return stmt.all()
}

function getApplicationById(id) {
  const stmt = db.prepare(`
    SELECT
      a.*,
      r.name as resume_name,
      (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) as current_status
    FROM applications a
    LEFT JOIN resumes r ON a.resume_id = r.id
    WHERE a.id = ?
  `)
  return stmt.get(id)
}

function createApplication(data) {
  // Validate required fields
  if (!data.company || !data.company.trim()) {
    throw new Error('Company name is required')
  }
  if (!data.title || !data.title.trim()) {
    throw new Error('Job title is required')
  }

  const stmt = db.prepare(`
    INSERT INTO applications (company, title, location, salary_min, salary_max, posting_url, resume_id, notes)
    VALUES (@company, @title, @location, @salary_min, @salary_max, @posting_url, @resume_id, @notes)
  `)
  const result = stmt.run({
    company: data.company.trim(),
    title: data.title.trim(),
    location: data.location?.trim() || null,
    salary_min: data.salary_min || null,
    salary_max: data.salary_max || null,
    posting_url: data.posting_url?.trim() || null,
    resume_id: data.resume_id || null,
    notes: data.notes?.trim() || null
  })

  // Add initial status
  const initialStatus = data.initial_status || 'draft'
  addStatusHistory(result.lastInsertRowid, initialStatus, 'Application created')

  return { id: result.lastInsertRowid }
}

function updateApplication(id, data) {
  const stmt = db.prepare(`
    UPDATE applications
    SET company = @company,
        title = @title,
        location = @location,
        salary_min = @salary_min,
        salary_max = @salary_max,
        posting_url = @posting_url,
        resume_id = @resume_id,
        notes = @notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `)
  stmt.run({
    id,
    company: data.company,
    title: data.title,
    location: data.location || null,
    salary_min: data.salary_min || null,
    salary_max: data.salary_max || null,
    posting_url: data.posting_url || null,
    resume_id: data.resume_id || null,
    notes: data.notes || null
  })
  return { success: true }
}

function deleteApplication(id) {
  const stmt = db.prepare('DELETE FROM applications WHERE id = ?')
  stmt.run(id)
  return { success: true }
}

// Status History
function getStatusHistory(applicationId) {
  const stmt = db.prepare(`
    SELECT * FROM status_history
    WHERE application_id = ?
    ORDER BY created_at ASC
  `)
  return stmt.all(applicationId)
}

function addStatusHistory(applicationId, status, notes) {
  const stmt = db.prepare(`
    INSERT INTO status_history (application_id, status, notes)
    VALUES (?, ?, ?)
  `)
  const result = stmt.run(applicationId, status, notes || null)

  // Update application's updated_at
  db.prepare('UPDATE applications SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(applicationId)

  return { id: result.lastInsertRowid }
}

// Resumes
function getAllResumes() {
  const stmt = db.prepare('SELECT * FROM resumes ORDER BY created_at DESC')
  return stmt.all()
}

function getResumeById(id) {
  const stmt = db.prepare('SELECT * FROM resumes WHERE id = ?')
  return stmt.get(id)
}

function createResume(data) {
  // Validate required fields
  if (!data.name || !data.name.trim()) {
    throw new Error('Resume name is required')
  }

  const stmt = db.prepare(`
    INSERT INTO resumes (name, description, content, keywords, file_path)
    VALUES (@name, @description, @content, @keywords, @file_path)
  `)
  const result = stmt.run({
    name: data.name.trim(),
    description: data.description || null,
    content: data.content || null,
    keywords: JSON.stringify(data.keywords || []),
    file_path: data.file_path || null
  })
  return { id: result.lastInsertRowid }
}

function updateResume(id, data) {
  const stmt = db.prepare(`
    UPDATE resumes
    SET name = @name,
        description = @description,
        content = @content,
        keywords = @keywords,
        file_path = @file_path
    WHERE id = @id
  `)
  stmt.run({
    id,
    name: data.name,
    description: data.description || null,
    content: data.content || null,
    keywords: JSON.stringify(data.keywords || []),
    file_path: data.file_path || null
  })
  return { success: true }
}

function deleteResume(id) {
  const stmt = db.prepare('DELETE FROM resumes WHERE id = ?')
  stmt.run(id)
  return { success: true }
}

// Job Descriptions
function getJobDescription(applicationId) {
  const stmt = db.prepare('SELECT * FROM job_descriptions WHERE application_id = ?')
  return stmt.get(applicationId)
}

function saveJobDescription(applicationId, content, keywords) {
  const existing = getJobDescription(applicationId)

  if (existing) {
    const stmt = db.prepare(`
      UPDATE job_descriptions
      SET content = ?, keywords = ?
      WHERE application_id = ?
    `)
    stmt.run(content, JSON.stringify(keywords || []), applicationId)
  } else {
    const stmt = db.prepare(`
      INSERT INTO job_descriptions (application_id, content, keywords)
      VALUES (?, ?, ?)
    `)
    stmt.run(applicationId, content, JSON.stringify(keywords || []))
  }
  return { success: true }
}

// Analytics
function getAnalyticsMetrics() {
  const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count

  // Get counts by current status
  const statusCounts = db.prepare(`
    SELECT
      (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) as status,
      COUNT(*) as count
    FROM applications a
    GROUP BY status
  `).all()

  const statusMap = {}
  statusCounts.forEach(s => {
    statusMap[s.status] = s.count
  })

  // Count applications that reached each stage
  const stageReached = db.prepare(`
    SELECT status, COUNT(DISTINCT application_id) as count
    FROM status_history
    GROUP BY status
  `).all()

  const reachedMap = {}
  stageReached.forEach(s => {
    reachedMap[s.status] = s.count
  })

  // Count unique applications with positive response (reached OA, screen, interview, or offer)
  const positiveResponses = db.prepare(`
    SELECT COUNT(DISTINCT application_id) as count
    FROM status_history
    WHERE status IN ('online_assessment', 'recruiter_screen', 'technical_screen', 'onsite_interview', 'offer')
  `).get().count

  // Get rejections by last non-terminal status
  const rejectionsByStage = db.prepare(`
    SELECT
      sh.status as rejected_at_stage,
      COUNT(*) as count
    FROM (
      SELECT
        application_id,
        (SELECT status FROM status_history sh2
         WHERE sh2.application_id = sh1.application_id
         AND sh2.status NOT IN ('rejected', 'ghosted', 'dropped')
         ORDER BY sh2.created_at DESC LIMIT 1) as status
      FROM status_history sh1
      WHERE sh1.status = 'rejected'
      AND sh1.id = (SELECT MAX(id) FROM status_history WHERE application_id = sh1.application_id)
    ) sh
    WHERE sh.status IS NOT NULL
    GROUP BY sh.status
  `).all()

  return {
    total: totalApps,
    statusDistribution: statusMap,
    stagesReached: reachedMap,
    positiveResponses,
    rejectionsByStage: rejectionsByStage.reduce((acc, r) => {
      acc[r.rejected_at_stage] = r.count
      return acc
    }, {})
  }
}

function getSankeyData() {
  // Get all status transitions
  const transitions = db.prepare(`
    SELECT
      sh1.status as from_status,
      sh2.status as to_status,
      COUNT(*) as count
    FROM status_history sh1
    JOIN status_history sh2 ON sh1.application_id = sh2.application_id
    WHERE sh2.id = (
      SELECT MIN(id) FROM status_history
      WHERE application_id = sh1.application_id AND id > sh1.id
    )
    GROUP BY sh1.status, sh2.status
  `).all()

  // Get applications stuck at each status (no further transitions)
  const terminal = db.prepare(`
    SELECT
      sh.status,
      COUNT(*) as count
    FROM status_history sh
    WHERE sh.id = (SELECT MAX(id) FROM status_history WHERE application_id = sh.application_id)
    GROUP BY sh.status
  `).all()

  return {
    transitions,
    terminal
  }
}

function getResumeMetrics() {
  const metrics = db.prepare(`
    SELECT
      r.id,
      r.name,
      COUNT(a.id) as total_applications,
      SUM(CASE WHEN (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) = 'offer' THEN 1 ELSE 0 END) as offers,
      SUM(CASE WHEN (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) IN ('onsite_interview', 'offer') THEN 1 ELSE 0 END) as interviews,
      SUM(CASE WHEN (SELECT status FROM status_history WHERE application_id = a.id ORDER BY created_at DESC LIMIT 1) = 'rejected' THEN 1 ELSE 0 END) as rejections
    FROM resumes r
    LEFT JOIN applications a ON a.resume_id = r.id
    GROUP BY r.id
  `).all()

  return metrics
}

// Get applications grouped by period (daily/weekly/monthly/yearly)
function getApplicationsByPeriod(period, startDate, endDate) {
  let dateFormat
  switch (period) {
    case 'daily':
      dateFormat = '%Y-%m-%d'
      break
    case 'weekly':
      dateFormat = '%Y-W%W'
      break
    case 'monthly':
      dateFormat = '%Y-%m'
      break
    case 'yearly':
      dateFormat = '%Y'
      break
    default:
      dateFormat = '%Y-%m-%d'
  }

  let query = `
    SELECT
      strftime('${dateFormat}', created_at) as period,
      COUNT(*) as count,
      MIN(created_at) as period_start
    FROM applications
  `

  const params = []
  if (startDate || endDate) {
    const conditions = []
    if (startDate) {
      conditions.push('created_at >= ?')
      params.push(startDate)
    }
    if (endDate) {
      conditions.push('created_at <= ?')
      params.push(endDate)
    }
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ` GROUP BY strftime('${dateFormat}', created_at) ORDER BY period ASC`

  const stmt = db.prepare(query)
  return stmt.all(...params)
}

// Get cumulative applications over time
function getCumulativeApplications(period) {
  const data = getApplicationsByPeriod(period)

  let cumulative = 0
  return data.map(row => {
    cumulative += row.count
    return {
      ...row,
      cumulative
    }
  })
}

// Get velocity metrics (apps per week, week-over-week change, days since last app)
function getVelocityMetrics() {
  // Apps in last 2 weeks
  const last2Weeks = db.prepare(`
    SELECT COUNT(*) as count FROM applications
    WHERE created_at >= datetime('now', '-14 days')
  `).get().count

  // Apps in the 2 weeks before that (for comparison)
  const prev2Weeks = db.prepare(`
    SELECT COUNT(*) as count FROM applications
    WHERE created_at >= datetime('now', '-28 days')
    AND created_at < datetime('now', '-14 days')
  `).get().count

  // Week-over-week change percentage
  const weekOverWeekChange = prev2Weeks > 0
    ? Math.round(((last2Weeks - prev2Weeks) / prev2Weeks) * 100)
    : (last2Weeks > 0 ? 100 : 0)

  // Average apps per week (all time)
  const firstApp = db.prepare(`
    SELECT MIN(created_at) as first_date FROM applications
  `).get()

  let avgPerWeek = 0
  if (firstApp.first_date) {
    const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get().count
    const firstDate = new Date(firstApp.first_date)
    const now = new Date()
    const weeks = Math.max(1, Math.ceil((now - firstDate) / (7 * 24 * 60 * 60 * 1000)))
    avgPerWeek = Math.round((totalApps / weeks) * 10) / 10
  }

  // Days since last application
  const lastApp = db.prepare(`
    SELECT MAX(created_at) as last_date FROM applications
  `).get()

  let daysSinceLastApp = null
  if (lastApp.last_date) {
    const lastDate = new Date(lastApp.last_date)
    const now = new Date()
    daysSinceLastApp = Math.floor((now - lastDate) / (24 * 60 * 60 * 1000))
  }

  return {
    last2Weeks,
    prev2Weeks,
    weekOverWeekChange,
    avgPerWeek,
    daysSinceLastApp
  }
}

// Get average days spent in each stage
function getAverageStageDuration() {
  // Get all status transitions with timestamps
  const transitions = db.prepare(`
    SELECT
      sh1.application_id,
      sh1.status as from_status,
      sh1.created_at as from_time,
      sh2.status as to_status,
      sh2.created_at as to_time,
      ROUND(JULIANDAY(sh2.created_at) - JULIANDAY(sh1.created_at), 1) as days
    FROM status_history sh1
    JOIN status_history sh2 ON sh1.application_id = sh2.application_id
    WHERE sh2.id = (
      SELECT MIN(id) FROM status_history
      WHERE application_id = sh1.application_id AND id > sh1.id
    )
  `).all()

  // Calculate average duration per stage
  const stageDurations = {}
  const stageCounts = {}

  transitions.forEach(t => {
    if (!stageDurations[t.from_status]) {
      stageDurations[t.from_status] = 0
      stageCounts[t.from_status] = 0
    }
    stageDurations[t.from_status] += t.days
    stageCounts[t.from_status]++
  })

  const averages = {}
  Object.keys(stageDurations).forEach(status => {
    averages[status] = Math.round((stageDurations[status] / stageCounts[status]) * 10) / 10
  })

  return averages
}

function exportData(format) {
  const applications = getAllApplications()
  const resumes = getAllResumes()

  // Get full status history for each application
  const fullData = applications.map(app => ({
    ...app,
    status_history: getStatusHistory(app.id),
    job_description: getJobDescription(app.id)
  }))

  if (format === 'json') {
    return JSON.stringify({ applications: fullData, resumes }, null, 2)
  } else if (format === 'csv') {
    // Simple CSV export for applications
    const headers = ['id', 'company', 'title', 'location', 'salary_min', 'salary_max', 'current_status', 'resume_name', 'created_at']
    const rows = fullData.map(app =>
      headers.map(h => {
        const val = app[h]
        if (val === null || val === undefined) return ''
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    )
    return [headers.join(','), ...rows].join('\n')
  }

  return null
}

module.exports = {
  initialize,
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStatusHistory,
  addStatusHistory,
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getJobDescription,
  saveJobDescription,
  getAnalyticsMetrics,
  getSankeyData,
  getResumeMetrics,
  exportData,
  getApplicationsByPeriod,
  getCumulativeApplications,
  getVelocityMetrics,
  getAverageStageDuration
}
