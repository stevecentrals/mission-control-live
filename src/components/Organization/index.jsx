import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2,
  Factory,
  ChevronDown,
  ChevronRight,
  Target,
  DollarSign,
  Scale,
  Users,
  FolderOpen,
  Wrench,
  Megaphone,
  Palette,
  Handshake,
  Package,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Lock,
  GitBranch,
  List
} from 'lucide-react'
import { cn } from '@/lib/utils'
import OrgChart from './OrgChart'

// Department configuration
const factoryDepartments = [
  {
    id: 'advisory',
    name: 'Advisory Board',
    icon: Target,
    status: 'active',
    description: 'Strategic guidance and business direction',
    subdivisions: ['Business Strategy', 'Financial Advisory', 'Industry Expertise', 'Growth & Scaling', 'Risk & Compliance'],
    agents: [
      { name: 'Advisory', emoji: '📋', role: 'Main coordination agent - strategic oversight', status: 'active' },
      { name: 'Financial Analyzer', emoji: '💰', role: 'ROI assessment, costs, revenue models', status: 'active' },
      { name: 'Innovation Catalyst', emoji: '🚀', role: 'Tech trends, breakthrough opportunities', status: 'active' },
      { name: 'Market Expert', emoji: '📊', role: 'Competition, positioning, demand analysis', status: 'active' },
      { name: 'Operations Realist', emoji: '⚙️', role: 'Implementation feasibility, resources, risks', status: 'active' },
      { name: 'Strategic Analyst', emoji: '📈', role: 'Long-term vision, alignment, priorities', status: 'active' }
    ],
    humans: []
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    icon: DollarSign,
    status: 'planned',
    description: 'Financial management and reporting',
    subdivisions: ['Bookkeeping', 'Invoicing & Payments', 'Financial Reporting', 'Budgeting & Forecasting', 'Tax Compliance'],
    agents: [],
    humans: []
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: Scale,
    status: 'planned',
    description: 'Legal protection and regulatory compliance',
    subdivisions: ['Contracts & Agreements', 'Regulatory Compliance', 'IP & Trademarks', 'Risk Management'],
    agents: [],
    humans: []
  },
  {
    id: 'hr',
    name: 'HR & People',
    icon: Users,
    status: 'planned',
    description: 'Team management and culture',
    subdivisions: ['Recruitment', 'Onboarding', 'Performance Management', 'Payroll', 'Culture & Engagement'],
    agents: [],
    humans: []
  },
  {
    id: 'admin',
    name: 'Admin & Office',
    icon: FolderOpen,
    status: 'planned',
    description: 'Administrative operations',
    subdivisions: ['Documentation', 'Scheduling', 'Communication', 'Facilities'],
    agents: [],
    humans: []
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: Wrench,
    status: 'active',
    description: 'Technology and development',
    subdivisions: ['Web Development', 'Mobile Development', 'Backend Development', 'DevOps & Infrastructure', 'Quality Assurance', 'System Integrations', 'Business Analysis'],
    agents: [
      { name: 'Technical Head', emoji: '🔧', role: 'Department leadership, architecture decisions', status: 'active' },
      { name: 'Business Analyst', emoji: '📋', role: 'Requirements gathering, specifications', status: 'active' },
      { name: 'Backend Specialist', emoji: '⚙️', role: 'Server-side development, APIs, databases', status: 'active' },
      { name: 'Web Specialist', emoji: '🌐', role: 'React development, web UI/UX', status: 'active' },
      { name: 'Mobile Specialist', emoji: '📱', role: 'React Native, mobile development', status: 'active' },
      { name: 'DevOps Engineer', emoji: '🚀', role: 'Deployment, infrastructure, CI/CD', status: 'active' },
      { name: 'QA Engineer', emoji: '🧪', role: 'Testing, quality assurance', status: 'active' },
      { name: 'Integration Specialist', emoji: '🔗', role: 'Third-party APIs, system integrations', status: 'active' }
    ],
    humans: []
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    status: 'active',
    description: 'Marketing strategy and execution',
    subdivisions: ['Strategy & Planning', 'Content Creation', 'Social Media Management', 'Advertising & Paid Media', 'SEO & Optimization (Sub-Dept)', 'Email Marketing', 'Analytics & Reporting'],
    agents: [
      { name: 'Content Agent', emoji: '✍️', role: 'Content research, ideation, creation', status: 'active' },
      { name: 'Monitor Agent', emoji: '👁️', role: 'Social listening, engagement tracking', status: 'active' },
      { name: 'Reports Agent', emoji: '📊', role: 'Analytics, reporting, insights', status: 'active' },
      { name: 'Intel Agent', emoji: '🔍', role: 'Client research, profiling', status: 'active' },
      { name: 'SEO Agent', emoji: '🔍', role: 'Main optimizer, technical SEO, rankings', status: 'planned', subdept: 'SEO Team' },
      { name: 'Ranking Monitor', emoji: '📊', role: 'Metrics tracking, LLM visibility monitoring', status: 'planned', subdept: 'SEO Team' },
      { name: 'Report Generator', emoji: '📝', role: 'Monthly SEO reports, client communications', status: 'planned', subdept: 'SEO Team' }
    ],
    humans: [],
    sops: [
      'content-research.md',
      'content-ideation.md', 
      'content-creation.md',
      'content-approval.md',
      'posting-scheduling.md',
      'monitoring.md',
      'reporting.md'
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: Palette,
    status: 'planned',
    description: 'Design and creative services',
    subdivisions: ['Brand Identity', 'Graphic Design', 'Photography & Video', 'Copywriting', 'UI/UX Design'],
    agents: [],
    humans: []
  },
  {
    id: 'client-services',
    name: 'Client & Customer Services',
    icon: Handshake,
    status: 'planned',
    description: 'Client relationships and support',
    subdivisions: ['Sales & Business Development', 'Account Management', 'Customer Support', 'Relationship Management'],
    agents: [],
    humans: []
  },
  {
    id: 'production',
    name: 'Production & Delivery',
    icon: Package,
    status: 'planned',
    description: 'Project delivery and quality',
    subdivisions: ['Project Management', 'Quality Control', 'Delivery & Fulfillment', 'Process Improvement'],
    agents: [],
    humans: []
  }
]

// C-Suite configuration
const cSuite = [
  { name: 'Steve', emoji: '🤔', role: 'Chief of Staff - Orchestration, coordination, execution', status: 'active' },
  { name: 'CIO', emoji: '🚀', role: 'Chief Improvement Officer - Security, optimization, innovation', status: 'active' }
]

const agencyFoundation = [
  { name: 'Legal & Compliance', description: 'Central Studio legal matters' },
  { name: 'HR & People', description: 'Central Studio team' },
  { name: 'Admin & Office', description: 'Central Studio administration' }
]

const agencyInternal = [
  { name: 'Technical', description: 'Internal tools, Mission Control, automations' },
  { name: 'Marketing', description: 'Central Studio brand & lead generation' },
  { name: 'Strategy', description: 'Business development, partnerships, vision' }
]

function StatusBadge({ status }) {
  const config = {
    active: { label: 'Active', variant: 'default', className: 'bg-green-500' },
    building: { label: 'Building', variant: 'default', className: 'bg-blue-500' },
    planned: { label: 'Planned', variant: 'secondary', className: '' }
  }
  const { label, className } = config[status] || config.planned
  
  return (
    <Badge className={cn('text-xs', className)}>
      {status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === 'building' && <Clock className="h-3 w-3 mr-1" />}
      {status === 'planned' && <Lock className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  )
}

function DepartmentCard({ dept, isExpanded, onToggle }) {
  const Icon = dept.icon
  
  return (
    <Card className={cn(
      "transition-all",
      dept.status === 'active' && "border-green-500/50 bg-green-500/5",
      isExpanded && "ring-2 ring-primary"
    )}>
      <CardHeader 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              dept.status === 'active' ? "bg-green-500/20" : "bg-muted"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                dept.status === 'active' ? "text-green-600" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {dept.name}
                <StatusBadge status={dept.status} />
              </CardTitle>
              <CardDescription className="text-sm">{dept.description}</CardDescription>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Subdivisions */}
          <div>
            <p className="text-sm font-medium mb-2">Functions</p>
            <div className="flex flex-wrap gap-2">
              {dept.subdivisions.map((sub, i) => (
                <Badge key={i} variant="outline" className="text-xs">{sub}</Badge>
              ))}
            </div>
          </div>
          
          {/* Agents */}
          {dept.agents.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">AI Agents</p>
              <div className="grid gap-2">
                {dept.agents.map((agent, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <span className="text-xl">{agent.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                    <Bot className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* SOPs */}
          {dept.sops && dept.sops.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">SOPs ({dept.sops.length})</p>
              <div className="flex flex-wrap gap-2">
                {dept.sops.map((sop, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono">{sop}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Humans */}
          {dept.humans.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Team Members</p>
              <div className="grid gap-2">
                {dept.humans.map((human, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <User className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-sm">{human.name}</p>
                      <p className="text-xs text-muted-foreground">{human.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty state for planned */}
          {dept.status === 'planned' && dept.agents.length === 0 && dept.humans.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Coming soon</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

function Organization() {
  const [expandedDept, setExpandedDept] = useState('technical')
  const [showAgencyLayer, setShowAgencyLayer] = useState(false)

  const toggleDept = (id) => {
    setExpandedDept(expandedDept === id ? null : id)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground mt-1">The Business Factory — Central Studio's organizational structure</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">10</div>
            <p className="text-sm text-muted-foreground">Factory Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-sm text-muted-foreground">Active Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">20</div>
            <p className="text-sm text-muted-foreground">AI Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">7</div>
            <p className="text-sm text-muted-foreground">SOPs</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Chart vs List view */}
      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chart" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Org Chart
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Detailed View
          </TabsTrigger>
        </TabsList>

        {/* Org Chart Tab */}
        <TabsContent value="chart">
          <OrgChart />
        </TabsContent>

        {/* Detailed List Tab */}
        <TabsContent value="list" className="space-y-8">
          {/* Vision Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Factory className="h-10 w-10 text-primary shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">The Business Factory</h2>
                  <p className="text-muted-foreground">
                    A scalable system that can manage any business. One factory, infinite applications. 
                    Each department is a capability that can be "activated" for any business we manage — 
                    our own ventures or our clients'.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Layer (Collapsible) */}
          <div>
            <Button 
              variant="ghost" 
              className="w-full justify-between mb-4"
              onClick={() => setShowAgencyLayer(!showAgencyLayer)}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">Agency Layer</span>
                <Badge variant="outline">Central Studio Internal</Badge>
              </div>
              {showAgencyLayer ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
            
            {showAgencyLayer && (
              <div className="grid gap-4 md:grid-cols-2 pl-4 border-l-2 border-muted mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">🏢 Business Foundation</CardTitle>
                    <CardDescription>Overhead for running Central Studio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {agencyFoundation.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground text-xs">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">🏠 Internal Departments</CardTitle>
                    <CardDescription>Building & growing Central Studio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {agencyInternal.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground text-xs">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* C-Suite */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">C-Suite</h2>
              <Badge variant="secondary">Central Studio Leadership</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Executive team providing strategic direction and operational oversight.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              {cSuite.map((executive, i) => (
                <Card key={i} className="border-green-500/50 bg-green-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                        {executive.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{executive.name}</p>
                        <p className="text-sm text-muted-foreground">{executive.role}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        <Bot className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* The Factory */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Factory className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">The Factory</h2>
              <Badge>Operations</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Universal business management engine. These departments can be activated for any business under management.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {factoryDepartments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  dept={dept}
                  isExpanded={expandedDept === dept.id}
                  onToggle={() => toggleDept(dept.id)}
                />
              ))}
            </div>
          </div>

          {/* Human Leadership */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Human Leadership</h2>
            <div className="max-w-md">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Kyle</p>
                      <p className="text-sm text-muted-foreground">Director - Strategy, vision, final decisions</p>
                    </div>
                    <Badge className="ml-auto">Human</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Organization
