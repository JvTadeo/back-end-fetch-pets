import { MessageService } from "../services/MessageService";
import { MessageControllerInterface } from "../interfaces/MessageControllerInterface"
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import { generateChatUUID } from "../utils/generateChatId"
import { validate as isUUID } from 'uuid';
import {BaseController} from "./BaseController";

export class MessageController extends BaseController implements MessageControllerInterface {
    protected loggerContext = "MessageController";
    private messageService: MessageService;

    constructor() {
        super();
        this.messageService = new MessageService();
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getConversations = this.getConversations.bind(this);
    }

    public async getMessages(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching messages for user with id ${req.params.id}`);
            const { chat_id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.messageService.get(chat_id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Messages retrieved successfully',
                entity: 'Message',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching messages: ${err.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Sending message with id ${req.params.id}`);
            const { sender_id, receiver_id, content } = req.body;
            const token = await this.getToken(req);
            const chat_id = generateChatUUID(sender_id, receiver_id);
            const message = { sender_id, receiver_id, content, chat_id }
            const { data, error } = await this.messageService.create(message, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 400 } : undefined,
                message: 'Message sent successfully',
                entity: 'Message',
            })

        } catch (err) {
            logger.error(`Unexpected error while sending message: ${err.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getConversations(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching conversations for user with id ${req.params.id}`);
            const { id: userId } = req.params;
            if (!isUUID(userId)) {
                throw new Error(`invalid input syntax for type uuid: "${userId}"`);
            }
            const token = await this.getToken(req);
            const { data, error } = await this.messageService.getConversations(userId, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Conversations retrieved successfully',
                entity: 'Message',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching conversations: ${err.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

