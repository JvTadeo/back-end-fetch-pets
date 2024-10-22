import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import authRoute from './AuthRoute';
import userRouter from './UserRoute';

const router = Router();
const authController = new AuthController();

router.use('/auth', authRoute);

// Verifica se o usuário está autenticado
router.use(authController.checkAuthMiddleware);

router.use('/user', userRouter);

export default router;