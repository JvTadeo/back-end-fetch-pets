import { Request, Response } from 'express';

export interface MessageControllerInterface {
    sendMessage(req: Request, res: Response): Promise<void>;
    getMessages(req: Request, res: Response): Promise<void>;
}
