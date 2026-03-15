import { useState } from 'react'
import SimpleTestDashboard from './SimpleTest'
import FullDashboard from './FullDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function Dashboard({ gateway }) {
  const [showFull, setShowFull] = useState(false)

  if (showFull) {
    return <FullDashboard gateway={gateway} />
  }

  return (
    <div className="space-y-6">
      <SimpleTestDashboard />
      
      <div className="px-6">
        <Card>
          <CardHeader>
            <CardTitle>Ready for Full Dashboard</CardTitle>
            <CardDescription>
              The React app is working! Click below to load the full Mission Control with Supabase database connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setShowFull(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🚀 Load Full Mission Control
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard