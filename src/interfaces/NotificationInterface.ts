import {UUID} from "node:crypto";

export interface INotification {
    id?: number;
    title: string;
    senderId: UUID;
    receiverId: UUID;
    data: string;
    read: boolean;
    created_at: Date;
}
