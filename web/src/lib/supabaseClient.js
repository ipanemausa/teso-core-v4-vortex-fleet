
import { createClient } from '@supabase/supabase-js';

// START CONFIGURATION
// ------------------------------------------------------------------
// To activate the "Infinite Backend", we need your specific keys.
// You can find these in your Supabase Dashboard -> Settings -> API
// ------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have legitimate keys (not placeholders or undefined)
// This allows the app to run in "Simulation Mode" automatically if not configured.
const isValidConfig = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL');

export const supabase = isValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!isValidConfig) {
    console.warn('⚠️ Supabase not configured. App running in Offline/Simulation Mode.');
}
