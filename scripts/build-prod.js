#!/usr/bin/env node
/**
 * Production build script - creates empty data files if source directories don't exist
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create src/data directory if it doesn't exist
const dataDir = path.resolve(__dirname, '../src/data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Create empty clients.json if it doesn't exist
const clientsFile = path.join(dataDir, 'clients.json')
if (!fs.existsSync(clientsFile)) {
  const defaultClients = [{
    "id": "dr-marinus",
    "name": "Dr Marinus Appelgryn-Siebert Inc",
    "status": "active",
    "industry": "Healthcare",
    "platforms": ["facebook", "instagram", "linkedin"],
    "postsThisWeek": 5,
    "nextPost": "Tomorrow 9 AM",
    "lastUpdated": "2026-03-15"
  }]
  fs.writeFileSync(clientsFile, JSON.stringify(defaultClients, null, 2))
  console.log('✅ Created default clients.json')
}

// Create empty marketing-plans.json if it doesn't exist  
const plansFile = path.join(dataDir, 'marketing-plans.json')
if (!fs.existsSync(plansFile)) {
  const defaultPlans = [{
    "id": "dr-marinus", 
    "name": "Dr Marinus Appelgryn-Siebert Inc",
    "objectives": [],
    "platforms": [],
    "tasks": []
  }]
  fs.writeFileSync(plansFile, JSON.stringify(defaultPlans, null, 2))
  console.log('✅ Created default marketing-plans.json')
}

console.log('🚀 Production build data preparation complete')