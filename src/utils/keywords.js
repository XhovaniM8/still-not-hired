// Common tech keywords to look for
const techKeywords = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'c',
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
  // Algorithms & Math
  'algorithm', 'algorithms', 'data structures', 'dsp', 'digital signal processing', 'signal processing',
  // Other
  'linux', 'unix', 'bash', 'shell', 'security', 'oauth', 'authentication', 'websocket', 'performance', 'optimization'
]

// Hardware/FPGA keywords
const hardwareKeywords = [
  // HDL Languages
  'verilog', 'systemverilog', 'vhdl', 'hdl', 'rtl',
  // FPGA Tools
  'vivado', 'quartus', 'modelsim', 'questasim', 'verilator', 'synplify', 'yosys',
  // FPGA Vendors
  'xilinx', 'altera', 'intel fpga', 'lattice', 'microsemi', 'amd fpga',
  // Concepts
  'fpga', 'asic', 'synthesis', 'timing closure', 'place and route', 'p&r',
  'clock domain crossing', 'cdc', 'metastability', 'pipelining',
  'finite state machine', 'fsm', 'axi', 'wishbone', 'avalon',
  // Verification & Validation
  'uvm', 'ovm', 'systemc', 'cocotb', 'formal verification', 'assertions',
  'coverage', 'constrained random', 'testbench', 'verification', 'validation',
  'design verification', 'hardware verification', 'regression', 'regression testing',
  'waveform', 'simulation', 'scoreboard', 'scoreboarding',
  // Hardware general
  'hardware', 'digital design', 'logic design', 'prototyping', 'bring-up'
]

// Embedded systems keywords
const embeddedKeywords = [
  // Languages/Tools
  'embedded c', 'assembly', 'arm', 'risc-v', 'riscv',
  // Platforms
  'stm32', 'esp32', 'arduino', 'raspberry pi', 'nxp', 'ti', 'microchip',
  'pic', 'avr', 'cortex-m', 'cortex-a',
  // Concepts
  'rtos', 'freertos', 'zephyr', 'bare metal', 'firmware', 'bootloader',
  'dma', 'interrupt', 'isr', 'gpio', 'uart', 'spi', 'i2c', 'can bus', 'canbus', 'lin',
  'usb', 'pcie', 'ethernet', 'tcp/ip',
  // Tools
  'jtag', 'swd', 'gdb', 'openocd', 'keil', 'iar', 'gcc-arm'
]

// Systems engineering keywords
const systemsKeywords = [
  // Concepts
  'systems engineering', 'system architecture', 'requirements', 'v-model',
  'model-based', 'mbse', 'sysml', 'simulink', 'matlab',
  // Performance
  'latency', 'throughput', 'bandwidth', 'real-time', 'deterministic',
  // Memory/Storage
  'ddr', 'ddr4', 'ddr5', 'hbm', 'nvme', 'flash', 'eeprom', 'sram', 'dram',
  // Interfaces
  '10gbe', '100gbe', 'infiniband', 'aurora'
]

// Electronics/PCB keywords
const electronicsKeywords = [
  'pcb', 'schematic', 'layout', 'altium', 'kicad', 'cadence', 'orcad',
  'signal integrity', 'power integrity', 'emc', 'emi', 'rf',
  'analog', 'digital', 'mixed-signal', 'adc', 'dac', 'pll', 'dsp',
  'oscilloscope', 'logic analyzer', 'spectrum analyzer', 'multimeter'
]

// Soft skills and other keywords
const softKeywords = [
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving', 'analytical', 'creative', 'innovative',
  'mentor', 'mentoring', 'cross-functional', 'stakeholder', 'presentation', 'documentation', 'technical writing'
]

// Experience level indicators - these are NOT matched as technical keywords
// They're kept for reference but excluded from extraction
const experienceKeywords = [
  // These are intentionally not used in keyword matching
]

const allKeywords = [
  ...techKeywords,
  ...hardwareKeywords,
  ...embeddedKeywords,
  ...systemsKeywords,
  ...electronicsKeywords,
  ...softKeywords,
  ...experienceKeywords
]

// Synonym groups - keywords in same group are treated as equivalent
const synonymGroups = [
  // Languages
  ['javascript', 'js', 'ecmascript', 'es6', 'es2015'],
  ['typescript', 'ts'],
  ['c++', 'cpp', 'cplusplus'],
  ['c#', 'csharp', 'c-sharp'],
  ['python', 'py', 'python3'],
  ['golang', 'go'],

  // Frontend
  ['react', 'reactjs', 'react.js'],
  ['vue', 'vuejs', 'vue.js'],
  ['angular', 'angularjs', 'angular.js'],
  ['node', 'nodejs', 'node.js'],
  ['next', 'nextjs', 'next.js'],

  // Hardware
  ['systemverilog', 'system verilog', 'sv'],
  ['verilog', 'verilog hdl'],
  ['fpga', 'fpgas', 'field programmable gate array'],
  ['asic', 'asics', 'application specific integrated circuit'],
  ['rtl', 'register transfer level'],
  ['pcb', 'printed circuit board'],
  ['hardware', 'hw'],
  ['scoreboard', 'scoreboarding'],

  // DevOps
  ['ci/cd', 'ci-cd', 'cicd', 'continuous integration', 'continuous deployment'],
  ['kubernetes', 'k8s'],
  ['docker', 'containers', 'containerization'],

  // Databases
  ['postgresql', 'postgres', 'psql'],
  ['mongodb', 'mongo'],
  ['mysql', 'mariadb'],

  // Embedded
  ['rtos', 'real-time operating system'],
  ['freertos', 'free rtos'],
  ['risc-v', 'riscv', 'risc v'],
  ['i2c', 'iic', 'i²c'],
  ['spi', 'serial peripheral interface'],
  ['uart', 'serial'],

  // Testing/Verification
  ['testing', 'test', 'tests', 'unit testing', 'tdd'],
  ['testbench', 'testbenches', 'tb'],
  ['verification', 'verfication'],  // including common typo
  ['validation', 'validating'],
  ['regression', 'regression testing'],
  ['simulation', 'simulating', 'simulate'],

  // Signal processing
  ['dsp', 'digital signal processing', 'signal processing'],
  ['algorithm', 'algorithms'],

  // Firmware/Embedded
  ['firmware', 'fw'],
  ['embedded', 'embedded c', 'bare metal'],

  // General
  ['machine learning', 'ml'],
  ['artificial intelligence', 'ai'],
  ['api', 'apis', 'rest api', 'restful api'],
  ['optimization', 'optimizing', 'optimize']
]

// Build a lookup map from any synonym to its canonical form (first item in group)
const synonymMap = new Map()
for (const group of synonymGroups) {
  const canonical = group[0]
  for (const synonym of group) {
    synonymMap.set(synonym.toLowerCase(), canonical.toLowerCase())
  }
}

/**
 * Get the canonical form of a keyword (resolves synonyms)
 * @param {string} keyword - The keyword to normalize
 * @returns {string} - The canonical form
 */
function getCanonicalKeyword(keyword) {
  const lower = keyword.toLowerCase()
  return synonymMap.get(lower) || lower
}

/**
 * Check if two keywords match (either exact or via synonym)
 * @param {string} kw1 - First keyword
 * @param {string} kw2 - Second keyword
 * @returns {{matches: boolean, type: 'exact'|'synonym'|null}} - Match result with type
 */
function keywordsMatch(kw1, kw2) {
  const lower1 = kw1.toLowerCase()
  const lower2 = kw2.toLowerCase()

  if (lower1 === lower2) {
    return { matches: true, type: 'exact' }
  }

  const canonical1 = getCanonicalKeyword(lower1)
  const canonical2 = getCanonicalKeyword(lower2)

  if (canonical1 === canonical2) {
    return { matches: true, type: 'synonym' }
  }

  return { matches: false, type: null }
}

