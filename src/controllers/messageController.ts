import { MessageService } from "../services/MessageService";
import { MessageControllerInterface } from "../interfaces/MessageControllerInterface"
import { Request, Response } from "express-serve-static-core";
import logger from "../util/logger";
import { generateChatUUID } from "../util/crypto"


export class MessageController implements MessageControllerInterface {
    private messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    private handleResponse(res: Response, success: boolean, error: any, successMessage: any): void {
        if (error) {
            logger.error(`Error: ${error.message}`);
            res.status(400).json({ error: error.message });
        } else if (!success) {
            logger.warn(`${successMessage} not found`);
            res.status(404).json({ error: `${successMessage} not found` });
        } else {
            logger.info(successMessage);
            res.status(200).json({ message: successMessage });
        }
    }

    private getToken(req: Request): string {
        const authorization = req.headers.authorization;
        if (!authorization) {
            logger.error("Authorization header is missing");
            throw new Error("Authorization header is missing");
        }
        return authorization.split(' ')[1];
    }

    public async getMessages(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching messages for user with id ${req.params.id}`);
        const { chat_id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.messageService.get(chat_id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async sendMessage(req: Request, res: Response): Promise<void> {
        logger.info(`Sending message with id ${req.params.id}`);
        const { sender_id, receiver_id, content } = req.body;
        const token = this.getToken(req);
        const chat_id = generateChatUUID(sender_id, receiver_id);
        const message = { sender_id, receiver_id, content, chat_id }

        const { success, error } = await this.messageService.create(message, token);
        this.handleResponse(res, success, error, 'Message created successfully');
    }
}

