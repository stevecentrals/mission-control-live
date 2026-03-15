import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useState, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Interactive org node with hover details
function OrgNode({ 
  x, 
  y,
  label, 
  sublabel, 
  emoji,
  status,
  highlight,
  size = 'default',
  details = [],
  agents = [],
  className,
  transform
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const sizeStyles = {
    large: { width: 200, height: 80, fontSize: '18px', emojiSize: '24px' },
    default: { width: 140, height: 60, fontSize: '14px', emojiSize: '20px' },
    small: { width: 100, height: 50, fontSize: '12px', emojiSize: '16px' },
    tiny: { width: 60, height: 40, fontSize: '10px', emojiSize: '14px' }
  }
  
  const style = sizeStyles[size]
  
  return (
    <g>
      {/* Node */}
      <foreignObject
        x={x - style.width/2}
        y={y - style.height/2}
        width={style.width}
        height={style.height}
        className="overflow-visible"
      >
        <div 
          className={cn(
            "w-full h-full rounded-lg border shadow-lg bg-card flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-xl hover:scale-105",
            highlight && "bg-primary text-primary-foreground border-primary",
            status === 'active' && !highlight && "ring-2 ring-green-500 border-green-500 bg-green-50 dark:bg-green-950",
            status === 'planned' && "opacity-70 border-dashed",
            className
          )}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            transform: transform
          }}
        >
          {emoji && (
            <div style={{ fontSize: style.emojiSize }} className="mb-1">
              {emoji}
            </div>
          )}
          <div className="font-semibold leading-tight" style={{ fontSize: style.fontSize }}>
            {label}
          </div>
          {sublabel && (
            <div 
              className={cn(
                "text-muted-foreground leading-tight mt-1",
                highlight && "text-primary-foreground/80"
              )} 
              style={{ fontSize: `${parseInt(style.fontSize) * 0.8}px` }}
            >
              {sublabel}
            </div>
          )}
        </div>
      </foreignObject>
      
      {/* Hover Tooltip */}
      {showTooltip && (details.length > 0 || agents.length > 0) && (
        <foreignObject
          x={x + style.width/2 + 10}
          y={y - style.height/2}
          width={320}
          height="auto"
          className="overflow-visible pointer-events-none"
        >
          <div className="bg-popover border rounded-lg shadow-lg p-4 text-sm max-w-sm">
            <div className="font-semibold mb-2 flex items-center gap-2">
              {emoji} {label}
              {status === 'active' && <Badge variant="secondary" className="text-xs">Active</Badge>}
              {status === 'planned' && <Badge variant="outline" className="text-xs">Planned</Badge>}
            </div>
            
            {details.length > 0 && (
              <div className="space-y-1 mb-3">
                {details.map((detail, i) => (
                  <div key={i} className="text-muted-foreground text-xs">• {detail}</div>
                ))}
              </div>
            )}
            
            {agents.length > 0 && (
              <div>
                <div className="font-medium text-xs mb-1">Agents ({agents.length})</div>
                <div className="grid grid-cols-2 gap-1">
                  {agents.map((agent, i) => (
                    <div key={i} className="text-xs flex items-center gap-1">
                      <span>{agent.emoji}</span>
                      <span className="truncate">{agent.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  )
}

// Connection line
function Connection({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="hsl(var(--border))"
      strokeWidth="2"
      strokeDasharray="none"
    />
  )
}

function OrgChart() {
  const [zoom, setZoom] = useState(0.6)
  const [pan, setPan] = useState({ x: 200, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef()
  
  // Organizational data with positions and details
  const organizationData = {
    // Central Studio (top center)
    centralStudio: {
      x: 2000, y: 200,
      label: "Central Studio",
      sublabel: "The Business Factory",
      emoji: "🏢",
      size: "large",
      highlight: true,
      details: [
        "Digital agency focusing on web/mobile apps, websites, landing pages",
        "Marketing services: social media, branding, SEO",
        "Building universal business management system"
      ]
    },
    
    // C-Suite level
    steve: {
      x: 1700, y: 500,
      label: "Steve",
      sublabel: "Chief of Staff",
      emoji: "🤔",
      size: "default",
      status: "active",
      details: [
        "Orchestration and coordination",
        "Strategic execution",
        "Agent management and oversight",
        "Project delivery"
      ]
    },
    cio: {
      x: 2300, y: 500,
      label: "CIO",
      sublabel: "Chief Improvement Officer", 
      emoji: "🚀",
      size: "default",
      status: "active",
      details: [
        "Security and system optimization", 
        "OpenClaw improvements",
        "Usage tracking and efficiency",
        "Factory innovation"
      ]
    },
    
    // Agency Layer 
    agencyLayer: {
      x: 1200, y: 800,
      label: "Agency Layer",
      sublabel: "CS Internal",
      emoji: "🏠", 
      size: "default",
      details: [
        "Internal Central Studio operations",
        "Business foundation overhead",
        "Internal department growth"
      ]
    },
    agencyFoundation: {
      x: 900, y: 1100,
      label: "Foundation",
      emoji: "🏢",
      size: "small",
      status: "planned",
      details: [
        "Legal & Compliance",
        "HR & People", 
        "Admin & Office"
      ]
    },
    agencyInternal: {
      x: 1500, y: 1100, 
      label: "Internal",
      emoji: "🔧",
      size: "small",
      status: "planned",
      details: [
        "Technical infrastructure",
        "Marketing & lead generation", 
        "Strategy & partnerships"
      ]
    },
    
    // The Factory
    theFactory: {
      x: 2800, y: 800,
      label: "The Factory",
      sublabel: "Operations",
      emoji: "🏭",
      size: "default", 
      details: [
        "Universal business management engine",
        "Can attach to any business (owned or client)",
        "10 departments with AI agents and SOPs"
      ]
    },
    
    // Factory Departments - Row 1
    advisory: {
      x: 2000, y: 1200,
      label: "Advisory Board",
      emoji: "📋",
      size: "small",
      status: "active",
      details: [
        "Strategic oversight & coordination", 
        "6 specialized AI agents",
        "Reviews proposals and major decisions"
      ],
      agents: [
        { name: "Advisory", emoji: "📋" },
        { name: "Financial Analyzer", emoji: "💰" },
        { name: "Innovation Catalyst", emoji: "🚀" },
        { name: "Market Expert", emoji: "📊" },
        { name: "Operations Realist", emoji: "⚙️" }, 
        { name: "Strategic Analyst", emoji: "📈" }
      ]
    },
    investments: {
      x: 1700, y: 1200,
      label: "Investment & Ventures",
      emoji: "💎",
      size: "small",
      status: "active",
      details: [
        "AI-driven trading strategies",
        "Central Studio wealth generation", 
        "Autonomous operations since Mar 2026",
        "Paper trading → Real money transition"
      ],
      agents: [
        { name: "Contrarian Predictor", emoji: "🎯" },
        { name: "Portfolio Manager", emoji: "🏛️" },
        { name: "Investment Control", emoji: "🤖" }
      ]
    },
    finance: {
      x: 2300, y: 1200,
      label: "Finance",
      emoji: "💰",
      size: "small", 
      status: "planned",
      details: [
        "Financial management and reporting",
        "Bookkeeping, invoicing, payments",
        "Budgeting and forecasting"
      ]
    },
    legal: {
      x: 2600, y: 1200,
      label: "Legal",
      emoji: "⚖️", 
      size: "small",
      status: "planned",
      details: [
        "Legal protection and compliance",
        "Contracts and agreements",
        "Risk management"
      ]
    },
    hr: {
      x: 2900, y: 1200,
      label: "HR",
      emoji: "👥",
      size: "small",
      status: "planned", 
      details: [
        "Team management and culture",
        "Recruitment and onboarding",
        "Performance management"
      ]
    },
    admin: {
      x: 3200, y: 1200,
      label: "Admin",
      emoji: "📁",
      size: "small",
      status: "planned",
      details: [
        "Administrative operations", 
        "Documentation and scheduling",
        "Communication and facilities"
      ]
    },
    
    // Factory Departments - Row 2  
    technical: {
      x: 2200, y: 1600,
      label: "Technical",
      emoji: "🔧",
      size: "small",
      status: "active",
      details: [
        "Technology and development", 
        "8 specialized AI agents",
        "Full-stack development capability",
        "BuildOS ready for implementation",
        "React + Supabase + Vercel stack"
      ],
      agents: [
        { name: "Technical Head", emoji: "🔧" },
        { name: "Business Analyst", emoji: "📋" },
        { name: "Backend Specialist", emoji: "⚙️" },
        { name: "Web Specialist", emoji: "🌐" },
        { name: "Mobile Specialist", emoji: "📱" },
        { name: "DevOps Engineer", emoji: "🚀" },
        { name: "QA Engineer", emoji: "🧪" },
        { name: "Integration Specialist", emoji: "🔗" }
      ]
    },
    marketing: {
      x: 2600, y: 1600,
      label: "Marketing", 
      emoji: "📣",
      size: "small",
      status: "active",
      details: [
        "Marketing strategy and execution",
        "4 main agents + SEO sub-department",
        "7 SOPs for social media workflow",
        "Managing Dr Marinus + future clients"
      ],
      agents: [
        { name: "Content", emoji: "✍️" },
        { name: "Monitor", emoji: "👁️" },
        { name: "Reports", emoji: "📊" },
        { name: "Intel", emoji: "🔍" }
      ]
    },
    seo: {
      x: 2300, y: 1900,
      label: "SEO Sub-Dept",
      emoji: "🔍",
      size: "tiny",
      status: "active",
      details: [
        "Search engine optimization",
        "Technical SEO & rankings",
        "LLM visibility monitoring",
        "Client SEO reporting"
      ],
      agents: [
        { name: "SEO Agent", emoji: "🔍" },
        { name: "Ranking Monitor", emoji: "📊" },
        { name: "Report Generator", emoji: "📝" }
      ]
    },
    creative: {
      x: 3000, y: 1600,
      label: "Creative",
      emoji: "🎨", 
      size: "small",
      status: "planned",
      details: [
        "Design and creative services",
        "Brand identity and graphic design",
        "Photography, video, copywriting"
      ]
    },
    clientServices: {
      x: 3400, y: 1600,
      label: "Client Services",
      emoji: "🤝",
      size: "small",
      status: "planned",
      details: [
        "Client relationships and support",
        "Sales and business development", 
        "Account management"
      ]
    },
    production: {
      x: 3800, y: 1600,
      label: "Production",
      emoji: "📦",
      size: "small", 
      status: "planned",
      details: [
        "Project delivery and quality",
        "Project management",
        "Quality control and fulfillment"
      ]
    }
  }

  // Connection lines
  const connections = [
    // Central Studio to C-Suite
    { from: "centralStudio", to: "steve" },
    { from: "centralStudio", to: "cio" },
    
    // C-Suite to main divisions
    { from: "steve", to: "agencyLayer" },
    { from: "cio", to: "theFactory" },
    
    // Agency subdivisions
    { from: "agencyLayer", to: "agencyFoundation" },
    { from: "agencyLayer", to: "agencyInternal" },
    
    // Factory departments row 1
    { from: "theFactory", to: "investments" },
    { from: "theFactory", to: "advisory" },
    { from: "theFactory", to: "finance" },
    { from: "theFactory", to: "legal" },
    { from: "theFactory", to: "hr" },
    { from: "theFactory", to: "admin" },
    
    // Factory departments row 2
    { from: "theFactory", to: "technical" },
    { from: "theFactory", to: "marketing" }, 
    { from: "theFactory", to: "creative" },
    { from: "theFactory", to: "clientServices" },
    { from: "theFactory", to: "production" },
    
    // Sub-departments
    { from: "marketing", to: "seo" }
  ]
  
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    setDragStart({ 
      x: e.clientX - pan.x, 
      y: e.clientY - pan.y 
    })
  }, [pan])
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }, [isDragging, dragStart])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const zoomSpeed = 0.1
    const newZoom = zoom + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)
    setZoom(Math.max(0.2, Math.min(3, newZoom)))
  }, [zoom])
  
  const handleZoomIn = () => setZoom(Math.min(3, zoom + 0.2))
  const handleZoomOut = () => setZoom(Math.max(0.2, zoom - 0.2))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="relative w-full h-[800px] border rounded-lg overflow-auto bg-muted/20">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-card border rounded-lg p-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded ring-2 ring-green-500 bg-green-50" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border bg-card opacity-60 border-dashed" />
            <span>Planned</span>
          </div>
        </div>
        <div className="mt-2 text-muted-foreground">
          🖱️ Click + drag to pan • 🐭 Scroll to zoom • 🎯 Hover for details
        </div>
      </div>
      
      {/* Scrollable Container */}
      <div className="w-full h-full overflow-auto">
        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          width={5000 * zoom}
          height={2500 * zoom}
          className="cursor-move min-w-full min-h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
        {/* Grid background */}
        <defs>
          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="5000" height="3000" fill="url(#grid)" />
        
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const from = organizationData[conn.from]
          const to = organizationData[conn.to]
          return (
            <Connection
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />
          )
        })}
        
        {/* Organizational nodes */}
        {Object.entries(organizationData).map(([key, node]) => (
          <OrgNode key={key} {...node} />
        ))}
        </svg>
      </div>
    </div>
  )
}

export default OrgChart
