import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  Clock,
  CheckCircle2,
  Send,
  Edit,
  Eye,
  Calendar,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const contentItems = [
  {
    id: 1,
    client: 'Client Alpha',
    platform: 'Instagram',
    type: 'Post',
    status: 'draft',
    title: 'New product launch announcement',
    scheduledFor: null,
    createdAt: '2 hours ago'
  },
  {
    id: 2,
    client: 'Brand Beta',
    platform: 'LinkedIn',
    type: 'Article',
    status: 'review',
    title: 'Industry insights Q1 2026',
    scheduledFor: null,
    createdAt: '1 day ago'
  },
  {
    id: 3,
    client: 'Client Gamma',
    platform: 'Instagram',
    type: 'Reel',
    status: 'approved',
    title: 'Behind the scenes kitchen tour',
    scheduledFor: 'Today, 6:00 PM',
    createdAt: '3 days ago'
  },
  {
    id: 4,
    client: 'Client Alpha',
    platform: 'Facebook',
    type: 'Post',
    status: 'scheduled',
    title: 'Weekend sale announcement',
    scheduledFor: 'Tomorrow, 10:00 AM',
    createdAt: '1 day ago'
  },
  {
    id: 5,
    client: 'Delta Corp',
    platform: 'Twitter',
    type: 'Thread',
    status: 'posted',
    title: 'Market analysis thread',
    scheduledFor: null,
    createdAt: '5 days ago'
  },
]

const statusConfig = {
  draft: { label: 'Draft', color: 'secondary', icon: Edit },
  review: { label: 'In Review', color: 'warning', icon: Eye },
  approved: { label: 'Approved', color: 'info', icon: CheckCircle2 },
  scheduled: { label: 'Scheduled', color: 'success', icon: Clock },
  posted: { label: 'Posted', color: 'default', icon: Send },
}

const tabs = [
  { id: 'all', label: 'All', count: contentItems.length },
  { id: 'draft', label: 'Drafts', count: contentItems.filter(c => c.status === 'draft').length },
  { id: 'review', label: 'Review', count: contentItems.filter(c => c.status === 'review').length },
  { id: 'approved', label: 'Approved', count: contentItems.filter(c => c.status === 'approved').length },
  { id: 'scheduled', label: 'Scheduled', count: contentItems.filter(c => c.status === 'scheduled').length },
  { id: 'posted', label: 'Posted', count: contentItems.filter(c => c.status === 'posted').length },
]

function Content() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredContent = activeTab === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.status === activeTab)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">Manage your content pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {filteredContent.map((item) => {
          const status = statusConfig[item.status]
          const StatusIcon = status.icon

          return (
            <Card key={item.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg bg-muted"
                    )}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.client}</span>
                        <span>•</span>
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.scheduledFor && (
                      <span className="text-sm text-muted-foreground">
                        {item.scheduledFor}
                      </span>
                    )}
                    <Badge variant={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No content in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Content
