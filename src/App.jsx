import { BrowserRouter as Router } from 'react-router-dom'
import Login from './components/Auth/Login'
import AuthenticatedApp from './AuthenticatedApp'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, userProfile, loading, authError, signIn, signOut, isAuthenticated } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-lg">Loading Mission Control...</span>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={signIn} loading={loading} error={authError} />
  }

  return (
    <Router>
      <AuthenticatedApp 
        user={user} 
        userProfile={userProfile} 
        onSignOut={signOut} 
      />
    </Router>
  )
}

export default App
