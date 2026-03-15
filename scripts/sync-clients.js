#!/usr/bin/env node
/**
 * Sync clients from markdown files to JSON for the dashboard
 * Run: npm run sync:clients
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENTS_DIR = path.resolve(__dirname, '../../../clients')
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/clients.json')

// Platform name normalization
const platformMap = {
  'facebook': 'facebook',
  'instagram': 'instagram',
  'linkedin': 'linkedin',
  'twitter': 'twitter',
  'x': 'twitter',
  'tiktok': 'tiktok',
  'youtube': 'youtube',
}

function extractSection(content, sectionName) {
  const regex = new RegExp(`## ${sectionName}[\\s\\S]*?(?=\\n## |$)`, 'i')
  const match = content.match(regex)
  return match ? match[0] : ''
}

function extractTable(section) {
  const rows = []
  const tableMatch = section.match(/\|[^\n]+\|[\s\S]*?(?=\n\n|\n[^|]|$)/g)
  if (!tableMatch) return rows

  const lines = tableMatch[0].split('\n').filter(l => l.trim().startsWith('|'))
  if (lines.length < 2) return rows

  // Skip header and separator
  const dataLines = lines.slice(2)
  for (const line of dataLines) {
    const cells = line.split('|').map(c => c.trim()).filter(c => c)
    if (cells.length >= 2) {
      rows.push(cells)
    }
  }
  return rows
}

function extractKeyValue(content, key) {
  const regex = new RegExp(`\\|\\s*${key}\\s*\\|\\s*([^|]+)\\|`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

function extractBulletList(section, afterHeading = null) {
  let searchArea = section
  if (afterHeading) {
    const headingRegex = new RegExp(`### ${afterHeading}[\\s\\S]*?(?=###|$)`, 'i')
    const match = section.match(headingRegex)
    if (match) searchArea = match[0]
  }
  
  const bullets = []
  const matches = searchArea.matchAll(/^[-*]\s+(.+)$/gm)
  for (const m of matches) {
    bullets.push(m[1].trim())
  }
  return bullets
}

function parseMarkdownClient(content, filename) {
  const client = {
    id: filename.replace('.md', ''),
    name: '',
    status: 'active',
    lastUpdated: '',
    
    // Overview
    overview: {
      industry: '',
      type: '',
      size: '',
      locations: '',
      website: '',
      phone: '',
      email: '',
      primaryContact: '',
    },
    
    // Brand Identity
    brand: {
      voice: '',
      style: '',
      values: [],
      tagline: '',
      visualStyle: '',
    },
    
    // Social Media
    social: {
      platforms: [],
      contentThatWorks: [],
      contentGaps: [],
    },
    
    // Target Audience
    audience: {
      primary: {
        demographics: '',
        psychographics: '',
        painPoints: '',
        desires: '',
      },
      secondary: '',
    },
    
    // Competition
    competition: {
      competitors: [],
      positioning: '',
    },
    
    // Services & Products
    services: {
      categories: [],
      products: [],
    },
    
    // Team
    team: [],
    
    // Strategy
    strategy: {
      contentPillars: [],
      hashtags: {
        branded: [],
        location: [],
        industry: [],
      },
      postingSchedule: [],
    },
    
    // Notes & Insights
    notes: {
      insights: [],
      reviews: [],
      assets: [],
      changeLog: [],
    },
  }

  // Extract name from first H1
  const nameMatch = content.match(/^#\s+(?:Client Profile:\s*)?(.+)$/m)
  if (nameMatch) {
    client.name = nameMatch[1].trim()
  }

  // Extract status
  const statusMatch = content.match(/\*\*Status:\*\*\s*([🟢🟡🔴]?\s*\w+)/i)
  if (statusMatch) {
    const status = statusMatch[1].toLowerCase()
    if (status.includes('active') || status.includes('🟢')) {
      client.status = 'active'
    } else if (status.includes('paused') || status.includes('🟡')) {
      client.status = 'paused'
    } else if (status.includes('inactive') || status.includes('🔴')) {
      client.status = 'inactive'
    }
  }

  // Last Updated
  const updatedMatch = content.match(/\*\*Last Updated:\*\*\s*(\d{4}-\d{2}-\d{2})/i)
  if (updatedMatch) {
    client.lastUpdated = updatedMatch[1]
  }

  // Overview section
  const overviewSection = extractSection(content, 'Overview')
  client.overview.industry = extractKeyValue(overviewSection, 'Industry')
  client.overview.type = extractKeyValue(overviewSection, 'Type')
  client.overview.size = extractKeyValue(overviewSection, 'Size')
  client.overview.locations = extractKeyValue(overviewSection, 'Locations?')
  client.overview.website = extractKeyValue(overviewSection, 'Website').replace(/[\[\]()]/g, '').split(' ')[0]
  client.overview.phone = extractKeyValue(overviewSection, 'Phone')
  client.overview.email = extractKeyValue(overviewSection, 'Email')
  client.overview.primaryContact = extractKeyValue(overviewSection, 'Primary Contact')

  // Brand Identity
  const brandSection = extractSection(content, 'Brand Identity')
  const voiceMatch = brandSection.match(/\*\*Tone:\*\*\s*(.+)/i)
  if (voiceMatch) client.brand.voice = voiceMatch[1].trim()
  const styleMatch = brandSection.match(/\*\*Style:\*\*\s*(.+)/i)
  if (styleMatch) client.brand.style = styleMatch[1].trim()
  const visualMatch = brandSection.match(/### Visual Style[\s\S]*?[-*]\s*(.+?)(?:\n|$)/i)
  if (visualMatch) client.brand.visualStyle = visualMatch[1].trim()
  
  // Core values
  const valuesSection = brandSection.match(/### Core Values[\s\S]*?(?=###|$)/i)
  if (valuesSection) {
    client.brand.values = extractBulletList(valuesSection[0])
  }
  
  // Tagline
  const taglineMatch = brandSection.match(/### Tagline\/Mission[\s\S]*?\*\*"([^"]+)"\*\*/i)
  if (taglineMatch) client.brand.tagline = taglineMatch[1]

  // Social Media
  const socialSection = extractSection(content, 'Social Media Presence')
  const platformTable = extractTable(socialSection)
  for (const row of platformTable) {
    if (row.length >= 4) {
      const platformName = row[0].toLowerCase().replace(/[^a-z]/g, '')
      client.social.platforms.push({
        name: platformMap[platformName] || platformName,
        handle: row[1].replace(/[\[\]()]/g, '').split(' ')[0],
        followers: row[2],
        frequency: row[3],
        notes: row[4] || '',
      })
    }
  }
  
  // Content that works / gaps
  const worksMatch = socialSection.match(/### Content That Works[\s\S]*?(?=###|$)/i)
  if (worksMatch) {
    client.social.contentThatWorks = extractBulletList(worksMatch[0])
  }
  const gapsMatch = socialSection.match(/### Content Gaps[\s\S]*?(?=###|$)/i)
  if (gapsMatch) {
    client.social.contentGaps = extractBulletList(gapsMatch[0])
  }

  // Target Audience
  const audienceSection = extractSection(content, 'Target Audience')
  const primaryMatch = audienceSection.match(/### Primary Audience[\s\S]*?(?=###|$)/i)
  if (primaryMatch) {
    const demoMatch = primaryMatch[0].match(/\*\*Demographics:\*\*\s*(.+)/i)
    if (demoMatch) client.audience.primary.demographics = demoMatch[1].trim()
    const psychMatch = primaryMatch[0].match(/\*\*Psychographics:\*\*\s*(.+)/i)
    if (psychMatch) client.audience.primary.psychographics = psychMatch[1].trim()
    const painMatch = primaryMatch[0].match(/\*\*Pain Points:\*\*\s*(.+)/i)
    if (painMatch) client.audience.primary.painPoints = painMatch[1].trim()
    const desireMatch = primaryMatch[0].match(/\*\*Desires:\*\*\s*(.+)/i)
    if (desireMatch) client.audience.primary.desires = desireMatch[1].trim()
  }
  const secondaryMatch = audienceSection.match(/### Secondary Audience[\s\S]*?(?=###|$)/i)
  if (secondaryMatch) {
    client.audience.secondary = extractBulletList(secondaryMatch[0]).join('; ')
  }

  // Competition
  const competitionSection = extractSection(content, 'Competitive Landscape')
  const compTable = extractTable(competitionSection)
  for (const row of compTable) {
    if (row.length >= 3) {
      client.competition.competitors.push({
        name: row[0],
        strengths: row[1],
        weaknesses: row[2],
        socialStrategy: row[3] || '',
      })
    }
  }
  const positionMatch = competitionSection.match(/### Competitive Positioning[\s\S]*?\*\*[^*]+\*\*([^#]+)/i)
  if (positionMatch) {
    client.competition.positioning = extractBulletList(positionMatch[0]).join('; ')
  }

  // Services
  const servicesSection = extractSection(content, 'Services Offered')
  const serviceCategories = servicesSection.matchAll(/### ([^\n]+)\s*\((\d+) services?\)/gi)
  for (const cat of serviceCategories) {
    client.services.categories.push({
      name: cat[1].trim(),
      count: parseInt(cat[2]),
    })
  }
  
  // Products
  const productsSection = extractSection(content, 'Products')
  const productTable = extractTable(productsSection)
  for (const row of productTable) {
    if (row.length >= 3) {
      client.services.products.push({
        name: row[0],
        price: row[1],
        category: row[2],
      })
    }
  }

  // Team
  const teamSection = extractSection(content, 'The Team')
  const teamTable = extractTable(teamSection)
  for (const row of teamTable) {
    if (row.length >= 2) {
      client.team.push({
        name: row[0].replace(/\*\*/g, ''),
        role: row[1],
      })
    }
  }

  // Strategy
  const strategySection = extractSection(content, 'Content Strategy Recommendations')
  const pillarsMatch = strategySection.match(/### Content Pillars[\s\S]*?(?=###|$)/i)
  if (pillarsMatch) {
    const pillars = pillarsMatch[0].matchAll(/\d+\.\s+\*\*([^*]+)\*\*\s*[—-]\s*(.+)/g)
    for (const p of pillars) {
      client.strategy.contentPillars.push({
        name: p[1].trim(),
        description: p[2].trim(),
      })
    }
  }
  
  // Hashtags
  const hashtagMatch = strategySection.match(/### Hashtag Strategy[\s\S]*?(?=###|$)/i)
  if (hashtagMatch) {
    const brandedMatch = hashtagMatch[0].match(/\*\*Branded:\*\*\s*(.+)/i)
    if (brandedMatch) client.strategy.hashtags.branded = brandedMatch[1].split(/\s+/)
    const locationMatch = hashtagMatch[0].match(/\*\*Location:\*\*\s*(.+)/i)
    if (locationMatch) client.strategy.hashtags.location = locationMatch[1].split(/\s+/)
    const industryMatch = hashtagMatch[0].match(/\*\*Industry:\*\*\s*(.+)/i)
    if (industryMatch) client.strategy.hashtags.industry = industryMatch[1].split(/\s+/)
  }
  
  // Posting Schedule
  const scheduleMatch = strategySection.match(/### Posting Schedule[\s\S]*?(?=###|$)/i)
  if (scheduleMatch) {
    client.strategy.postingSchedule = extractBulletList(scheduleMatch[0])
  }

  // Notes & Insights
  const notesSection = extractSection(content, 'Notes & Insights')
  client.notes.insights = extractBulletList(notesSection)
  
  // Reviews
  const reviewsSection = extractSection(content, 'Reviews & Reputation')
  const reviewTable = extractTable(reviewsSection)
  for (const row of reviewTable) {
    if (row.length >= 3) {
      client.notes.reviews.push({
        platform: row[0],
        rating: row[1],
        count: row[2],
      })
    }
  }
  
  // Assets
  const assetsSection = extractSection(content, 'Assets & Resources')
  client.notes.assets = extractBulletList(assetsSection)
  
  // Change Log
  const changeSection = extractSection(content, 'Change Log')
  const changeTable = extractTable(changeSection)
  for (const row of changeTable) {
    if (row.length >= 3) {
      client.notes.changeLog.push({
        date: row[0],
        change: row[1],
        by: row[2],
      })
    }
  }

  // Legacy fields for list view
  client.platforms = client.social.platforms.map(p => p.name)
  client.industry = client.overview.industry
  client.postsThisWeek = 0
  client.nextPost = 'Pending'

  return client
}

function syncClients() {
  console.log('📂 Reading clients from:', CLIENTS_DIR)

  if (!fs.existsSync(CLIENTS_DIR)) {
    console.error('❌ Clients directory not found:', CLIENTS_DIR)
    process.exit(1)
  }

  const files = fs.readdirSync(CLIENTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  console.log(`📄 Found ${files.length} client file(s)`)

  const clients = []

  for (const file of files) {
    const filepath = path.join(CLIENTS_DIR, file)
    const content = fs.readFileSync(filepath, 'utf-8')
    const client = parseMarkdownClient(content, file)
    
    if (client.name) {
      clients.push(client)
      console.log(`  ✅ ${client.name}`)
      console.log(`     └─ ${client.social.platforms.length} platforms, ${client.team.length} team members, ${client.competition.competitors.length} competitors`)
    } else {
      console.log(`  ⚠️  Skipped ${file} (no name found)`)
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(clients, null, 2))
  console.log(`\n✨ Synced ${clients.length} client(s) to:`, OUTPUT_FILE)
}

syncClients()
