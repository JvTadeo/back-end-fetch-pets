import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.signIn);
authRouter.post('/oauth', authController.signInWithAuth);
authRouter.get('/check', authController.checkAuth);

export default authRouter;