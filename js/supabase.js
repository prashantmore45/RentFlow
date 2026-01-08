import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://arnosxogrrgtoznigxsg.supabase.co";
const supabaseKey = "sb_publishable_dHHZc2H_0aQr_kfkjBRE7w_UVekut10";

export const supabase = createClient(supabaseUrl, supabaseKey);
