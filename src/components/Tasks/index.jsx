import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { 
  CheckSquare, 
  Square,
  Plus, 
  Clock, 
  User, 
  Tag,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  Filter,
  Calendar,
  Building2,
  FileText,
  Bell,
  BellOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import tasksData from '@/data/tasks.json'
import ReactMarkdown from 'react-markdown'

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'bg-gray-500' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'bg-blue-500' },
  blocked: { label: 'Blocked', icon: AlertCircle, color: 'bg-red-500' },
  done: { label: 'Done', icon: CheckCircle2, color: 'bg-green-500' }
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  high: { label: 'High', color: 'bg-orange-500' },
  urgent: { label: 'Urgent', color: 'bg-red-500' }
}

function TaskList() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(tasksData.tasks)
  const [filter, setFilter] = useState('all')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'my-tasks') return task.assignee === 'kyle'
    if (filter === 'steve-tasks') return task.assignee === 'steve'
    return task.status === filter
  })

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Track and manage work across the team</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setFilter('all')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setFilter('todo')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-500">{stats.todo}</div>
            <div className="text-sm text-muted-foreground">To Do</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setFilter('in-progress')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50" onClick={() => setFilter('done')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">{stats.done}</div>
            <div className="text-sm text-muted-foreground">Done</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'my-tasks' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('my-tasks')}
        >
          👤 Kyle's Tasks
        </Button>
        <Button 
          variant={filter === 'steve-tasks' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('steve-tasks')}
        >
          🤔 Steve's Tasks
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const status = statusConfig[task.status]
          const priority = priorityConfig[task.priority]
          const assignee = tasksData.assignees[task.assignee]
          const completedChecks = task.checklist?.filter(c => c.done).length || 0
          const totalChecks = task.checklist?.length || 0

          return (
            <Card 
              key={task.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={cn("p-2 rounded-full", status.color + '/20')}>
                    <status.icon className={cn("h-5 w-5", status.color.replace('bg-', 'text-'))} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{task.title}</h3>
                      <Badge variant="outline" className={cn("text-xs", priority.color.replace('bg-', 'text-'))}>
                        {priority.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      {assignee && (
                        <span className="flex items-center gap-1">
                          <span>{assignee.emoji}</span>
                          <span>{assignee.name}</span>
                        </span>
                      )}
                      {task.client && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="capitalize">{task.client.replace(/-/g, ' ')}</span>
                        </span>
                      )}
                      {totalChecks > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          <span>{completedChecks}/{totalChecks}</span>
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const task = tasksData.tasks.find(t => t.id === taskId)
  const [checklist, setChecklist] = useState(task?.checklist || [])

  if (!task) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Task not found</p>
            <Button variant="link" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const assignee = tasksData.assignees[task.assignee]
  const createdBy = tasksData.assignees[task.createdBy]

  const toggleCheckItem = (itemId) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, done: !item.done } : item
    ))
  }

  const completedChecks = checklist.filter(c => c.done).length
  const progress = checklist.length > 0 ? (completedChecks / checklist.length) * 100 : 0

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
        ← Back to Tasks
      </Button>

      <div className="flex items-start gap-4 mb-6">
        <div className={cn("p-3 rounded-full", status.color + '/20')}>
          <status.icon className={cn("h-6 w-6", status.color.replace('bg-', 'text-'))} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <Badge className={status.color}>{status.label}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Priority</div>
            <Badge variant="outline" className={priority.color.replace('bg-', 'text-')}>{priority.label}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Assigned To</div>
            <div className="flex items-center gap-2">
              <span>{assignee?.emoji}</span>
              <span className="font-medium">{assignee?.name}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Due Date</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders */}
      {task.reminder && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {task.reminder.enabled ? (
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Bell className="h-5 w-5 text-blue-500" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-gray-500/20">
                    <BellOff className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {task.reminder.enabled ? 'Reminders Active' : 'Reminders Off'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.reminder.enabled 
                      ? `Every ${task.reminder.intervalHours} hours via ${task.reminder.channel}`
                      : 'No reminders scheduled'
                    }
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {task.reminder.lastSent 
                  ? `Last: ${new Date(task.reminder.lastSent).toLocaleString()}`
                  : 'Not sent yet'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {checklist.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Checklist</CardTitle>
              <span className="text-sm text-muted-foreground">{completedChecks}/{checklist.length}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {checklist.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 cursor-pointer"
                  onClick={() => toggleCheckItem(item.id)}
                >
                  {item.done ? (
                    <CheckSquare className="h-5 w-5 text-green-500" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={cn(item.done && "line-through text-muted-foreground")}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {task.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes & Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{task.notes}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-6">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {task.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
        Created by {createdBy?.emoji} {createdBy?.name} on {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  )
}

export default function Tasks() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/:taskId" element={<TaskDetail />} />
    </Routes>
  )
}
