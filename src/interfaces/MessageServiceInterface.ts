import { Message } from './MessageInterface';

export interface MessageServiceInterface {
    create(message: Message, token: string): Promise<{ success: boolean; error: any }>;
    get(chat_id: string, token: string): Promise<{ data: Message[]; error: any }>;
}
