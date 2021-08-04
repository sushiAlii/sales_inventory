/**
 * lib/supabaseClient.js
 * Helper to initialize the Supabase client.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qddjjvxwyjrrzarshiun.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjg3ODg4NCwiZXhwIjoxOTQyNDU0ODg0fQ.7uHRcFjATbuxJPmxXO8DXQHhXoUriDw2N2-IsdONn6U"

export const supabase = createClient(supabaseUrl, supabaseKey)