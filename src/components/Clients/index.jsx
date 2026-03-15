import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ClientDetail from './ClientDetail'

// Load clients from synced JSON (run `npm run sync:clients` to update)
import clientsData from '@/data/clients.json'
const clients = clientsData

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: () => <span className="text-sm">📱</span>,
}

function ClientList() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your social media clients</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.reduce((acc, c) => acc + c.postsThisWeek, 0)}</div>
            <p className="text-sm text-muted-foreground">Posts This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(clients.flatMap(c => c.platforms)).size}</div>
            <p className="text-sm text-muted-foreground">Platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card 
            key={client.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription>{client.industry}</CardDescription>
                </div>
                <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platforms */}
              <div className="flex items-center gap-2">
                {client.platforms.map((platform) => {
                  const Icon = platformIcons[platform]
                  return (
                    <div 
                      key={platform}
                      className="p-1.5 rounded bg-muted"
                      title={platform}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </div>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Posts this week</span>
                <span className="font-medium">{client.postsThisWeek}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next post</span>
                <span className="font-medium">{client.nextPost}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Clients() {
  return (
    <Routes>
      <Route path="/" element={<ClientList />} />
      <Route path="/:clientId" element={<ClientDetail />} />
    </Routes>
  )
}

export default Clients
