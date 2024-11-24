import { Router } from 'express';
import { MessageController } from '../controllers/messageController';

const messageRouter = Router();
const messageController = new MessageController();

messageRouter.post('/', messageController.sendMessage);
messageRouter.get('/:chat_id', messageController.getMessages);
messageRouter.get('/conversations/:id', messageController.getConversations);

export default messageRouter;