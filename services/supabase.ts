//* Supabase Connect Configuration

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shbiftuambmcrlsvexqg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYmlmdHVhbWJtY3Jsc3ZleHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODcyNjEsImV4cCI6MjA4NTc2MzI2MX0.YwEhFIOOn4lI2Jl8Rn-u9B3p8OI3mJC_KKDDR8TFF-8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
