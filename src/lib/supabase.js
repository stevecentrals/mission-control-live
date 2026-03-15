import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database query functions
export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      organization:organizations(name),
      manager:user_profiles(full_name)
    `)
    .order('name')
  
  if (error) throw error
  return data
}

export const getAgents = async () => {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      *,
      organization:organizations(name),
      department:departments(name)
    `)
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data
}

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      organization:organizations(name),
      department:departments(name),
      assigned_user:user_profiles(full_name),
      assigned_agent:agents(name)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getInvestmentPositions = async () => {
  const { data, error } = await supabase
    .from('investment_positions')
    .select('*')
    .order('last_updated', { ascending: false })
  
  if (error) throw error
  return data
}

export const getUserProfiles = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      organization:organizations(name)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getAuditLogs = async (limit = 50) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      organization:organizations(name),
      user:user_profiles(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export const subscribeToTasks = (callback) => {
  return supabase
    .channel('tasks_channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tasks'
    }, callback)
    .subscribe()
}

export const subscribeToAgents = (callback) => {
  return supabase
    .channel('agents_channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public', 
      table: 'agents'
    }, callback)
    .subscribe()
}

export const subscribeToInvestments = (callback) => {
  return supabase
    .channel('investments_channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'investment_positions'
    }, callback)
    .subscribe()
}