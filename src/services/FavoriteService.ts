import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Favorite } from "../interfaces/FavoriteInterface";
import logger from "../util/logger";

export class FavoriteService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async create(favorite: Favorite, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('postLikes')
            .insert(favorite);

        if (error) {
            logger.error(`Error creating favorite, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('postLikes')
            .delete()
            .eq('id', id);

        if (error) {
            logger.error(`Error deleting favorite, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async getByUserId(id: string, token: string): Promise<{ data: Favorite[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('postLikes')
            .select('*')
            .eq('userId', id);

        if (error) {
            logger.error(`Error getting favorites by user ID, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getById(id: string, token: string): Promise<{ data: Favorite[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('postLikes')
            .select()
            .eq('id', id);

        if (error) {
            logger.error(`Error getting favorites by ID, error: ${error.message}`);
        }
        return { data, error };
    }
}