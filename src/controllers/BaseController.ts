import {Request, Response} from "express-serve-static-core";
import logger from "../utils/logger";
import {AuthService} from "../services/AuthService";

export abstract class BaseController {
    protected abstract loggerContext: string;
    protected supaBaseService: AuthService;

    protected constructor() {
        this.supaBaseService = new AuthService();
    }

    protected async handleResponse(
        res: Response,
        data: any,
        success: boolean,
        error: any,
        successMessage: string
    ): Promise<void> {
        if (error) {
            logger.error(`[${this.loggerContext}] Error: ${error.message}`);
            res.status(400).json({ error: error.message });
        } else if (!success) {
            logger.warn(`[${this.loggerContext}] ${successMessage} not found`);
            res.status(404).json({ error: `${successMessage} not found` });
        } else {
            logger.info(`[${this.loggerContext}] ${successMessage}`);
            res.status(200).json({ data, message: successMessage });
        }
    }

    protected async getToken(req: Request): Promise<string> {
        const authorization = req.headers.authorization;
        if (!authorization) {
            logger.error(`[${this.loggerContext}] Authorization header is missing`);
            throw new Error("Authorization header is missing");
        }
        return authorization.split(' ')[1];
    }

    protected async getUserId(token: string): Promise<number> {
        const { data } = await this.supaBaseService.getUser(token)
        return data.user.id
    }
}
