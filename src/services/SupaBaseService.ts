import { Provider } from "@supabase/supabase-js";
import supabase from "../config/SupaBase";

export class SupaBaseService {
    public async signInWithPassword(email: string, password: string) : Promise<{ data: any; error: any }> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    }

    public async signInWithAuth(provider : Provider) : Promise<{ data: any; error: any }> {
        console.log(provider);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        return { data, error };
    }
}