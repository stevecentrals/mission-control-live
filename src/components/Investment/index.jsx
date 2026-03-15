import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  Bot,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react'

function Investment() {
  // Mock data - in real implementation, this would come from investment-dashboard.js
  const portfolioData = {
    totalValue: 10000,
    currentCash: 7925,
    currentPositions: 2075,
    pnl: 0,
    pnlPercent: 0.0,
    drawdown: 0.5,
    peakValue: 10050,
    totalTrades: 4,
    winRate: 50.0,
    profitFactor: 1.0,
    largestWin: 50,
    largestLoss: -50
  }

  const recentSignals = [
    {
      market: "Iran March 7 Market",
      signal: "BUY YES",
      strength: "HIGH",
      odds: "3%",
      recommendation: "LARGE Position",
      risk: "Level 4",
      status: "active"
    },
    {
      market: "Iran December Market", 
      signal: "SELL YES",
      strength: "HIGH",
      odds: "56%",
      recommendation: "MEDIUM Position",
      risk: "Level 3",
      status: "active"
    },
    {
      market: "Trump 2024 Election",
      signal: "HOLD",
      strength: "MEDIUM", 
      odds: "27.2%",
      recommendation: "Current Position",
      risk: "Level 2",
      status: "holding"
    }
  ]

  const agentStatus = [
    {
      name: "Portfolio Manager",
      status: "active",
      lastActivity: "Risk monitoring",
      workspace: "~/.openclaw/workspace-portfolio-manager"
    },
    {
      name: "Contrarian Markets",
      status: "active", 
      lastActivity: "Signal generation",
      workspace: "~/.openclaw/workspace-contrarian-markets"
    },
    {
      name: "Investment Control",
      status: "active",
      lastActivity: "Daily automation",
      workspace: "Master coordinator"
    }
  ]

  const autonomousSchedule = [
    {
      task: "Daily Market Scanning",
      frequency: "9:00 AM SAST",
      status: "scheduled",
      cronId: "c06e3017-2767-4150-822b-eef15d48676e"
    },
    {
      task: "Weekly Reports",
      frequency: "Friday 5:00 PM SAST", 
      status: "scheduled",
      cronId: "0e35da6f-7b0e-478c-8ef1-77ffa04b8822"
    },
    {
      task: "Risk Monitoring",
      frequency: "Real-time",
      status: "active",
      cronId: "continuous"
    }
  ]

  const getRiskColor = (risk) => {
    switch(risk) {
      case "Level 1": return "bg-green-500"
      case "Level 2": return "bg-yellow-500" 
      case "Level 3": return "bg-orange-500"
      case "Level 4": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getSignalColor = (signal) => {
    if (signal.includes("BUY")) return "text-green-600 dark:text-green-400"
    if (signal.includes("SELL")) return "text-red-600 dark:text-red-400"
    return "text-blue-600 dark:text-blue-400"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            💰 Investment & Ventures Department
          </h1>
          <p className="text-muted-foreground">Autonomous investment operations & performance monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
          <Activity className="h-4 w-4" />
          <span className="font-medium">FULLY OPERATIONAL</span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.pnlPercent >= 0 ? "+" : ""}${portfolioData.pnl} ({portfolioData.pnlPercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((portfolioData.currentCash/portfolioData.totalValue)*100).toFixed(0)}% Cash</div>
            <p className="text-xs text-muted-foreground">
              ${portfolioData.currentCash.toLocaleString()} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.totalTrades} total trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.drawdown}%</div>
            <p className="text-xs text-muted-foreground">
              Peak: ${portfolioData.peakValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Market Signals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Latest Market Signals
            </CardTitle>
            <CardDescription>AI-generated trading opportunities (March 6, 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignals.map((signal, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{signal.market}</h4>
                      <p className={`text-sm font-medium ${getSignalColor(signal.signal)}`}>
                        {signal.signal}
                      </p>
                    </div>
                    <Badge variant={signal.status === "active" ? "default" : "secondary"}>
                      {signal.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Odds:</span>
                      <span className="ml-2 font-medium">{signal.odds}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Strength:</span>
                      <span className="ml-2 font-medium">{signal.strength}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{signal.recommendation}</span>
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(signal.risk)}`} />
                  </div>
                </div>
              ))}
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
            <CardDescription>Investment department AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentStatus.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.lastActivity}</p>
                    <p className="text-xs text-muted-foreground">{agent.workspace}</p>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Autonomous Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Autonomous Operations Schedule
          </CardTitle>
          <CardDescription>Automated tasks running without human intervention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {autonomousSchedule.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{item.task}</h4>
                  <Badge 
                    variant={item.status === 'active' ? 'success' : 'default'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.frequency}</p>
                {item.cronId !== "continuous" && (
                  <p className="text-xs font-mono text-muted-foreground">
                    Cron: {item.cronId.slice(0, 8)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Management
          </CardTitle>
          <CardDescription>Automated risk controls and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Risk Used</span>
                  <span>1.5% / 2.0%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Position Size Limit</span>
                  <span>4.2% / 5.0%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Drawdown Warning</span>
                  <span>0.5% / 15.0%</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                <span className="text-sm">Emergency Stop</span>
                <Badge variant="secondary" className="text-green-600">Not Triggered</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded">
                <span className="text-sm">Kyle Approval Required</span>
                <Badge variant="outline">Positions &gt;$5K</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                <span className="text-sm">Auto Execute Limit</span>
                <Badge variant="outline">2% Risk Max</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Investment