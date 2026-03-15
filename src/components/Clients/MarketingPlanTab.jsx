import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target,
  Calendar,
  TrendingUp,
  CheckSquare,
  Clock,
  AlertTriangle,
  Users,
  Eye,
  BarChart,
  Search,
  Instagram,
  Facebook,
  Linkedin,
  FileText,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

// Load marketing plans from synced JSON
import marketingPlansData from '@/data/marketing-plans.json'

function getMarketingPlan(clientId) {
  // First try to load from real data
  const realPlan = marketingPlansData.find(plan => plan.clientId === clientId)
  
  if (realPlan) {
    // Use real data but enhance with mock data for missing sections
    // This is a hybrid approach until the parser is fully working
    return {
      ...realPlan,
      status: realPlan.status.includes('approval') ? 'draft' : realPlan.status,
      
      objectives: {
        primary: [
          { goal: 'Instagram Growth', target: 'Increase from 170 to 500 followers (+194% growth)', status: 'in-progress' },
          { goal: 'Video Content Launch', target: 'Implement weekly video content across platforms', status: 'starting' },
          { goal: 'Summer Tourism Capture', target: 'Develop aesthetic/wellness campaigns', status: 'planned' }
        ]
      },
      
      kpis: [
        { metric: 'Instagram Followers', current: 170, target: 500, platform: 'Instagram', progress: 34 },
        { metric: 'Instagram Engagement Rate', current: 'TBD', target: '4%+', platform: 'Instagram', progress: 0 },
        { metric: 'Video Content Views', current: 0, target: '1,000/month', platform: 'All platforms', progress: 0 },
        { metric: 'Aesthetic Inquiries', current: 'TBD', target: '+50%', platform: 'All platforms', progress: 0 },
      ],
      
      platformStrategy: [
        { platform: 'Instagram', priority: 'HIGH', frequency: '5x per week', focus: 'Growth & Video', kpi: 'Followers + Engagement' },
        { platform: 'Facebook', priority: 'High', frequency: '3-4x per week', focus: 'Maintain & Convert', kpi: 'Engagement + Leads' },
        { platform: 'LinkedIn', priority: 'Medium', frequency: '1x per week', focus: 'Professional Presence', kpi: 'Professional inquiries' },
      ],
      
      contentPillars: [
        { pillar: 'Health Education', percentage: 30, frequency: '3x/week' },
        { pillar: 'Meet the Team', percentage: 25, frequency: '2x/week' },
        { pillar: 'Aesthetic Results', percentage: 20, frequency: '2x/week' },
        { pillar: 'Community Connection', percentage: 15, frequency: '1x/week' },
        { pillar: 'Services/Promotional', percentage: 10, frequency: '1x/week' },
      ],
      
      currentTasks: {
        content: [
          { task: 'Create complete content queue: 15 Instagram + 12 Facebook + 3 LinkedIn posts', status: 'in-progress', agent: 'Content Agent', due: 'Week 1' },
          { task: 'Develop video content script templates for health education series', status: 'pending', agent: 'Content Agent', due: 'Week 2' },
        ],
        monitor: [
          { task: 'Track Instagram engagement rates and follower growth metrics', status: 'active', agent: 'Monitor Agent', due: 'Daily' },
          { task: 'Analyze top-performing content types and hashtag effectiveness', status: 'pending', agent: 'Monitor Agent', due: 'Weekly' },
        ],
        reports: [
          { task: 'Establish baseline metrics for all platforms', status: 'pending', agent: 'Reports Agent', due: 'Week 1' },
          { task: 'Create Instagram growth tracking dashboard', status: 'pending', agent: 'Reports Agent', due: 'Week 2' },
        ],
        intel: [
          { task: 'Research Instagram growth strategies for medical practices', status: 'pending', agent: 'Intel Agent', due: 'Week 1' },
          { task: 'Analyze successful West Coast aesthetic practice approaches', status: 'pending', agent: 'Intel Agent', due: 'Week 2' },
        ]
      },
      
      activeCampaigns: [
        { name: 'Instagram Growth Sprint', platforms: 'Instagram', startDate: '2026-03-01', endDate: '2026-05-31', goal: '500 followers', status: 'launching' },
        { name: 'Video Content Launch', platforms: 'All platforms', startDate: '2026-03-01', endDate: '2026-03-31', goal: 'Establish video presence', status: 'planning' }
      ],
      
      timeline: {
        'Month 1 (March)': 'Video content system established, Instagram posting 5x/week, baseline metrics captured',
        'Month 2 (April)': 'Instagram follower growth to 300+, first viral video content, summer campaign prep', 
        'Month 3 (May)': 'Instagram 500+ followers, consistent video engagement, summer campaigns live'
      }
    }
  }
  
  // Fallback for other clients - return null to show "No Marketing Plan"
  return null
}

