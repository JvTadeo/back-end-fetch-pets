import { createClient, SupabaseClient } from "@supabase/supabase-js";
import logger from "../util/logger";
import { Message } from "../interfaces/MessageInterface";
import { MessageServiceInterface } from '../interfaces/MessageServiceInterface';

export class MessageService implements MessageServiceInterface {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async get(chat_id: string, token: string): Promise<{ data: Message[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat_id)
            .order('created_at', { ascending: true });

        if (error) {
            logger.error(`Error fetching chatId(${chat_id}): message: ${error.message}`);
        }
        return { data, error };
    }

    public async create(message: Message, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('messages')
            .insert([message]);

        if (error) {
            logger.error(`Error creating message(${message}): message: ${error.message}`);
        }
        return { success: !error, error };
    }
}