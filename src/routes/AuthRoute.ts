import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.signIn);
authRouter.post('/oauth', authController.signInWithAuth);

export default authRouter;