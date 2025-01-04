import { Router } from 'express';
import {NotificationController} from "../controllers/NotificationController";

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.post('/', notificationController.createNotification);
notificationRouter.get('/:id', notificationController.getNotificationById);
notificationRouter.patch('/:id', notificationController.updateNotification);
notificationRouter.delete('/:id', notificationController.deleteNotification);
notificationRouter.get('/user/:id', notificationController.getNotificationsByUser);
export default notificationRouter;