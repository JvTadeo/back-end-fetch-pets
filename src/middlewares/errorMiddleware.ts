import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Classe para padronizar erros customizados
export class CustomError extends Error {
    public status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

// Middleware para capturar erros
export const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`Error occurred in ${req.path}: ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
};