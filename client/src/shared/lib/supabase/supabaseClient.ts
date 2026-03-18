import { config } from '@shared/config'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './generated/types'

const supabaseUrl = config.supabaseUrl
const supabaseAnonKey = config.supabaseAnonKey

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
