import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.get('/check', authController.checkAuth);
authRouter.post('/login', authController.signIn);
authRouter.post('/logout', authController.signOut);
authRouter.post('/send-email-password', authController.requestPasswordReset);
authRouter.post('/verify-token', authController.verifyTokenOPT);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;