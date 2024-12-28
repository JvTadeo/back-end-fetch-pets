import { Favorite } from "../interfaces/FavoriteInterface";
import logger from "../utils/logger";
import {FavoriteServiceInterface} from "../interfaces/FavoriteServiceInterface";
import {BaseService} from "./BaseService";

export class FavoriteService extends BaseService implements FavoriteServiceInterface {

    public async create(favorite: Favorite, token: string): Promise<{ data: Favorite; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('postLikes')
            .insert(favorite)
            .select('*')
            .single();

        if (error) {
            logger.error(`Error creating favorite, error: ${error.message}`);
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ data: Favorite; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('postLikes')
            .delete()
            .eq('id', id).select('*')
            .single();

        if (error) {
            logger.error(`Error deleting favorite, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getByUserId(id: string, token: string): Promise<{ data: Favorite[]; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
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
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('postLikes')
            .select()
            .eq('id', id);

        console.log(data);

        if (error) {
            logger.error(`Error getting favorites by ID, error: ${error.message}`);
        }
        return { data, error };
    }
}