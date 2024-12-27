import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Post } from "../interfaces/PostInterface";
import logger from "../utils/logger";
import { getFilePath } from "./imageService"

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

    // Criar função para deletar imagem após post ser deletado

    public async uploadFile(buffer: Buffer, filePath: string, contentType: string, isImage: boolean = true, token: string): Promise<{ data: any; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        filePath = getFilePath(filePath, isImage)
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, buffer, {
                contentType,
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            logger.error(`Error uploading file to Supabase: ${error.message}`);
        }
        logger.info(`Success a storage image: ${data}`);
        return { data, error };
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

    public async getAdoptedPosts(token: string, uid: string): Promise<{ data: Post[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('adopter', uid);

        if (error) {
            logger.error('Error fetching all adopted posts, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ data: Post; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
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
        const supabase = this.createAuthenticatedClient(token);
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
        const supabase = this.createAuthenticatedClient(token);
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