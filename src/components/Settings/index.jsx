import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'

function Settings({ gateway }) {
  const [url, setUrl] = useState('')
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedUrl = localStorage.getItem('gateway-url') || 'ws://127.0.0.1:18789'
    const storedToken = localStorage.getItem('gateway-token') || ''
    setUrl(storedUrl)
    setToken(storedToken)
  }, [])

  const handleSave = () => {
    localStorage.setItem('gateway-url', url)
    localStorage.setItem('gateway-token', token)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    
    // Reconnect with new settings
    gateway.disconnect()
    setTimeout(() => {
      gateway.connect(url, token)
    }, 100)
  }

  const handleReset = () => {
    const defaultUrl = 'ws://127.0.0.1:18789'
    setUrl(defaultUrl)
    setToken('')
    localStorage.setItem('gateway-url', defaultUrl)
    localStorage.removeItem('gateway-token')
  }

  const copyToken = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your Mission Control connection</p>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {gateway.isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
          <CardDescription>
            {gateway.isConnecting 
              ? 'Connecting to gateway...' 
              : gateway.isConnected 
                ? 'Connected and ready' 
                : 'Not connected to gateway'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge 
            variant={gateway.isConnected ? 'default' : 'destructive'}
            className="text-sm"
          >
            {gateway.isConnecting ? 'Connecting...' : gateway.isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {gateway.error && (
            <p className="text-sm text-destructive mt-2">{gateway.error}</p>
          )}
        </CardContent>
      </Card>

      {/* Gateway Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Gateway Connection</CardTitle>
          <CardDescription>
            Enter your OpenClaw gateway URL and authentication token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gateway-url">Gateway URL</Label>
            <Input
              id="gateway-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://127.0.0.1:18789"
            />
            <p className="text-xs text-muted-foreground">
              Default: ws://127.0.0.1:18789 (local gateway)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateway-token">Authentication Token</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="gateway-token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your gateway token"
                  className="pr-20"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyToken}
                    disabled={!token}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Find your token in ~/.openclaw/openclaw.json under gateway.auth.token
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Connect
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Your gateway token - copy and paste into the field above
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md font-mono text-sm break-all select-all cursor-pointer hover:bg-muted/80" onClick={() => {
            navigator.clipboard.writeText('7970f65a423ad11548e9f433763f284a5cec6305c6c09163')
          }}>
            7970f65a423ad11548e9f433763f284a5cec6305c6c09163
          </div>
          <div className="text-sm space-y-2">
            <p className="font-medium">To connect Mission Control to Steve:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Copy the token above (click to copy)</li>
              <li>Paste it in the Authentication Token field</li>
              <li>Click "Save & Connect"</li>
              <li>Go to Chat tab - you can now talk to Steve!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
