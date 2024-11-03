export interface Message {
    id?: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    chat_id: string;
    created_at?: string;
}