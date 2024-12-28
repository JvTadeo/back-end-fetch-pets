import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class BaseService {

    protected async createAuthenticatedClient(token: string): Promise<SupabaseClient> {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }
}