// Keyword category weights
const KEYWORD_WEIGHTS = {
  core_technical: 3.0,  // Programming languages, HDLs, core frameworks
  tools: 2.0,           // Vivado, Docker, AWS, specific tools
  concepts: 1.5,        // Methodologies, concepts, patterns
  soft_skills: 0.5      // Communication, leadership, teamwork
}

// Categorize keywords into weight groups
const coreTechnicalKeywords = new Set([
  // Programming languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'scala', 'r', 'c',
  // HDL languages
  'verilog', 'systemverilog', 'vhdl', 'hdl',
  // Core frameworks
  'react', 'vue', 'angular', 'svelte', 'node', 'nodejs', 'django', 'flask', 'spring', 'rails',
  'express', 'fastify', 'laravel', '.net', 'asp.net', 'next.js', 'nextjs', 'nuxt', 'gatsby',
  // Database engines
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
  'cassandra', 'oracle', 'sqlite',
  // Core embedded
  'embedded c', 'embedded', 'assembly', 'arm', 'risc-v', 'riscv', 'rtos', 'freertos', 'zephyr', 'firmware',
  // Core hardware
  'rtl', 'fpga', 'asic', 'uvm', 'systemc', 'hardware', 'verification', 'validation',
  // Signal processing / algorithms
  'algorithm', 'algorithms', 'dsp', 'digital signal processing', 'signal processing'
])

const toolsKeywords = new Set([
  // FPGA/Hardware tools
  'vivado', 'quartus', 'modelsim', 'questasim', 'verilator', 'synplify', 'cocotb',
  'altium', 'kicad', 'cadence', 'orcad',
  // DevOps/Cloud
  'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab',
  'aws', 'azure', 'gcp', 'google cloud',
  // Data/ML tools
  'pandas', 'numpy', 'tensorflow', 'pytorch', 'spark', 'hadoop',
  // Embedded tools
  'jtag', 'swd', 'gdb', 'openocd', 'keil', 'iar', 'gcc-arm',
  'oscilloscope', 'logic analyzer', 'spectrum analyzer', 'multimeter',
  // General tools
  'git', 'jira', 'simulink', 'matlab'
])

const conceptsKeywords = new Set([
  // Methodologies
  'agile', 'scrum', 'tdd', 'ci/cd', 'microservices', 'serverless', 'rest', 'restful', 'graphql',
  'api', 'oauth', 'authentication',
  // Hardware concepts
  'synthesis', 'timing closure', 'place and route', 'p&r', 'clock domain crossing', 'cdc',
  'metastability', 'pipelining', 'finite state machine', 'fsm', 'axi', 'wishbone', 'avalon',
  'formal verification', 'assertions', 'coverage', 'constrained random', 'testbench',
  'regression', 'regression testing', 'simulation', 'waveform', 'scoreboard', 'scoreboarding',
  'bring-up', 'prototyping', 'digital design', 'logic design',
  // Embedded concepts
  'bare metal', 'bootloader', 'dma', 'interrupt', 'isr', 'gpio',
  // Interfaces/protocols
  'uart', 'spi', 'i2c', 'can bus', 'canbus', 'lin', 'usb', 'pcie', 'ethernet', 'tcp/ip',
  '10gbe', '100gbe', 'infiniband', 'aurora',
  // Systems concepts
  'systems engineering', 'system architecture', 'requirements', 'v-model',
  'model-based', 'mbse', 'sysml', 'latency', 'throughput', 'bandwidth', 'real-time', 'deterministic',
  // Memory
  'ddr', 'ddr4', 'ddr5', 'hbm', 'nvme', 'flash', 'eeprom', 'sram', 'dram',
  // Electronics concepts
  'signal integrity', 'power integrity', 'emc', 'emi', 'rf', 'analog', 'digital', 'mixed-signal',
  // Data concepts
  'machine learning', 'ml', 'ai', 'data science', 'etl', 'data engineering',
  // General
  'linux', 'unix', 'bash', 'shell', 'security', 'websocket', 'performance', 'optimization',
  'testing', 'unit testing', 'mobile'
])

