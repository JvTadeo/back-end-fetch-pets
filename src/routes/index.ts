import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import authRoute from './AuthRoute';
import userRouter from './UserRoute';
import postRouter from "./PostRoute";
import favoriteRouter from './FavoriteRoute';
import messageRouter from './MessageRoute';
import {join} from "node:path";

const router = Router();
const authController = new AuthController();

router.use('/auth', authRoute);
// Verifica se o usuário está autenticado
router.use(authController.checkAuthMiddleware);

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/favorites', favoriteRouter);
router.use('/messages', messageRouter);

export default router;