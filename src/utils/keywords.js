// Common tech keywords to look for
const techKeywords = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r',
  // Frontend
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'next.js', 'nuxt', 'gatsby', 'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap', 'material-ui', 'mui',
  // Backend
  'node', 'nodejs', 'express', 'fastify', 'django', 'flask', 'spring', 'rails', 'laravel', '.net', 'asp.net',
  // Databases
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'oracle', 'sqlite',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'gitlab',
  // Tools & Practices
  'git', 'agile', 'scrum', 'jira', 'rest', 'restful', 'graphql', 'api', 'microservices', 'serverless', 'tdd', 'testing', 'unit testing',
  // Data & ML
  'machine learning', 'ml', 'ai', 'data science', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'spark', 'hadoop', 'etl', 'data engineering',
  // Mobile
  'ios', 'android', 'react native', 'flutter', 'mobile',
  // Other
  'linux', 'unix', 'bash', 'shell', 'security', 'oauth', 'authentication', 'websocket', 'performance', 'optimization'
]

// Soft skills and other keywords
const softKeywords = [
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving', 'analytical', 'creative', 'innovative',
  'mentor', 'mentoring', 'cross-functional', 'stakeholder', 'presentation', 'documentation', 'technical writing'
]

// Experience level indicators
const experienceKeywords = [
  'senior', 'junior', 'mid-level', 'staff', 'principal', 'lead', 'architect', 'manager', 'director',
  '1 year', '2 years', '3 years', '4 years', '5 years', '5+ years', '7+ years', '10+ years',
  'entry level', 'experienced', 'expert'
]

const allKeywords = [...techKeywords, ...softKeywords, ...experienceKeywords]

/**
 * Extract keywords from text
 * @param {string} text - The text to extract keywords from (can be LaTeX)
 * @returns {string[]} - Array of found keywords
 */
export function extractKeywords(text) {
  if (!text) return []

  // Strip LaTeX commands first
  const cleanedText = stripLatex(text)
  const normalizedText = cleanedText.toLowerCase()
  const found = new Set()

  // Match against predefined keywords
  for (const keyword of allKeywords) {
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i')
    if (regex.test(normalizedText)) {
      found.add(keyword.toLowerCase())
    }
  }

  // Extract additional potential keywords not in predefined list
  const additionalKeywords = extractAdditionalKeywords(cleanedText)
  additionalKeywords.forEach(k => found.add(k))

  return Array.from(found).sort()
}

/**
 * Extract additional keywords that might not be in the predefined list
 * Looks for technology-like patterns (capitalized words, version numbers, etc.)
 * @param {string} text - Cleaned text (no LaTeX)
 * @returns {string[]} - Array of additional keywords
 */
function extractAdditionalKeywords(text) {
  const found = new Set()

  // Common patterns for tech terms:
  // - CamelCase or PascalCase words (e.g., GraphQL, PostgreSQL, TensorFlow)
  // - Words with numbers or versions (e.g., ES6, Python3, Web3, OAuth2)
  // - Acronyms (3+ uppercase letters together)
  // - Hyphenated tech terms (e.g., CI-CD, Type-Safe)

  // Match technology-like terms: mix of letters and optionally numbers, 2+ chars
  const techPatterns = [
    /\b[A-Z][a-z]+[A-Z][a-zA-Z]*\b/g,  // CamelCase: GraphQL, TensorFlow, FastAPI
    /\b[A-Z]{2,}[0-9]*\b/g,             // Acronyms: REST, SQL, HTML5, ES6
    /\b[A-Za-z]+[0-9]+[A-Za-z]*\b/g,   // Words with numbers: Python3, Web3, OAuth2
    /\b[A-Z][a-z]+(?:\.[A-Za-z]+)+\b/g, // Dotted names: Node.js, Vue.js, Next.js
  ]

  for (const pattern of techPatterns) {
    const matches = text.match(pattern) || []
    for (const match of matches) {
      const normalized = match.toLowerCase()
      // Filter out common words and very short terms
      if (normalized.length >= 2 && !isCommonWord(normalized)) {
        found.add(normalized)
      }
    }
  }

  // Also look for items in skill-like contexts
  // Pattern: after "Skills:", "Technologies:", etc. or in comma/bullet lists
  const skillSectionPattern = /(?:skills?|technologies|tech stack|tools|languages|frameworks|proficien(?:t|cy)|familiar(?:ity)?|experience with)[:\s]+([^.]+)/gi
  let match
  while ((match = skillSectionPattern.exec(text)) !== null) {
    const skillsText = match[1]
    // Split by common delimiters
    const items = skillsText.split(/[,;|•·]/)
    for (const item of items) {
      const cleaned = item.trim().toLowerCase()
      if (cleaned.length >= 2 && cleaned.length <= 30 && !isCommonWord(cleaned)) {
        found.add(cleaned)
      }
    }
  }

  return Array.from(found)
}

/**
 * Check if a word is a common English word that shouldn't be a keyword
 */