const softSkillsKeywords = new Set([
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving', 'analytical',
  'creative', 'innovative', 'mentor', 'mentoring', 'cross-functional', 'stakeholder',
  'presentation', 'documentation', 'technical writing'
])

/**
 * Get the weight for a keyword based on its category
 * @param {string} keyword - The keyword to get weight for
 * @returns {number} - The weight value
 */
function getKeywordWeight(keyword) {
  const lower = keyword.toLowerCase()
  const canonical = getCanonicalKeyword(lower)

  if (coreTechnicalKeywords.has(lower) || coreTechnicalKeywords.has(canonical)) {
    return KEYWORD_WEIGHTS.core_technical
  }
  if (toolsKeywords.has(lower) || toolsKeywords.has(canonical)) {
    return KEYWORD_WEIGHTS.tools
  }
  if (softSkillsKeywords.has(lower) || softSkillsKeywords.has(canonical)) {
    return KEYWORD_WEIGHTS.soft_skills
  }
  // Default to concepts weight for unrecognized technical keywords
  return KEYWORD_WEIGHTS.concepts
}

/**
 * Get the category name for a keyword
 * @param {string} keyword - The keyword
 * @returns {string} - Category name
 */
function getKeywordCategory(keyword) {
  const lower = keyword.toLowerCase()
  const canonical = getCanonicalKeyword(lower)

  if (coreTechnicalKeywords.has(lower) || coreTechnicalKeywords.has(canonical)) {
    return 'core_technical'
  }
  if (toolsKeywords.has(lower) || toolsKeywords.has(canonical)) {
    return 'tools'
  }
  if (softSkillsKeywords.has(lower) || softSkillsKeywords.has(canonical)) {
    return 'soft_skills'
  }
  return 'concepts'
}

// Keywords with special characters that need custom matching
// Note: \b doesn't work after special chars like + or #, so we use (?!\w) lookahead
const specialKeywords = {
  'c++': /\bc\+\+(?!\w)/i,
  'c#': /\bc#(?!\w)/i,
  '.net': /\.net(?!\w)/i,
  'asp.net': /\basp\.net(?!\w)/i,
  'node.js': /\bnode\.js(?!\w)/i,
  'next.js': /\bnext\.js(?!\w)/i,
  'vue.js': /\bvue\.js(?!\w)/i,
  'react.js': /\breact\.js(?!\w)/i,
  'ci/cd': /\bci\/cd(?!\w)/i,
  'tcp/ip': /\btcp\/ip(?!\w)/i,
  'i2c': /\bi2c(?!\w)/i,
  'i²c': /\bi²c(?!\w)/i,
}

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

  // First, check special keywords with custom regex
  for (const [keyword, regex] of Object.entries(specialKeywords)) {
    if (regex.test(cleanedText)) {
      found.add(keyword.toLowerCase())
    }
  }

  // Match against predefined keywords (skip ones handled specially)
  const specialSet = new Set(Object.keys(specialKeywords))
  for (const keyword of allKeywords) {
    if (specialSet.has(keyword.toLowerCase())) continue

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

  // Only extract from explicit skill sections to avoid noise
  // Pattern: after "Skills:", "Technologies:", etc. or in comma/bullet lists
  const skillSectionPattern = /(?:skills?|technologies|tech stack|tools|languages|frameworks|proficien(?:t|cy)|familiar(?:ity)?|experience with)[:\s]+([^.]+)/gi
  let match
  while ((match = skillSectionPattern.exec(text)) !== null) {
    const skillsText = match[1]
    // Split by common delimiters
    const items = skillsText.split(/[,;|•·]/)
    for (const item of items) {
      const cleaned = item.trim().toLowerCase()
      if (cleaned.length >= 2 && cleaned.length <= 30 && !isCommonWord(cleaned) && !isJunkKeyword(cleaned)) {
        found.add(cleaned)
      }
    }
  }

  // Only extract well-known tech patterns (CamelCase tech terms)
  // Be more conservative - require 3+ chars and check against junk list
  const techPatterns = [
    /\b[A-Z][a-z]+[A-Z][a-zA-Z]*\b/g,  // CamelCase: GraphQL, TensorFlow, FastAPI
    /\b[A-Za-z]+[0-9]+[A-Za-z]*\b/g,   // Words with numbers: Python3, Web3, OAuth2
  ]

  for (const pattern of techPatterns) {
    const matches = text.match(pattern) || []
    for (const match of matches) {
      const normalized = match.toLowerCase()
      // Filter more aggressively
      if (normalized.length >= 3 && !isCommonWord(normalized) && !isJunkKeyword(normalized)) {
        found.add(normalized)
      }
    }
  }

  return Array.from(found)
}

