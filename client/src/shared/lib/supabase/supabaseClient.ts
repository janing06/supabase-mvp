import { config } from '@shared/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = config.supabaseUrl
const supabaseAnonKey = config.supabaseAnonKey

export const client = createClient(supabaseUrl, supabaseAnonKey)
