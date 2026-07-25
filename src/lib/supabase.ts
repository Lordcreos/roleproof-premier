import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === "true" || !url || !key;

export const supabase = !isDemoMode && url && key ? createClient(url, key) : null;
