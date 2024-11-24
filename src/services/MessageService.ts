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
        console.log(chat_id);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat_id)
            .order('created_at', { ascending: true });

        if (error) {
            logger.error(`Error fetching chatId(${chat_id}): message: ${error.message}`);
        }

        console.log(data);
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

    public async getConversations(userId: string, token: string): Promise<{ data: any[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('messages')
            .select('chat_id, sender_id, receiver_id, receiver:messages_receiver_id_fkey(name)')
            .or(`sender_id.eq.${userId}, receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) {
            logger.error(`Error fetching conversations for userId(${userId}): ${error.message}`);
        }

        // Retorna apenas conversas únicas com o nome de outro usuário
        const uniqueChats = data ? data.reduce((acc, curr) => {
            const otherUser = curr.sender_id === userId ? curr.receiver_id : curr.sender_id;
            if (!acc[otherUser]) {
                acc[otherUser] = { chat_id: curr.chat_id, contactId: otherUser, contactName: curr.receiver['name'] };
            }
            return acc;
        }, []) : [];
        return { data: Object.values(uniqueChats), error };
    }
}