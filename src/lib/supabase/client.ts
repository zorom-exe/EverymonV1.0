
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        // Return null during build/SSG if envs are missing
        // or if the URL is clearly invalid.
        return null;
    }

    try {
        return createBrowserClient(url, key);
    } catch (e) {
        console.error("CRITICAL: Failed to create Supabase client.");
        console.error("URL provided:", url);
        console.error("Key provided:", key?.substring(0, 10) + "...");
        console.error("Error details:", e);
        return null;
    }
}
