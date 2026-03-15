import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function SimpleTestDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('SimpleTestDashboard mounted successfully!')
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control Test</h1>
        <p className="text-muted-foreground">Central Studio Business Factory - Simple Test Version</p>
      </div>

      {/* Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">✅ React App Successfully Loaded</span>
            <span className="text-green-600 text-sm">Component mounted: {mounted ? 'Yes' : 'No'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Test Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Test Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Working</div>
            <p className="text-xs text-muted-foreground">React components loading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Build Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Success</div>
            <p className="text-xs text-muted-foreground">Vite production build</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vercel Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">Static assets served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Next Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Database</div>
            <p className="text-xs text-muted-foreground">Add Supabase connection</p>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SimpleTestDashboard