/**
 * Check if a keyword is junk (common abbreviations, locations, generic terms from job postings)
 */
function isJunkKeyword(word) {
  const junkWords = new Set([
    // State/location abbreviations
    'pa', 'va', 'ny', 'nj', 'ca', 'tx', 'dc', 'md', 'ct', 'ma', 'fl', 'wa', 'il', 'nc', 'ga', 'oh',
    // Common job posting junk
    'arl', 'asr', 'eeo', 'uarc', 'cino', 'csp', 'hr', 'hq', 'inc', 'llc', 'ltd', 'corp',
    'skillbridge', 'and other u',
    // Generic terms from job postings
    'job', 'position', 'role', 'description', 'requirements', 'qualifications', 'responsibilities',
    'campus', 'crime', 'law', 'policy', 'statistics', 'report', 'information', 'further',
    'senior', 'junior', 'lead', 'manager', 'director', 'expert', 'specialist', 'army',
    // Generic action terms (not skills)
    'design', 'develop', 'build', 'create', 'implement', 'maintain', 'support', 'manage',
    // Education/location terms from resumes
    'university', 'college', 'school', 'institute', 'center', 'lab', 'laboratory',
    'city', 'county', 'state', 'country', 'region', 'area', 'location',
    // Place names that get extracted
    'copenhagen', 'farmingdale', 'brooklyn', 'manhattan', 'queens', 'holtsville', 'genova',
    // Company suffixes and names
    'aps', 'gmbh', 'sarl', 'bv', 'ag', 'neucom', 'neucom aps', 'ttm',
    // File/document terms
    'pdf', 'doc', 'txt', 'csv',
    // Common meaningless extractions
    'a4paper', 'utf8', 't1', 'abc', 'gf', 'pr', 'is', 'as', 'to', 'of', 'in', 'on', 'at', 'can',
    'evt3', 'mrt16', 'xhovanim8', 'uhd', 'vcd',
    // Random noise from resumes
    'additional', 'contributions', 'summary', 'experience', 'education', 'professional', 'technical',
    'open', 'source', 'skills', 'letter', 'writing', 'literature', 'music', 'production', 'photography',
    'abstract', 'art', 'creative', 'innovative'
  ])
  return junkWords.has(word.toLowerCase())
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
    'multiple', 'several', 'within', 'across', 'well', 'best', 'high', 'low',
    // Additional common words
    'make', 'made', 'making', 'take', 'took', 'taking', 'get', 'got', 'getting',
    'give', 'gave', 'giving', 'find', 'found', 'finding', 'know', 'knew', 'knowing',
    'think', 'thought', 'thinking', 'see', 'saw', 'seeing', 'come', 'came', 'coming',
    'want', 'wanted', 'wanting', 'use', 'look', 'looked', 'looking', 'day', 'days',
    'way', 'ways', 'thing', 'things', 'man', 'men', 'woman', 'women', 'child', 'children',
    'world', 'life', 'hand', 'part', 'place', 'case', 'week', 'company', 'group',
    'problem', 'fact', 'full', 'join', 'joining', 'ensure', 'ability', 'support',
    'provide', 'great', 'need', 'needs', 'help', 'helping', 'start', 'started'
  ])
  return commonWords.has(word.toLowerCase())
}

/**
 * Calculate match score between resume keywords and job description keywords
 * Uses synonym matching, weighted scoring, and tracks match types
 * @param {string[]} resumeKeywords - Keywords from the resume
 * @param {string[]} jobKeywords - Keywords from the job description
 * @param {object} options - Optional settings
 * @param {boolean} options.useWeightedScoring - Use weighted scoring (default: true)
 * @returns {object} - Match details including score, matching (with type), and missing keywords
 */
export function calculateMatchScore(resumeKeywords, jobKeywords, options = {}) {
  const { useWeightedScoring = true } = options

  if (!jobKeywords || jobKeywords.length === 0) {
    return {
      score: 0,
      weightedScore: 0,
      matching: [],
      matchingExact: [],
      matchingSynonym: [],
      missing: [],
      missingByCategory: {
        core_technical: [],
        tools: [],
        concepts: [],
        soft_skills: []
      }
    }
  }

  const resumeKeywordsLower = resumeKeywords.map(k => k.toLowerCase())
  const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase())

  const matchingExact = []
  const matchingSynonym = []
  const missing = []

  let matchedWeight = 0
  let totalWeight = 0

  for (const jobKeyword of jobKeywordsLower) {
    const weight = getKeywordWeight(jobKeyword)
    totalWeight += weight

    let matched = false
    let matchType = null
    let matchedResumeKeyword = null

    for (const resumeKeyword of resumeKeywordsLower) {
      const result = keywordsMatch(jobKeyword, resumeKeyword)
      if (result.matches) {
        matched = true
        matchType = result.type
        matchedResumeKeyword = resumeKeyword
        // Prefer exact matches over synonym matches
        if (matchType === 'exact') break
      }
    }

    if (matched) {
      matchedWeight += weight
      const category = getKeywordCategory(jobKeyword)
      if (matchType === 'exact') {
        matchingExact.push({ keyword: jobKeyword, weight, category })
      } else {
        matchingSynonym.push({
          jobKeyword,
          resumeKeyword: matchedResumeKeyword,
          weight,
          category
        })
      }
    } else {
      const category = getKeywordCategory(jobKeyword)
      missing.push({ keyword: jobKeyword, weight, category })
    }
  }

  // Weighted score: sum of matched weights / sum of all job keyword weights
  const weightedScore = totalWeight > 0
    ? Math.round((matchedWeight / totalWeight) * 100)
    : 0

  // Simple count-based score (for backwards compatibility)
  const totalMatched = matchingExact.length + matchingSynonym.length
  const simpleScore = jobKeywordsLower.length > 0
    ? Math.round((totalMatched / jobKeywordsLower.length) * 100)
    : 0

  // Group missing keywords by category for easier display
  const missingByCategory = {
    core_technical: missing.filter(m => m.category === 'core_technical'),
    tools: missing.filter(m => m.category === 'tools'),
    concepts: missing.filter(m => m.category === 'concepts'),
    soft_skills: missing.filter(m => m.category === 'soft_skills')
  }

  // Combined matching array for backwards compatibility (just keyword strings)
  const matchingKeywords = [
    ...matchingExact.map(m => m.keyword),
    ...matchingSynonym.map(m => m.jobKeyword)
  ]

  return {
    score: useWeightedScoring ? weightedScore : simpleScore,
    weightedScore,
    simpleScore,
    matching: matchingKeywords.sort(),
    matchingExact: matchingExact.sort((a, b) => a.keyword.localeCompare(b.keyword)),
    matchingSynonym: matchingSynonym.sort((a, b) => a.jobKeyword.localeCompare(b.jobKeyword)),
    missing: missing.sort((a, b) => b.weight - a.weight), // Sort by weight descending (most important first)
    missingByCategory
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
 * Get suggested keywords to add to a resume based on job descriptions
 * @param {string[]} currentKeywords - Keywords already in the resume
 * @param {string[]} jobKeywords - Keywords from the target job description (optional)
 * @param {Array<{keywords: string[]}>} savedJobs - Array of saved job objects for TF-IDF analysis (optional)
 * @returns {Array<{keyword: string, reason: string, weight: number, category: string}>} - Suggested keywords with context
 */
export function getSuggestedKeywords(currentKeywords, jobKeywords = null, savedJobs = null) {
  const currentSet = new Set(currentKeywords.map(k => getCanonicalKeyword(k.toLowerCase())))
  const suggestions = []

  // Priority 1: Missing keywords from current job description (if provided)
  if (jobKeywords && jobKeywords.length > 0) {
    for (const keyword of jobKeywords) {
      const canonical = getCanonicalKeyword(keyword.toLowerCase())
      if (!currentSet.has(canonical)) {
        const weight = getKeywordWeight(keyword)
        const category = getKeywordCategory(keyword)
        suggestions.push({
          keyword: keyword.toLowerCase(),
          reason: 'Required by this job',
          weight,
          category,
          source: 'job'
        })
      }
    }
  }

  // Priority 2: Common keywords from saved jobs (if provided)
  if (savedJobs && savedJobs.length > 0) {
    // Count keyword frequency across saved jobs
    const keywordFrequency = new Map()
    for (const job of savedJobs) {
      const keywords = Array.isArray(job.keywords)
        ? job.keywords
        : (typeof job.keywords === 'string' ? JSON.parse(job.keywords || '[]') : [])

      const uniqueCanonical = new Set(keywords.map(k => getCanonicalKeyword(k.toLowerCase())))
      for (const canonical of uniqueCanonical) {
        keywordFrequency.set(canonical, (keywordFrequency.get(canonical) || 0) + 1)
      }
    }

    // Find common keywords user doesn't have
    const alreadySuggested = new Set(suggestions.map(s => getCanonicalKeyword(s.keyword)))
    for (const [keyword, count] of keywordFrequency.entries()) {
      if (!currentSet.has(keyword) && !alreadySuggested.has(keyword)) {
        const percent = Math.round((count / savedJobs.length) * 100)
        // Only suggest if appears in at least 20% of saved jobs
        if (percent >= 20) {
          const weight = getKeywordWeight(keyword)
          const category = getKeywordCategory(keyword)
          suggestions.push({
            keyword,
            reason: `In ${percent}% of your saved jobs`,
            weight,
            category,
            source: 'corpus',
            frequency: count
          })
        }
      }
    }
  }

  // Sort: job-specific first, then by weight, then by frequency
  suggestions.sort((a, b) => {
    if (a.source !== b.source) return a.source === 'job' ? -1 : 1
    if (a.weight !== b.weight) return b.weight - a.weight
    return (b.frequency || 0) - (a.frequency || 0)
  })

  return suggestions.slice(0, 15)
}

export {
  techKeywords,
  hardwareKeywords,
  embeddedKeywords,
  systemsKeywords,
  electronicsKeywords,
  softKeywords,
  experienceKeywords,
  allKeywords,
  synonymGroups,
  synonymMap,
  getCanonicalKeyword,
  getKeywordWeight,
  getKeywordCategory,
  KEYWORD_WEIGHTS,
  stripLatex
}
