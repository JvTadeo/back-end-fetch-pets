import { INotification } from '../interfaces/NotificationInterface';
import {UUID} from "node:crypto";

export class Notification implements INotification {
    constructor(
        public id: number,
        public title: string,
        public senderId: UUID,
        public receiverId: UUID,
        public data: string,
        public read: boolean,
        public created_at: Date
    ) {}
}
