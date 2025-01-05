import { FavoriteService } from "../services/FavoriteService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import {BaseController} from "./BaseController";

export class FavoriteController extends BaseController {
    protected loggerContext = "FavoriteController";
    private favoriteService: FavoriteService;

    constructor() {
        super();
        this.favoriteService = new FavoriteService();
        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getByPostIdUserId = this.getByPostIdUserId.bind(this);
        this.getByPostId = this.getByPostId.bind(this);
        this.getByUser = this.getByUser.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Adding post with id ${req.params.id} to favorites`);
            const { postId, userId } = req.body;
            const token = await this.getToken(req);
            const favorite = { created_at: new Date(), postId: Number(postId), userId, };
            const { data, error } = await this.favoriteService.create(favorite, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 400 } : undefined,
                message: 'Post added to favorites successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while adding favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Removing post with id ${req.params.id} from favorites`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.favoriteService.delete(id, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error, // Valida se não houve erro e se os dados estão presentes
                error: error ? { message: error.message, status: error.status || 400 } : undefined,
                message: 'Post removed from favorites successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while removing favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getByUser(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching favorites for user with id ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.favoriteService.getByUserId(id, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Favorites retrieved successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while fetching favorites for user: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching favorite with id ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.favoriteService.getById(id, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Favorite retrieved successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while fetching favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getByPostIdUserId(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching favorite with id ${req.params.id}`);
            const { id, userId } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.favoriteService.getByPostIdUserId(id, userId, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Favorite retrieved successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while fetching favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }
    
    public async getByPostId(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching favorite with id ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.favoriteService.getByPostId(id, token);

            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Favorite retrieved successfully',
                entity: 'Favorite',
            });
        } catch (err) {
            logger.error(`Unexpected error while fetching favorite: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }
}