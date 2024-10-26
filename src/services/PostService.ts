import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Post } from "../models/PostModel";
import logger from "../util/logger";

export class PostService {
    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Post; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching post by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getByUserId(id: string, token: string): Promise<{ data: Post[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('userId', id);

        if (error) {
            logger.error(`Error fetching posts by user id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Post[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select();

        if (error) {
            logger.error('Error fetching all posts, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting post by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(post: Post, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('posts')
            .insert(post);

        if (error) {
            logger.error(`Error creating post, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(post: Post, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('posts')
            .update(post)
            .eq('id', post.id);

        if (error) {
            logger.error(`Error updating post by id: ${post.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    // public async uploadFile(file: File, token: string):  Promise<{ success: boolean; error: any }> {
    //     const supabase = this.createAuthenticatedClient(token);
    //     // Define o caminho para a pasta `postImages`
    //     const filePath = `postImages/${Date.now()}_${file.name}`;
    //
    //     // Faz upload do arquivo no Supabase Storage, dentro de `postImages`
    //     const { data, error } = await supabase.storage
    //         .from('uploads')
    //         .upload(filePath, file);
    //
    //     if (error) throw new Error(`Error uploading file: ${error.message}`);
    //     return data?.path ?? '';
    // }
}