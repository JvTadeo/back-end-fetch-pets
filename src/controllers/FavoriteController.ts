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
        this.getByUser = this.getByUser.bind(this);
        this.delete = this.delete.bind(this);
    }

    public async create(req: Request, res: Response): Promise<void> {
        logger.info(`Adding post with id ${req.params.id} to favorites`);
        const { postId } = req.body;
        const token = await this.getToken(req);
        const userId = await this.getUserId(token)
        const favorite = {created_at: new Date(), postId: Number(postId), userId: userId}
        const { data, error } = await this.favoriteService.create(favorite, token);
        await this.handleResponse(res, data, !!data, error, 'Post added to favorites');
    }

    public async delete(req: Request, res: Response): Promise<void> {
        logger.info(`Removing post with id ${req.params.id} from favorites`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.favoriteService.delete(id, token);
        await this.handleResponse(res, data, !!data, error, 'Post removed from favorites');
    }

    public async getByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching favorites for user with id ${req.params.id}`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.favoriteService.getByUserId(id, token);
        await this.handleResponse(res, data, !!data, error, 'Favorites retrieved successfully');
    }

    public async getById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching favorite with id ${req.params.id}`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.favoriteService.getById(id, token);
        await this.handleResponse(res, data, !!data, error, 'Favorite retrieved successfully');
    }
}