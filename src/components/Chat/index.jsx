import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send,
  Bot,
  User,
  Loader2,
  Plus,
  X,
  Maximize2,
  Minimize2,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_CHATS = 1  // For now, single session to main agent. Multi-session needs gateway session API.

// Extract text from gateway message
function extractText(message) {
  if (!message) return ''
  const content = message.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .filter(c => c.type === 'text' && typeof c.text === 'string')
      .map(c => c.text)
      .join('\n')
  }
  if (typeof message.text === 'string') return message.text
  return ''
}

// Chat panel component
function ChatPanel({ session, isExpanded, onSend, onRemove, onExpand, onCollapse, isConnected, canRemove }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages, session.stream])

  const handleSend = () => {
    if (!input.trim() || !isConnected) return
    onSend(session.id, input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", isExpanded && "col-span-full row-span-full")}>
      <CardHeader className="py-2 px-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{session.name}</span>
            {session.isTyping && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={isExpanded ? onCollapse : () => onExpand(session.id)}>
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
            {canRemove && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onRemove(session.id)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-2 space-y-2 min-h-0">
        {session.messages.length === 0 && !session.stream && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Chat with Steve</p>
            </div>
          </div>
        )}
        
        {session.messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
            {msg.role === 'assistant' && (
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div className={cn("rounded-lg px-3 py-1.5 max-w-[85%]", msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {session.stream && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-1.5 max-w-[85%]">
              <p className="text-sm whitespace-pre-wrap break-words">{session.stream}</p>
            </div>
          </div>
        )}
        
        {session.isTyping && !session.stream && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-1.5">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-2 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            disabled={!isConnected}
            className="h-8 text-sm"
          />
          <Button onClick={handleSend} disabled={!isConnected || !input.trim()} size="sm" className="h-8 w-8 p-0">
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function EmptySlot({ onAdd, disabled }) {
  return (
    <Card 
      className={cn(
        "flex flex-col items-center justify-center h-full border-dashed cursor-pointer transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50 hover:border-primary"
      )}
      onClick={() => !disabled && onAdd()}
    >
      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">New Chat</p>
    </Card>
  )
}

function Chat({ gateway }) {
  // Use real OpenClaw session key - agent:main:main is the main agent's main session
  const [sessions, setSessions] = useState([
    { id: 'agent:main:main', name: 'Steve', messages: [], stream: '', runId: null, isTyping: false }
  ])
  const [expandedSession, setExpandedSession] = useState(null)
  const sessionCounter = useRef(1)

  // Subscribe to chat events
  useEffect(() => {
    if (!gateway.isConnected) return
    
    const unsubscribe = gateway.onChat((payload) => {
      if (!payload) return
      
      const { sessionKey, state, runId, message } = payload
      
      setSessions(prev => prev.map(session => {
        // Match by sessionKey or by active runId
        const match = session.id === sessionKey || (session.runId && session.runId === runId)
        if (!match) return session
        
        if (state === 'delta') {
          const text = extractText(message)
          return { ...session, stream: text || session.stream, isTyping: true }
        }
        
        if (state === 'final') {
          const text = extractText(message)
          return {
            ...session,
            messages: text ? [...session.messages, { role: 'assistant', content: text }] : session.messages,
            stream: '',
            runId: null,
            isTyping: false
          }
        }
        
        if (state === 'aborted' || state === 'error') {
          const partial = session.stream
          return {
            ...session,
            messages: partial ? [...session.messages, { role: 'assistant', content: partial + '\n[Stopped]' }] : session.messages,
            stream: '',
            runId: null,
            isTyping: false
          }
        }
        
        return session
      }))
    })

    return unsubscribe
  }, [gateway.isConnected, gateway.onChat])

  const sendMessage = useCallback(async (sessionId, message) => {
    if (!gateway.isConnected) return

    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, messages: [...s.messages, { role: 'user', content: message }], runId, stream: '', isTyping: true }
        : s
    ))

    try {
      await gateway.send('chat.send', { 
        sessionKey: sessionId, 
        message,
        idempotencyKey: runId
      })
    } catch (err) {
      console.error('Send failed:', err)
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, isTyping: false, runId: null } : s
      ))
    }
  }, [gateway])

  const addSession = useCallback(() => {
    if (sessions.length >= MAX_CHATS) return
    sessionCounter.current++
    const num = sessionCounter.current
    setSessions(prev => [...prev, {
      id: `mc-session-${num}`,
      name: `Steve #${num}`,
      messages: [],
      stream: '',
      runId: null,
      isTyping: false
    }])
  }, [sessions.length])

  const removeSession = useCallback((id) => {
    if (sessions.length <= 1) return
    setSessions(prev => prev.filter(s => s.id !== id))
    if (expandedSession === id) setExpandedSession(null)
  }, [sessions.length, expandedSession])

  const getGridClass = () => {
    if (expandedSession) return 'grid-cols-1 grid-rows-1'
    const total = Math.min(sessions.length + 1, MAX_CHATS)
    if (total <= 2) return 'grid-cols-2 grid-rows-1'
    if (total <= 4) return 'grid-cols-2 grid-rows-2'
    return 'grid-cols-3 grid-rows-2'
  }

  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Chat with Steve</h1>
            <Badge variant={gateway.isConnected ? 'default' : 'secondary'}>
              {gateway.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{sessions.length} / {MAX_CHATS} chats</div>
        </div>

        <div className={cn("flex-1 grid gap-4 min-h-0", getGridClass())}>
          {expandedSession ? (
            <ChatPanel
              session={sessions.find(s => s.id === expandedSession)}
              isExpanded={true}
              onSend={sendMessage}
              onRemove={removeSession}
              onExpand={setExpandedSession}
              onCollapse={() => setExpandedSession(null)}
              isConnected={gateway.isConnected}
              canRemove={sessions.length > 1}
            />
          ) : (
            <>
              {sessions.map(session => (
                <ChatPanel
                  key={session.id}
                  session={session}
                  isExpanded={false}
                  onSend={sendMessage}
                  onRemove={removeSession}
                  onExpand={setExpandedSession}
                  onCollapse={() => setExpandedSession(null)}
                  isConnected={gateway.isConnected}
                  canRemove={sessions.length > 1}
                />
              ))}
              {sessions.length < MAX_CHATS && (
                <EmptySlot onAdd={addSession} disabled={!gateway.isConnected} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
