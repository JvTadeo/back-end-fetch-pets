import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/:id', userController.getUser);

export default userRouter;