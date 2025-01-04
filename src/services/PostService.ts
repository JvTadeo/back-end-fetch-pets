import { ParsedQs } from "qs";
import {Post} from "../interfaces/PostInterface";
import logger from "../utils/logger";
import {BaseService} from "./BaseService";

export class PostService extends BaseService {

    public async getById(id: string, token: string): Promise<{ data: Post; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const {data, error} = await supabase
            .from('posts')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching post by id: ${id}, error: ${error.message}`);
        }
        return {data, error};
    }

    public async getByUserId(id: string, token: string): Promise<{ data: Post[]; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const {data, error} = await supabase
            .from('posts')
            .select()
            .eq('userId', id);

        if (error) {
            logger.error(`Error fetching posts by user id: ${id}, error: ${error.message}`);
        }
        return {data, error};
    }

    public async getAll(token: string, filters?: ParsedQs): Promise<{ data: Post[]; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        let query = supabase.from('posts').select();

        // Verifica se `filters` possui a propriedade `species` e ela não é nula
        if (filters && 'species' in filters && filters.species !== null) {
            query = query.eq('species', filters.species);
        }

        const { data, error } = await query;

        if (error) {
            logger.error(`Error fetching all posts, error: ${error.message}`);
        }

        return { data, error };
    }



    public async getAdoptedPosts(token: string, uid: string): Promise<{ data: Post[]; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('adopter', uid);

        if (error) {
            logger.error(`Error fetching all adopted posts, error: ${error.message}`);
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ data: Post; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id).select('*')
            .single();
        if (error) {
            logger.error(`Error deleting post by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async create(post: Post, token: string): Promise<{ data: Post; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .insert(post)
            .select('*')
            .single();

        if (error) {
            logger.error(`Error creating post, error: ${error.message}`);
        }
        return { data, error };
    }

    public async update(post: Post, token: string): Promise<{ data: Post; error: any }> {
        const supabase = await this.createAuthenticatedClient(token);

        const { data, error } = await supabase
            .from('posts')
            .update(post)
            .eq('id', post.id).select('*')
            .single();

        if (error) {
            logger.error(`Error updating post by id: ${post.id}, error: ${error.message}`);
        }
        return { data, error };
    }
}