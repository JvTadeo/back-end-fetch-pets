import { FavoriteService } from "../services/FavoriteService";
import { Request, Response } from "express-serve-static-core";
import logger from "../util/logger";
import { AuthService } from "../services/AuthService";

export class FavoriteController {
    private favoriteService: FavoriteService;
    private supaBaseService: AuthService

    constructor() {
        this.favoriteService = new FavoriteService();
        this.supaBaseService = new AuthService();
        this.createFavorite = this.createFavorite.bind(this);
        this.getFavoriteById = this.getFavoriteById.bind(this);
        this.getFavoritesByUser = this.getFavoritesByUser.bind(this);
        this.deleteFavorite = this.deleteFavorite.bind(this);
    }

    private handleResponse(res: Response, data: any, success: boolean, error: any, successMessage: string): void {
        if (error) {
            logger.error(`Error: ${error.message}`);
            res.status(400).json({ error: error.message });
        } else if (!success) {
            logger.warn(`${successMessage} not found`);
            res.status(404).json({ error: `${successMessage} not found` });
        } else {
            logger.info(successMessage);
            res.status(200).json({ favorite: data, message: successMessage });
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

    public async createFavorite(req: Request, res: Response): Promise<void> {
        logger.info(`Adding post with id ${req.params.id} to favorites`);
        const { id } = req.params;
        const token = this.getToken(req);
        const user = await this.supaBaseService.getUser(token)
        const favorite = {created_at: new Date(), postId: Number(id), userId: Number(user.data.id)}
        const { success, error } = await this.favoriteService.create(favorite, token);
        this.handleResponse(res, success, success, error, 'Post added to favorites');
    }

    public async deleteFavorite(req: Request, res: Response): Promise<void> {
        logger.info(`Removing post with id ${req.params.id} from favorites`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.favoriteService.delete(id, token);
        this.handleResponse(res, success, success, error, 'Post removed from favorites');
    }

    public async getFavoritesByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching favorites for user with id ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.favoriteService.getByUserId(id, token);
        this.handleResponse(res, data, !!data, error, 'Favorites retrieved successfully');
    }

    public async getFavoriteById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching favorite with id ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.favoriteService.getById(id, token);
        this.handleResponse(res, data, !!data, error, 'Favorite retrieved successfully');
    }
}