import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  MapPin,
  Users,
  Target,
  Swords,
  Briefcase,
  Lightbulb,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Star,
  Calendar,
  Hash,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import clientsData from '@/data/clients.json'
import MarketingPlanTab from './MarketingPlanTab'
import DocumentationTab from './DocumentationTab'

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: () => <span className="text-lg">📱</span>,
  youtube: () => <span className="text-lg">▶️</span>,
}

function InfoItem({ icon: Icon, label, value, href }) {
  if (!value) return null
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
      {value}
    </a>
  ) : value

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{content}</p>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {Icon && <Icon className="h-8 w-8 text-muted-foreground/50" />}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Tab Components
function OverviewTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          title="Platforms" 
          value={client.social.platforms.length} 
          icon={Globe}
        />
        <StatCard 
          title="Team Size" 
          value={client.team.length}
          icon={Users}
        />
        <StatCard 
          title="Competitors" 
          value={client.competition.competitors.length}
          icon={Swords}
        />
        <StatCard 
          title="Service Categories" 
          value={client.services.categories.length}
          icon={Briefcase}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <SectionCard title="Contact Information" icon={Phone}>
          <div className="space-y-1">
            <InfoItem icon={Globe} label="Website" value={client.overview.website} href={`https://${client.overview.website}`} />
            <InfoItem icon={Phone} label="Phone" value={client.overview.phone} />
            <InfoItem icon={Mail} label="Email" value={client.overview.email} />
            <InfoItem icon={MapPin} label="Locations" value={client.overview.locations} />
            <InfoItem icon={Users} label="Primary Contact" value={client.overview.primaryContact} />
          </div>
        </SectionCard>

        {/* Brand Identity */}
        <SectionCard title="Brand Identity" icon={Lightbulb}>
          <div className="space-y-4">
            {client.brand.tagline && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tagline</p>
                <p className="font-semibold italic">"{client.brand.tagline}"</p>
              </div>
            )}
            {client.brand.voice && (
              <div>
                <p className="text-sm text-muted-foreground">Voice & Tone</p>
                <p className="font-medium">{client.brand.voice}</p>
              </div>
            )}
            {client.brand.style && (
              <div>
                <p className="text-sm text-muted-foreground">Style</p>
                <p className="font-medium">{client.brand.style}</p>
              </div>
            )}
            {client.brand.values.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Core Values</p>
                <div className="flex flex-wrap gap-2">
                  {client.brand.values.map((value, i) => (
                    <Badge key={i} variant="secondary">{value}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Business Info */}
      <SectionCard title="Business Overview" icon={Briefcase}>
        <div className="grid gap-4 md:grid-cols-3">
          {client.overview.industry && (
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">{client.overview.industry}</p>
            </div>
          )}
          {client.overview.type && (
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{client.overview.type}</p>
            </div>
          )}
          {client.overview.size && (
            <div>
              <p className="text-sm text-muted-foreground">Size</p>
              <p className="font-medium">{client.overview.size}</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

function SocialTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Platform Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {client.social.platforms.map((platform, i) => {
          const Icon = platformIcons[platform.name] || Globe
          return (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{platform.name}</p>
                    {platform.handle && (
                      <p className="text-sm text-muted-foreground">{platform.handle}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {platform.followers && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Followers</span>
                      <span className="font-medium">{platform.followers}</span>
                    </div>
                  )}
                  {platform.frequency && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-medium">{platform.frequency}</span>
                    </div>
                  )}
                  {platform.notes && (
                    <p className="text-muted-foreground pt-2 border-t">{platform.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Content That Works */}
        <SectionCard title="Content That Works" icon={TrendingUp}>
          {client.social.contentThatWorks.length > 0 ? (
            <ul className="space-y-2">
              {client.social.contentThatWorks.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No data yet</p>
          )}
        </SectionCard>

        {/* Content Gaps */}
        <SectionCard title="Content Gaps & Opportunities" icon={TrendingDown}>
          {client.social.contentGaps.length > 0 ? (
            <ul className="space-y-2">
              {client.social.contentGaps.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">○</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No data yet</p>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function AudienceTab({ client }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Primary Audience */}
        <SectionCard title="Primary Audience" icon={Target} className="md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {client.audience.primary.demographics && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Demographics</p>
                <p className="font-medium">{client.audience.primary.demographics}</p>
              </div>
            )}
            {client.audience.primary.psychographics && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Psychographics</p>
                <p className="font-medium">{client.audience.primary.psychographics}</p>
              </div>
            )}
            {client.audience.primary.painPoints && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pain Points</p>
                <p className="font-medium">{client.audience.primary.painPoints}</p>
              </div>
            )}
            {client.audience.primary.desires && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Desires</p>
                <p className="font-medium">{client.audience.primary.desires}</p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Secondary Audience */}
        {client.audience.secondary && (
          <SectionCard title="Secondary Audience" icon={Users} className="md:col-span-2">
            <p>{client.audience.secondary}</p>
          </SectionCard>
        )}
      </div>
    </div>
  )
}

function CompetitionTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Competitors Table */}
      <SectionCard title="Competitors" icon={Swords}>
        {client.competition.competitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Competitor</th>
                  <th className="text-left py-3 px-2 font-medium">Strengths</th>
                  <th className="text-left py-3 px-2 font-medium">Weaknesses</th>
                  <th className="text-left py-3 px-2 font-medium">Social Strategy</th>
                </tr>
              </thead>
              <tbody>
                {client.competition.competitors.map((comp, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{comp.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.strengths}</td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.weaknesses}</td>
                    <td className="py-3 px-2 text-muted-foreground">{comp.socialStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">No competitor data yet</p>
        )}
      </SectionCard>

      {/* Competitive Positioning */}
      {client.competition.positioning && (
        <SectionCard title="Competitive Positioning" icon={Target}>
          <p>{client.competition.positioning}</p>
        </SectionCard>
      )}
    </div>
  )
}

function ServicesTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Service Categories */}
      {client.services.categories.length > 0 && (
        <SectionCard title="Service Categories" icon={Briefcase}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {client.services.categories.map((cat, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted">
                <p className="font-semibold">{cat.name}</p>
                <p className="text-2xl font-bold text-primary">{cat.count}</p>
                <p className="text-sm text-muted-foreground">services</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Products */}
      {client.services.products.length > 0 && (
        <SectionCard title="Products & Pricing" icon={FileText}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Product</th>
                  <th className="text-left py-3 px-2 font-medium">Price</th>
                  <th className="text-left py-3 px-2 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {client.services.products.map((product, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{product.name}</td>
                    <td className="py-3 px-2 text-primary font-semibold">{product.price}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  )
}

function TeamTab({ client }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Team Members" icon={Users}>
        {client.team.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {client.team.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No team data yet</p>
        )}
      </SectionCard>
    </div>
  )
}

function StrategyTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Content Pillars */}
      {client.strategy.contentPillars.length > 0 && (
        <SectionCard title="Content Pillars" icon={Lightbulb}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {client.strategy.contentPillars.map((pillar, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">{i + 1}</span>
                  <p className="font-semibold">{pillar.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Hashtags */}
      <SectionCard title="Hashtag Strategy" icon={Hash}>
        <div className="space-y-4">
          {client.strategy.hashtags.branded.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Branded</p>
              <div className="flex flex-wrap gap-2">
                {client.strategy.hashtags.branded.map((tag, i) => (
                  <Badge key={i} variant="default">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          {client.strategy.hashtags.location.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Location</p>
              <div className="flex flex-wrap gap-2">
                {client.strategy.hashtags.location.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          {client.strategy.hashtags.industry.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Industry</p>
              <div className="flex flex-wrap gap-2">
                {client.strategy.hashtags.industry.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Posting Schedule */}
      {client.strategy.postingSchedule.length > 0 && (
        <SectionCard title="Posting Schedule" icon={Calendar}>
          <ul className="space-y-2">
            {client.strategy.postingSchedule.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  )
}

function NotesTab({ client }) {
  return (
    <div className="space-y-6">
      {/* Insights */}
      {client.notes.insights.length > 0 && (
        <SectionCard title="Key Insights" icon={Lightbulb}>
          <ul className="space-y-2">
            {client.notes.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">💡</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Reviews */}
      {client.notes.reviews.length > 0 && (
        <SectionCard title="Reviews & Reputation" icon={Star}>
          <div className="grid gap-4 md:grid-cols-3">
            {client.notes.reviews.map((review, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">{review.platform}</p>
                <p className="text-2xl font-bold text-primary">{review.rating}</p>
                <p className="text-sm text-muted-foreground">{review.count} reviews</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Assets */}
      {client.notes.assets.length > 0 && (
        <SectionCard title="Assets & Resources" icon={FileText}>
          <ul className="space-y-2">
            {client.notes.assets.map((asset, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-muted-foreground">📁</span>
                <span>{asset}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Change Log */}
      {client.notes.changeLog.length > 0 && (
        <SectionCard title="Change Log" icon={Calendar}>
          <div className="space-y-3">
            {client.notes.changeLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-4 text-sm">
                <span className="text-muted-foreground font-mono">{entry.date}</span>
                <span className="flex-1">{entry.change}</span>
                <Badge variant="outline">{entry.by}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}

function ClientDetail() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  
  const client = clientsData.find(c => c.id === clientId)

  if (!client) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Client Not Found</h1>
          <p className="text-muted-foreground mt-2">The client "{clientId}" doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                {client.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {client.overview.industry || 'Industry not specified'}
              {client.lastUpdated && ` • Updated ${client.lastUpdated}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button>Create Content</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {client.id === 'buildos' ? (
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          ) : (
            <TabsTrigger value="plan">Marketing Plan</TabsTrigger>
          )}
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab client={client} />
        </TabsContent>
        {client.id === 'buildos' ? (
          <TabsContent value="documentation">
            <DocumentationTab client={client} />
          </TabsContent>
        ) : (
          <TabsContent value="plan">
            <MarketingPlanTab client={client} />
          </TabsContent>
        )}
        <TabsContent value="social">
          <SocialTab client={client} />
        </TabsContent>
        <TabsContent value="audience">
          <AudienceTab client={client} />
        </TabsContent>
        <TabsContent value="competition">
          <CompetitionTab client={client} />
        </TabsContent>
        <TabsContent value="services">
          <ServicesTab client={client} />
        </TabsContent>
        <TabsContent value="team">
          <TeamTab client={client} />
        </TabsContent>
        <TabsContent value="strategy">
          <StrategyTab client={client} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClientDetail
