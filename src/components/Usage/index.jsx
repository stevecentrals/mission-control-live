import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Zap,
  Clock,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with real API calls
const mockUsageData = {
  totalTokens: 847392,
  totalCost: 12.47,
  cacheHitRate: 0.767,
  agents: [
    { 
      name: 'Steve (Main)', 
      emoji: '🤔', 
      tokens: 534821, 
      cost: 8.32, 
      efficiency: 0.89,
      status: 'active',
      sessions: 127,
      cacheHits: 0.82
    },
    { 
      name: 'CIO', 
      emoji: '🚀', 
      tokens: 45392, 
      cost: 0.67, 
      efficiency: 0.94,
      status: 'active',
      sessions: 3,
      cacheHits: 0.91
    },
    { 
      name: 'Content', 
      emoji: '✍️', 
      tokens: 123456, 
      cost: 1.85, 
      efficiency: 0.76,
      status: 'active',
      sessions: 28,
      cacheHits: 0.73
    },
    { 
      name: 'Monitor', 
      emoji: '👁️', 
      tokens: 67891, 
      cost: 0.95, 
      efficiency: 0.82,
      status: 'idle',
      sessions: 12,
      cacheHits: 0.68
    },
    { 
      name: 'Reports', 
      emoji: '📊', 
      tokens: 45231, 
      cost: 0.43, 
      efficiency: 0.87,
      status: 'active',
      sessions: 8,
      cacheHits: 0.79
    },
    { 
      name: 'Intel', 
      emoji: '🔍', 
      tokens: 30601, 
      cost: 0.25, 
      efficiency: 0.91,
      status: 'idle',
      sessions: 15,
      cacheHits: 0.85
    }
  ],
  timeSeriesData: [
    { date: '2026-02-20', tokens: 145234, cost: 2.13 },
    { date: '2026-02-21', tokens: 234567, cost: 3.45 },
    { date: '2026-02-22', tokens: 178901, cost: 2.89 },
    { date: '2026-02-23', tokens: 156789, cost: 2.34 },
    { date: '2026-02-24', tokens: 131901, cost: 1.66 }
  ]
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

function formatPercentage(decimal) {
  return `${(decimal * 100).toFixed(1)}%`
}

function StatusBadge({ status }) {
  const config = {
    active: { label: 'Active', className: 'bg-green-500' },
    idle: { label: 'Idle', className: 'bg-yellow-500' },
    offline: { label: 'Offline', className: 'bg-gray-500' }
  }
  const { label, className } = config[status] || config.offline
  
  return (
    <Badge className={cn('text-xs text-white', className)}>
      {label}
    </Badge>
  )
}

function UsageOverview({ data, onRefresh }) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalTokens)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.3% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -8.4% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.cacheHitRate)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Excellent efficiency
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.agents.filter(a => a.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {data.agents.length} total agents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Usage Breakdown</h2>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Agent Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Token usage and efficiency by agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.agents.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{agent.emoji}</div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {agent.sessions} sessions • {formatPercentage(agent.cacheHits)} cache hits
                    </div>
                  </div>
                </div>
                <div className="text-right space-x-4">
                  <div className="inline-block">
                    <div className="text-sm font-medium">{formatNumber(agent.tokens)} tokens</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(agent.cost)}</div>
                  </div>
                  <div className="inline-block">
                    <div className="text-sm font-medium">{formatPercentage(agent.efficiency)} efficient</div>
                    <StatusBadge status={agent.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UsageTrends({ data }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>Token usage and costs over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Chart integration coming soon</p>
              <p className="text-sm">Will show token usage trends over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.timeSeriesData.reverse().map((day, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <div className="font-medium">{day.date}</div>
                <div className="text-right">
                  <div className="text-sm">{formatNumber(day.tokens)} tokens</div>
                  <div className="text-sm text-muted-foreground">{formatCurrency(day.cost)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UsageAlerts() {
  const alerts = [
    {
      type: 'warning',
      title: 'High Token Usage',
      description: 'Content agent used 40% more tokens than usual today',
      timestamp: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Cache Performance',
      description: 'Overall cache hit rate improved by 5% this week',
      timestamp: '1 day ago'
    },
    {
      type: 'success',
      title: 'Cost Optimization',
      description: 'Monthly costs reduced by $23 due to better efficiency',
      timestamp: '3 days ago'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Alerts</CardTitle>
          <CardDescription>Notifications about unusual usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={cn(
                "p-4 border rounded-lg",
                alert.type === 'warning' && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
                alert.type === 'info' && "border-blue-500 bg-blue-50 dark:bg-blue-950",
                alert.type === 'success' && "border-green-500 bg-green-50 dark:bg-green-950"
              )}>
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                <div className="text-xs text-muted-foreground mt-2">{alert.timestamp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <div className="font-medium">Enable model caching</div>
                <div className="text-sm text-muted-foreground">Could reduce costs by ~15%</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <div className="font-medium">Optimize agent schedules</div>
                <div className="text-sm text-muted-foreground">Run heavy tasks during off-peak hours</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <PieChart className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <div className="font-medium">Review agent efficiency</div>
                <div className="text-sm text-muted-foreground">Monitor agent is underperforming</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Usage() {
  const [data, setData] = useState(mockUsageData)
  const [loading, setLoading] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    // TODO: Replace with real API call to OpenClaw
    // const response = await fetch('/api/usage')
    // const newData = await response.json()
    // setData(newData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usage & Analytics</h1>
        <p className="text-muted-foreground mt-1">Monitor token usage and costs across all agents</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <UsageOverview data={data} onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <UsageTrends data={data} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <UsageAlerts />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Usage