function isCommonWord(word) {
  const commonWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'had',
    'are', 'was', 'were', 'been', 'being', 'will', 'would', 'could', 'should',
    'can', 'may', 'might', 'must', 'shall', 'not', 'but', 'what', 'when', 'where',
    'who', 'how', 'why', 'which', 'their', 'there', 'here', 'these', 'those',
    'some', 'any', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'into', 'over', 'under', 'again', 'then', 'once', 'only', 'also', 'very',
    'just', 'about', 'such', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'same', 'than', 'too', 'now', 'new', 'used', 'using',
    'work', 'worked', 'working', 'year', 'years', 'team', 'teams', 'project',
    'projects', 'system', 'systems', 'software', 'developed', 'development',
    'building', 'built', 'created', 'creating', 'implemented', 'implementing',
    'designed', 'designing', 'managed', 'managing', 'improved', 'improving',
    'maintained', 'maintaining', 'including', 'include', 'includes', 'various',
    'multiple', 'several', 'within', 'across', 'well', 'best', 'high', 'low'
  ])
  return commonWords.has(word.toLowerCase())
}

/**
 * Calculate match score between resume keywords and job description keywords
 * @param {string[]} resumeKeywords - Keywords from the resume
 * @param {string[]} jobKeywords - Keywords from the job description
 * @returns {object} - Match details including score, matching, and missing keywords
 */
export function calculateMatchScore(resumeKeywords, jobKeywords) {
  if (!jobKeywords || jobKeywords.length === 0) {
    return { score: 0, matching: [], missing: [] }
  }

  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()))
  const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()))

  const matching = []
  const missing = []

  for (const keyword of jobSet) {
    if (resumeSet.has(keyword)) {
      matching.push(keyword)
    } else {
      missing.push(keyword)
    }
  }

  const score = jobSet.size > 0 ? Math.round((matching.length / jobSet.size) * 100) : 0

  return {
    score,
    matching: matching.sort(),
    missing: missing.sort()
  }
}

/**
 * Get match scores for all resumes against a job description
 * @param {object[]} resumes - Array of resume objects with keywords
 * @param {string[]} jobKeywords - Keywords from the job description
 * @returns {object[]} - Array of match results sorted by score
 */
export function matchResumesToJob(resumes, jobKeywords) {
  return resumes
    .map(resume => {
      const resumeKeywords = typeof resume.keywords === 'string'
        ? JSON.parse(resume.keywords || '[]')
        : (resume.keywords || [])

      const match = calculateMatchScore(resumeKeywords, jobKeywords)

      return {
        id: resume.id,
        name: resume.name,
        ...match
      }
    })
    .sort((a, b) => b.score - a.score)
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Strip LaTeX commands and clean up text for keyword extraction
 * @param {string} text - Raw LaTeX or plain text
 * @returns {string} - Cleaned text
 */
function stripLatex(text) {
  if (!text) return ''

  let cleaned = text

  // Remove LaTeX comments (lines starting with %)
  cleaned = cleaned.replace(/%.*/g, '')

  // Remove common document structure commands
  cleaned = cleaned.replace(/\\(documentclass|usepackage|begin|end|newcommand|renewcommand|setlength|pagestyle|thispagestyle)\{[^}]*\}(\[[^\]]*\])?(\{[^}]*\})*/g, ' ')
  cleaned = cleaned.replace(/\\(begin|end)\{[^}]*\}/g, ' ')

  // Handle \href{url}{text} - keep the text
  cleaned = cleaned.replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')

  // Handle formatting commands - extract content: \textbf{content}, \textit{content}, \emph{content}, etc.
  cleaned = cleaned.replace(/\\(textbf|textit|texttt|emph|underline|textsc|textsf|textrm)\{([^}]*)\}/g, '$2')

  // Handle \section{}, \subsection{}, etc. - keep the content
  cleaned = cleaned.replace(/\\(section|subsection|subsubsection|paragraph|chapter)\*?\{([^}]*)\}/g, '$2 ')

  // Remove size commands
  cleaned = cleaned.replace(/\\(tiny|scriptsize|footnotesize|small|normalsize|large|Large|LARGE|huge|Huge)\b/g, '')

  // Remove spacing commands
  cleaned = cleaned.replace(/\\(vspace|hspace|vfill|hfill|quad|qquad|smallskip|medskip|bigskip|newline|linebreak|pagebreak|newpage|clearpage)\*?(\{[^}]*\})?/g, ' ')

  // Remove \item, \par, and other structural commands
  cleaned = cleaned.replace(/\\(item|par|noindent|indent|centering|raggedright|raggedleft)\b/g, ' ')

  // Remove font family/style commands
  cleaned = cleaned.replace(/\\(bfseries|itshape|ttfamily|rmfamily|sffamily|mdseries|upshape|slshape|scshape)\b/g, '')

  // Remove remaining simple commands like \\ \& \% \$ \# \_ \{ \}
  cleaned = cleaned.replace(/\\[\\&%$#_{}]/g, ' ')

  // Remove any remaining \command (without braces)
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, ' ')

  // Remove remaining braces
  cleaned = cleaned.replace(/[{}]/g, ' ')

  // Clean up multiple spaces and normalize
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  return cleaned
}

/**
 * Get suggested keywords to add to a resume based on common job requirements
 * @param {string[]} currentKeywords - Keywords already in the resume
 * @returns {string[]} - Suggested keywords to consider adding
 */
export function getSuggestedKeywords(currentKeywords) {
  const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()))
  const highValueKeywords = [
    'react', 'typescript', 'python', 'aws', 'docker', 'kubernetes',
    'sql', 'git', 'agile', 'rest', 'testing', 'ci/cd'
  ]

  return highValueKeywords.filter(k => !currentSet.has(k))
}

export { techKeywords, softKeywords, experienceKeywords, allKeywords, stripLatex }
