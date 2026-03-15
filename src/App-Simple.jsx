import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar,
  MessageSquare,
  Settings as SettingsIcon,
  BarChart3,
  Moon,
  Sun,
  Network,
  CheckSquare,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Simple components
function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground">Central Studio Business Factory Operations</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold">Active Agents</h3>
          <p className="text-2xl font-bold">18</p>
          <p className="text-xs text-muted-foreground">Multiple departments</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold">Investment Portfolio</h3>
          <p className="text-2xl font-bold">$0</p>
          <p className="text-xs text-muted-foreground">Paused temporarily</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold">Active Tasks</h3>
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">Mission Control deployment</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold">Team Members</h3>
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">Kyle + Steve</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-700 mb-2">✅ Mission Control Status</h3>
        <p className="text-green-600">Dashboard is live and working! Next step: Add proper authentication system.</p>
      </div>
    </div>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">This page is under development.</p>
    </div>
  )
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Organization', href: '/organization', icon: Network },
  { name: 'Investment', href: '/investment', icon: DollarSign },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'SOPs', href: '/sops', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Content', href: '/content', icon: Calendar },
  { name: 'Usage', href: '/usage', icon: BarChart3 },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]

function AppContent() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-2xl mr-3">🏢</span>
          <span className="font-semibold text-lg">Central Studio</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-3">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm font-medium">Kyle Siebert</p>
            <p className="text-xs text-muted-foreground">Admin Access</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization" element={<PlaceholderPage title="Organization" />} />
          <Route path="/investment" element={<PlaceholderPage title="Investment" />} />
          <Route path="/tasks" element={<PlaceholderPage title="Tasks" />} />
          <Route path="/sops" element={<PlaceholderPage title="SOPs" />} />
          <Route path="/clients" element={<PlaceholderPage title="Clients" />} />
          <Route path="/content" element={<PlaceholderPage title="Content" />} />
          <Route path="/usage" element={<PlaceholderPage title="Usage" />} />
          <Route path="/chat" element={<PlaceholderPage title="Chat" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App