import { Message } from './MessageInterface';

export interface MessageServiceInterface {
    create(message: Message, token: string): Promise<{ data: any; error: any }>;
    get(chat_id: string, token: string, limit: number, offset: number): Promise<{ data: Message[]; error: any }>;
}