function StatusBadge({ status }) {
  const variants = {
    'active': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'starting': 'bg-yellow-100 text-yellow-800',
    'planned': 'bg-gray-100 text-gray-800',
    'pending': 'bg-orange-100 text-orange-800',
    'launching': 'bg-purple-100 text-purple-800',
    'planning': 'bg-indigo-100 text-indigo-800'
  }
  
  return (
    <Badge className={`${variants[status] || variants.pending}`}>
      {status}
    </Badge>
  )
}

function PriorityBadge({ priority }) {
  const variants = {
    'HIGH': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800', 
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-gray-100 text-gray-800'
  }
  
  return (
    <Badge className={`${variants[priority] || variants.Medium}`}>
      {priority}
    </Badge>
  )
}

function AgentIcon({ agent }) {
  const icons = {
    'Content Agent': '✍️',
    'Monitor Agent': '👁️',
    'Reports Agent': '📊', 
    'Intel Agent': '🔍'
  }
  return <span className="text-sm mr-1">{icons[agent] || '🤖'}</span>
}

export default function MarketingPlanTab({ client }) {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load marketing plan for this client
    const marketingPlan = getMarketingPlan(client.id)
    setPlan(marketingPlan)
    setLoading(false)
  }, [client.id])
  
  if (loading) {
    return <div className="p-6">Loading marketing plan...</div>
  }
  
  if (!plan) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Marketing Plan</h3>
        <p className="text-muted-foreground mb-4">This client doesn't have an active marketing plan yet.</p>
        <Button>Create Marketing Plan</Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Marketing Plan - Q2 2026
                <StatusBadge status={plan.status} />
              </CardTitle>
              <CardDescription>
                {plan.period} • Last updated {plan.lastUpdated} • Primary Agent: {plan.primaryAgent}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Full Plan
              </Button>
              <Button size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Update Plan
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Primary Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.objectives.primary.map((obj, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{obj.goal}</h4>
                  <StatusBadge status={obj.status} />
                </div>
                <p className="text-sm text-muted-foreground">{obj.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.kpis.map((kpi, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{kpi.metric}</span>
                  <span className="text-muted-foreground">{kpi.platform}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{kpi.current} → {kpi.target}</span>
                  <span>{kpi.progress}%</span>
                </div>
                <Progress value={kpi.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Platform Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.platformStrategy.map((platform, i) => {
              const icons = { Instagram, Facebook, LinkedIn }
              const Icon = icons[platform.platform]
              
              return (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-5 w-5" />}
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <PriorityBadge priority={platform.priority} />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>📅 {platform.frequency}</div>
                    <div>🎯 {platform.focus}</div>
                    <div>📊 {platform.kpi}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Pillars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Pillars (80/20 Rule)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {plan.contentPillars.map((pillar, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-500" 
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + (pillar.percentage * 0.01 * 50)}% 0%, ${50 + (pillar.percentage * 0.01 * 50 * Math.cos((pillar.percentage * 0.01 * 2 * Math.PI) - (Math.PI/2)))}% ${50 - (pillar.percentage * 0.01 * 50 * Math.sin((pillar.percentage * 0.01 * 2 * Math.PI) - (Math.PI/2)))}%, 50% 50%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{pillar.percentage}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">{pillar.pillar}</h4>
                  <p className="text-xs text-muted-foreground">{pillar.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Current Agent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content ✍️</TabsTrigger>
              <TabsTrigger value="monitor">Monitor 👁️</TabsTrigger>
              <TabsTrigger value="reports">Reports 📊</TabsTrigger>
              <TabsTrigger value="intel">Intel 🔍</TabsTrigger>
            </TabsList>
            
            {Object.entries(plan.currentTasks).map(([agentType, tasks]) => (
              <TabsContent key={agentType} value={agentType}>
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm">{task.task}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <AgentIcon agent={task.agent} />
                            <span>{task.due}</span>
                          </div>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Timeline & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Success Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(plan.timeline).map(([period, milestone]) => (
              <div key={period} className="space-y-2">
                <h4 className="font-medium text-sm">{period}</h4>
                <p className="text-sm text-muted-foreground">{milestone}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.activeCampaigns.map((campaign, i) => (
              <div key={i} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{campaign.name}</h4>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>🎯 {campaign.goal}</div>
                  <div>📱 {campaign.platforms}</div>
                  <div>📅 {campaign.startDate} - {campaign.endDate}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}