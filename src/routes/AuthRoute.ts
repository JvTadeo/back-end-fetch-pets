import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import upload from '../services/Upload';

const authRouter = Router();
const authController = new AuthController();

authRouter.get('/check', authController.checkAuth);
authRouter.post('/login', authController.signIn);
authRouter.post('/logout', authController.signOut);

authRouter.post('/signup', upload.single('image'), authController.signUp);
authRouter.post('/send-email-password', authController.requestPasswordReset);
authRouter.post('/verify-token', authController.verifyTokenOPT);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/save-image', authController.saveImageToSupabase);

authRouter.put('/update', upload.none(), authController.updateUser);

export default authRouter;