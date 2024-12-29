import { Request, Response } from "express-serve-static-core";
import {BaseController} from "./BaseController";
import logger from "../utils/logger";

export class UserController extends BaseController {
    protected loggerContext = "UserController";

    constructor() {
        super();
        // Use o bind para garantir que o this seja o mesmo dentro do metodo
        this.getUser = this.getUser.bind(this);
    }

    public async getUser(req: Request, res: Response) : Promise<void> {
        try {
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.supabaseService.getUserData(id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'User data retrieved successfully',
                entity: 'User',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching user: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }
}