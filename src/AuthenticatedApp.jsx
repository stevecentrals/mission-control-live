import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
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
  Wifi,
  WifiOff,
  Network,
  CheckSquare,
  DollarSign,
  LogOut,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useGateway } from '@/hooks/useGateway'

// Pages
import Dashboard from '@/components/Dashboard'
import SOPs from '@/components/SOPs'
import Clients from '@/components/Clients'
import Content from '@/components/Content'
import Chat from '@/components/Chat'
import Organization from '@/components/Organization'
import Usage from '@/components/Usage'
import Tasks from '@/components/Tasks'
import Investment from '@/components/Investment'
import Settings from '@/components/Settings'

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

function AuthenticatedApp({ user, userProfile, onSignOut }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  
  const gateway = useGateway()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Auto-connect on mount
  useEffect(() => {
    const token = localStorage.getItem('gateway-token')
    const url = localStorage.getItem('gateway-url') || 'ws://127.0.0.1:18789'
    gateway.connect(url, token)
  }, [])

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
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 bg-accent/50 rounded-md">
            <div className="bg-blue-600 rounded-full p-2 text-white text-sm font-medium">
              {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.role || 'viewer'}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
            gateway.isConnected ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {gateway.isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {gateway.isConnecting ? 'Connecting...' : gateway.isConnected ? 'Connected' : 'Disconnected'}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard gateway={gateway} user={user} userProfile={userProfile} />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/sops/*" element={<SOPs />} />
          <Route path="/clients/*" element={<Clients />} />
          <Route path="/content/*" element={<Content />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/tasks/*" element={<Tasks />} />
          <Route path="/chat" element={<Chat gateway={gateway} />} />
          <Route path="/settings" element={<Settings gateway={gateway} />} />
        </Routes>
      </main>
    </div>
  )
}

export default AuthenticatedApp