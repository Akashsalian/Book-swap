import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mjdlgfaysgownvixndfo.supabase.co";
const SUPABASE_KEY = "sb_publishable_zLRCq3CthdoQWWym35SCfA_hetGhy3W";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
