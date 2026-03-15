import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Bot,
  DollarSign,
  Activity,
  Loader2
} from 'lucide-react'
import { getAgents, getTasks, getUserProfiles, getDepartments, getInvestmentPositions, subscribeToTasks, subscribeToAgents } from '@/lib/supabase'

function Dashboard({ gateway }) {
  const [stats, setStats] = useState(null)
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time subscriptions
    const tasksSubscription = subscribeToTasks((payload) => {
      console.log('Task updated:', payload)
      loadDashboardData() // Refresh data on changes
    })
    
    const agentsSubscription = subscribeToAgents((payload) => {
      console.log('Agent updated:', payload)
      loadDashboardData()
    })

    return () => {
      tasksSubscription?.unsubscribe()
      agentsSubscription?.unsubscribe()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [
        agentsData,
        tasksData, 
        usersData,
        departmentsData,
        investmentData
      ] = await Promise.all([
        getAgents(),
        getTasks(),
        getUserProfiles(),
        getDepartments(),
        getInvestmentPositions()
      ])

      setAgents(agentsData)
      setTasks(tasksData)

      // Calculate stats from real data
      const activeAgents = agentsData.filter(agent => agent.is_active).length
      const totalPortfolioValue = investmentData.reduce((sum, position) => sum + (position.market_value || 0), 0)
      const activeTasks = tasksData.filter(task => task.status === 'in_progress').length
      const activeDepartments = departmentsData.length

      setStats([
        { name: 'Active Agents', value: activeAgents.toString(), icon: Bot, change: `${activeDepartments} departments` },
        { name: 'Investment Portfolio', value: `$${Math.round(totalPortfolioValue).toLocaleString()}`, icon: TrendingUp, change: `${investmentData.length} positions` },
        { name: 'Active Tasks', value: activeTasks.toString(), icon: CheckCircle2, change: `${tasksData.length} total tasks` },
        { name: 'Team Members', value: usersData.length.toString(), icon: Users, change: 'Live database' },
      ])

      setError(null)
    } catch (err) {
      console.error('Dashboard data load error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group agents by department for display
  const agentsByDepartment = agents.reduce((acc, agent) => {
    const deptName = agent.department?.name || 'Unassigned'
    if (!acc[deptName]) {
      acc[deptName] = []
    }
    acc[deptName].push(agent)
    return acc
  }, {})

  // Recent activity from tasks
  const recentActivity = tasks
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5)
    .map(task => ({
      id: task.id,
      type: task.department?.name?.toLowerCase() || 'general',
      message: `${task.title} - ${task.status}`,
      time: new Date(task.updated_at).toLocaleTimeString(),
      status: task.status === 'completed' ? 'success' : 
              task.status === 'in_progress' ? 'info' : 'pending'
    }))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Mission Control dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Database Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry Connection
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground">Central Studio Business Factory Operations</p>
      </div>

      {/* Live Status Indicator */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">🎉 LIVE DATABASE CONNECTED</span>
            <span className="text-green-600 text-sm">Real-time updates active</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Live updates from Factory operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Status
            </CardTitle>
            <CardDescription>Live agent deployment across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(agentsByDepartment).map(([department, departmentAgents]) => (
                <div key={department} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{department} ({departmentAgents.length} agents)</p>
                    <p className="text-xs text-muted-foreground">
                      {departmentAgents.filter(a => a.is_active).length} active
                    </p>
                  </div>
                  <Badge variant="success">
                    Live
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Factory Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
              💰 Investment Dashboard
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
              🏗️ Organization View
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
              ✅ Task Management
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
              👥 Agent Control
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent px-4 py-2">
              📊 Live Analytics
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard