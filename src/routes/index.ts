import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import authRoute from './AuthRoute';
import userRouter from './UserRoute';
import postRouter from "./PostRoute";

const router = Router();
const authController = new AuthController();

router.use('/auth', authRoute);
// Verifica se o usuário está autenticado
router.use(authController.checkAuthMiddleware);

router.use('/user', userRouter);
router.use('/posts', postRouter);

export default router;