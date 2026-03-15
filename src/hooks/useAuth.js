import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Session error:', error)
        setAuthError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          organization:organizations(name)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('User profile not found:', error.message)
        // Create a default profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{
            id: userId,
            email: user?.email,
            full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
            role: user?.email === 'kyle@centralstudio.co.za' ? 'super_admin' : 'viewer'
          }])
          .select()
          .single()

        if (createError) {
          console.error('Failed to create user profile:', createError)
          setUserProfile(null)
        } else {
          setUserProfile(newProfile)
        }
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Load profile error:', error)
      setUserProfile(null)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setAuthError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      setAuthError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    setLoading(true)
    setAuthError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      setAuthError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signOut,
    signUp,
    isAuthenticated: !!user
  }
}