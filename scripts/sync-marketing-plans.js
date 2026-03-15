#!/usr/bin/env node
/**
 * Sync marketing plans from markdown files to JSON for the dashboard
 * Run: npm run sync:plans
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLANS_DIR = path.resolve(__dirname, '../../../marketing-plans')
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/marketing-plans.json')

function extractSection(content, sectionName, level = 2) {
  const regex = new RegExp(`#{${level}} ${sectionName}[\\s\\S]*?(?=\\n#{1,${level}} |$)`, 'i')
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

function extractKeyValue(content, key) {
  const regex = new RegExp(`\\*\\*${key}:\\*\\*\\s*([^\\n]+)`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

function parseMarkdownPlan(content, filename) {
  const plan = {
    id: filename.replace('.md', ''),
    clientId: filename.replace('.md', ''),
    name: '',
    status: 'draft',
    period: '',
    lastUpdated: '',
    primaryAgent: '',
    
    // Strategic Overview
    businessContext: {
      industry: '',
      businessType: '',
      keyChallenges: '',
      marketingGoals: ''
    },
    
    currentPosition: {
      platformPerformance: '',
      contentStatus: '',
      competitivePosition: '',
      brandStrength: ''
    },
    
    // Plan Objectives
    objectives: {
      primary: [],
      kpis: [],
      timeline: {}
    },
    
    // Platform Strategy
    platformStrategy: [],
    
    // Content Strategy
    contentStrategy: {
      pillars: [],
      calendarFramework: {},
      specifications: {}
    },
    
    // Campaign Schedule
    campaigns: {
      active: [],
      upcoming: []
    },
    
    // Task Management
    tasks: {
      content: [],
      monitor: [],
      reports: [],
      intel: []
    },
    
    // Monitoring & Optimization
    monitoring: {
      reviewSchedule: [],
      optimizationTriggers: [],
      reportingCommunication: []
    }
  }

  // Extract basic info
  const nameMatch = content.match(/^#\s+Marketing Plan\s*-?\s*(.+)$/m)
  if (nameMatch) {
    plan.name = nameMatch[1].trim()
  }

  // Extract metadata
  plan.period = extractKeyValue(content, 'Plan Period')
  plan.status = extractKeyValue(content, 'Plan Status').replace(/🟡|🟢|🔴|Draft|Active|Review/gi, '').trim().toLowerCase() || 'draft'
  plan.lastUpdated = extractKeyValue(content, 'Last Updated')
  plan.primaryAgent = extractKeyValue(content, 'Primary Agent')

  // Strategic Overview
  const overviewSection = extractSection(content, 'Strategic Overview')
  const businessContextMatch = overviewSection.match(/### Business Context[\s\S]*?(?=###|$)/i)
  if (businessContextMatch) {
    plan.businessContext.industry = extractKeyValue(businessContextMatch[0], 'Industry')
    plan.businessContext.businessType = extractKeyValue(businessContextMatch[0], 'Business Type')
    plan.businessContext.keyChallenges = extractKeyValue(businessContextMatch[0], 'Key Challenges')
    plan.businessContext.marketingGoals = extractKeyValue(businessContextMatch[0], 'Marketing Goals')
  }

  // Plan Objectives
  const objectivesSection = extractSection(content, 'Plan Objectives')
  const primaryGoalsMatch = objectivesSection.match(/### Primary Goals.*?\n([\s\S]*?)(?=###|$)/i)
  if (primaryGoalsMatch) {
    const goalMatches = primaryGoalsMatch[1].matchAll(/\d+\.\s+\*\*([^*]+)\*\*\s*-\s*(.+)/g)
    for (const goal of goalMatches) {
      plan.objectives.primary.push({
        goal: goal[1].trim(),
        target: goal[2].trim(),
        status: 'planned'
      })
    }
  }

  // KPIs
  const kpisTable = extractTable(objectivesSection)
  for (const row of kpisTable) {
    if (row.length >= 4 && row[0] !== 'Metric') {
      plan.objectives.kpis.push({
        metric: row[0],
        current: row[1],
        target: row[2],
        platform: row[3],
        measurement: row[4] || 'Weekly',
        progress: 0
      })
    }
  }

  // Success Timeline
  const timelineMatch = objectivesSection.match(/### Success Timeline[\s\S]*?(?=###|$)/i)
  if (timelineMatch) {
    const timelineEntries = timelineMatch[0].matchAll(/\*\*([^*]+):\*\*\s*([^\n]+)/g)
    for (const entry of timelineEntries) {
      plan.objectives.timeline[entry[1].trim()] = entry[2].trim()
    }
  }

  // Platform Strategy
  const platformSection = extractSection(content, 'Platform Strategy')
  const platformTable = extractTable(platformSection)
  for (const row of platformTable) {
    if (row.length >= 5 && row[0] !== 'Platform') {
      plan.platformStrategy.push({
        platform: row[0],
        priority: row[1],
        focus: row[2],
        frequency: row[3],
        targetAudience: row[4],
        kpiFocus: row[5] || ''
      })
    }
  }

  // Content Strategy - Content Pillars
  const contentSection = extractSection(content, 'Content Strategy')
  const pillarsTable = extractTable(contentSection)
  for (const row of pillarsTable) {
    if (row.length >= 4 && row[0] !== 'Pillar' && !row[0].includes('%')) {
      const percentMatch = row[1].match(/(\d+)%/)
      plan.contentStrategy.pillars.push({
        pillar: row[0],
        percentage: percentMatch ? parseInt(percentMatch[1]) : 0,
        purpose: row[2],
        contentTypes: row[3],
        frequency: row[4] || ''
      })
    }
  }

  // Campaign Schedule
  const campaignSection = extractSection(content, 'Campaign Schedule')
  
  // Active Campaigns
  const activeCampaignsMatch = campaignSection.match(/### Current Active Campaigns[\s\S]*?(?=###|$)/i)
  if (activeCampaignsMatch) {
    const campaignTable = extractTable(activeCampaignsMatch[0])
    for (const row of campaignTable) {
      if (row.length >= 6 && row[0] !== 'Campaign') {
        plan.campaigns.active.push({
          name: row[0],
          platforms: row[1],
          startDate: row[2],
          endDate: row[3],
          goal: row[4],
          budget: row[5],
          status: row[6] || 'active'
        })
      }
    }
  }

  // Upcoming Campaigns
  const upcomingCampaignsMatch = campaignSection.match(/### Upcoming Campaigns[\s\S]*?(?=###|$)/i)
  if (upcomingCampaignsMatch) {
    const upcomingTable = extractTable(upcomingCampaignsMatch[0])
    for (const row of upcomingTable) {
      if (row.length >= 5 && row[0] !== 'Campaign') {
        plan.campaigns.upcoming.push({
          name: row[0],
          platforms: row[1],
          launchDate: row[2],
          duration: row[3],
          goal: row[4],
          resourcesNeeded: row[5] || ''
        })
      }
    }
  }

  // Task Management
  const taskSection = extractSection(content, 'Task Management')
  
  // Parse agent tasks
  const agentTypes = ['Content Agent', 'Monitor Agent', 'Reports Agent', 'Intel Agent']
  for (const agentType of agentTypes) {
    const agentKey = agentType.toLowerCase().split(' ')[0]
    const agentMatch = taskSection.match(new RegExp(`#### ${agentType} Tasks[\\s\\S]*?(?=####|$)`, 'i'))
    if (agentMatch) {
      const taskMatches = agentMatch[0].matchAll(/- \[ \]\s+\*\*([^*]+):\*\*\s*([^\n]+)/g)
      for (const task of taskMatches) {
        plan.tasks[agentKey].push({
          task: task[2].trim(),
          category: task[1].trim(),
          status: 'pending',
          agent: agentType,
          due: task[1].includes('Week') ? task[1] : 'TBD'
        })
      }
    }
  }

  return plan
}

function syncMarketingPlans() {
  console.log('📂 Reading marketing plans from:', PLANS_DIR)

  if (!fs.existsSync(PLANS_DIR)) {
    console.log('📁 Creating marketing-plans directory:', PLANS_DIR)
    fs.mkdirSync(PLANS_DIR, { recursive: true })
    console.log('⚠️  No marketing plans found. Directory created for future plans.')
    
    // Write empty array
    const outputDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2))
    return
  }

  const files = fs.readdirSync(PLANS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  console.log(`📄 Found ${files.length} marketing plan file(s)`)

  const plans = []

  for (const file of files) {
    const filepath = path.join(PLANS_DIR, file)
    const content = fs.readFileSync(filepath, 'utf-8')
    const plan = parseMarkdownPlan(content, file)
    
    if (plan.name || plan.clientId) {
      plans.push(plan)
      console.log(`  ✅ ${plan.name || plan.clientId}`)
      console.log(`     └─ ${plan.objectives.primary.length} objectives, ${plan.platformStrategy.length} platforms, ${Object.keys(plan.tasks).reduce((total, key) => total + plan.tasks[key].length, 0)} tasks`)
    } else {
      console.log(`  ⚠️  Skipped ${file} (no name/ID found)`)
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(plans, null, 2))
  console.log(`\\n✨ Synced ${plans.length} marketing plan(s) to:`, OUTPUT_FILE)
}

syncMarketingPlans()