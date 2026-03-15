import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Lightbulb, 
  PenTool, 
  CheckSquare, 
  Send, 
  BarChart3,
  Eye,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sops = [
  {
    id: 'content-research',
    name: 'Content Research',
    description: 'Trend analysis, competitor review, topic discovery',
    icon: Search,
    status: 'active',
    steps: 5,
    owner: 'Content Agent'
  },
  {
    id: 'content-ideation',
    name: 'Content Ideation',
    description: 'Generate post ideas based on research and brand voice',
    icon: Lightbulb,
    status: 'active',
    steps: 4,
    owner: 'Content Agent'
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Draft posts, create copy, suggest visuals',
    icon: PenTool,
    status: 'active',
    steps: 6,
    owner: 'Content Agent'
  },
  {
    id: 'content-approval',
    name: 'Content Approval',
    description: 'Human review and approval workflow',
    icon: CheckSquare,
    status: 'active',
    steps: 3,
    owner: 'Human'
  },
  {
    id: 'posting-scheduling',
    name: 'Posting & Scheduling',
    description: 'Publish content to platforms at optimal times',
    icon: Send,
    status: 'draft',
    steps: 4,
    owner: 'Content Agent'
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Track engagement, flag issues, respond to comments',
    icon: Eye,
    status: 'draft',
    steps: 5,
    owner: 'Monitoring Agent'
  },
  {
    id: 'reporting',
    name: 'Reporting',
    description: 'Compile analytics and generate reports',
    icon: BarChart3,
    status: 'draft',
    steps: 4,
    owner: 'Reporting Agent'
  },
]

function SOPList() {
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Standard Operating Procedures</h1>
          <p className="text-muted-foreground">Workflows that power your content pipeline</p>
        </div>
        <Button>+ New SOP</Button>
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Pipeline</CardTitle>
          <CardDescription>The journey from idea to published post</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {sops.slice(0, 6).map((sop, index) => (
              <div key={sop.id} className="flex items-center">
                <div 
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors min-w-[100px]",
                    sop.status === 'active' ? "bg-primary/10 hover:bg-primary/20" : "bg-muted hover:bg-muted/80"
                  )}
                  onClick={() => navigate(`/sops/${sop.id}`)}
                >
                  <sop.icon className={cn(
                    "h-6 w-6 mb-2",
                    sop.status === 'active' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-xs font-medium text-center">{sop.name}</span>
                </div>
                {index < 5 && (
                  <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SOP Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sops.map((sop) => (
          <Card 
            key={sop.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/sops/${sop.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-2 rounded-lg",
                  sop.status === 'active' ? "bg-primary/10" : "bg-muted"
                )}>
                  <sop.icon className={cn(
                    "h-5 w-5",
                    sop.status === 'active' ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <Badge variant={sop.status === 'active' ? 'success' : 'secondary'}>
                  {sop.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{sop.name}</CardTitle>
              <CardDescription>{sop.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{sop.steps} steps</span>
                <span>Owner: {sop.owner}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SOPDetail() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">SOP Detail View</h1>
      <p className="text-muted-foreground">Coming soon - detailed step-by-step view</p>
    </div>
  )
}

function SOPs() {
  return (
    <Routes>
      <Route path="/" element={<SOPList />} />
      <Route path="/:sopId" element={<SOPDetail />} />
    </Routes>
  )
}

export default SOPs
