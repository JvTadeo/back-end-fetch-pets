import { NotificationService } from "../services/NotificationService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import {BaseController} from "./BaseController";
import {INotification} from "../interfaces/NotificationInterface";

export class NotificationController extends BaseController {
    protected loggerContext = "NotificationController";
    private notificationService: NotificationService;

    constructor() {
        super();
        this.notificationService = new NotificationService();
        this.createNotification = this.createNotification.bind(this);
        this.updateNotification = this.updateNotification.bind(this);
        this.getNotificationById = this.getNotificationById.bind(this);
        this.getNotificationsByUser = this.getNotificationsByUser.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
    }

    public async createNotification(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Adding notification with id ${req.params.id}`);
            const token = await this.getToken(req);
            const notification = req.body as INotification;
            const { data, error } = await this.notificationService.create(notification, token);
            await this.handleResponse(res, {
                data: data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Notification created successfully',
                entity: 'Notification',
            })
        } catch (err) {
            logger.error(`Unexpected error while creating notification: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Removing notification with id ${req.params.id} from favorites`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.notificationService.delete(id, token);
            await this.handleResponse(res, {
                data: data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Notification deleted successfully',
                entity: 'Notification',
            })
        } catch (err) {
            logger.error(`Unexpected error while deleting favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getNotificationsByUser(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching notification for user with id ${req.params.id}`);
            const { id } = req.params;
            const filters = req.query;
            const token = await this.getToken(req);
            const { data, error } = await this.notificationService.getByUserId(id, token, filters);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Notifications retrieved successfully',
                entity: 'Notification',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching notification: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getNotificationById(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching notification with id ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.notificationService.getById(id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Notification retrieved successfully',
                entity: 'Notification',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching notification: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async updateNotification(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Updating notification by id: ${req.params.id}`);
            const notification = req.body;
            notification.id = Number(req.params.id)
            const token = await this.getToken(req);

            const { data, error } = await this.notificationService.update(notification, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 400 } : undefined,
                message: 'Notification updated successfully',
                entity: 'Notification',
            })
        } catch (err) {
            logger.error(`Unexpected error while updating notification: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }
}