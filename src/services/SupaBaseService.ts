import { Provider, VerifyOtpParams, UserAttributes } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export class SupaBaseService {

    // Criando um SupaBaseService
    private createAuthenticatedClient(token: string) {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async signInWithPassword(email: string, password: string) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient("");
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    }

    public async signOut(token) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.auth.signOut(token);
        return { data: null, error };
    }

    public async getUserData(id : string, token: string) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient(token);

        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();
        return { data, error };
    }

    public async getUser(token: string) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase.auth.getUser(token);
        return { data, error };
    }

    public async requestPasswordReset(email: string) : Promise<{ error: any }> {
        const supabase = this.createAuthenticatedClient('');
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            return { error };
        }
        return { error: null };
    }

    public async verifyTokenOPT(token: VerifyOtpParams) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient('');

        const { data, error } = await supabase.auth.verifyOtp(token)
        
        return { data, error };
    }

    public async resetPassword(token: string, password: string) : Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient(token);

        const { data, error } = await supabase.auth.updateUser({
        });
        return { data, error };
    }
}