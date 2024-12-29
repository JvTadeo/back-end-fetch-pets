import {Request, Response} from "express-serve-static-core";
import logger from "../utils/logger";
import { AuthService } from "../services/AuthService";
import { CustomError } from "../middlewares/errorMiddleware";

export abstract class BaseController {
    protected abstract loggerContext: string;
    protected supabaseService: AuthService;

    protected constructor() {
        this.supabaseService = new AuthService();
    }

    protected async handleResponse(
        res: Response,
        options: {
            data?: any;
            success: boolean;
            error?: { message: string; status: number };
            message: string;
            entity: string;
        }
    ): Promise<Response<any, Record<string, any>, number>> {
        const { data, success, error, message, entity } = options;

        if (error) {
            logger.error(`[${this.loggerContext}] Error: ${error.message}`);
            return res.status(error.status || 500).json({ error: error.message });
        }

        if (!success) {
            logger.warn(`[${this.loggerContext}] ${entity} not found`);
            return res.status(404).json({ error: `${entity} not found` });
        }

        logger.info(`[${this.loggerContext}] ${message}`);
        return res.status(200).json({ data, message });
    }

    protected async getToken(req: Request): Promise<string> {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new CustomError("Authorization header is missing", 401);
        }
        return authorization.split(' ')[1];
    }

    protected async getUserId(token: string): Promise<number> {
        const { data } = await this.supabaseService.getUser(token)
        return data.id
    }
}
