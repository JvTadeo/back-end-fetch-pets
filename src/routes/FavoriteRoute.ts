import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

favoriteRouter.post('/', favoriteController.create);
favoriteRouter.delete('/:id', favoriteController.delete);
favoriteRouter.get('/:id', favoriteController.getById);
favoriteRouter.get('/post/:id/:userId', favoriteController.getByPostId);
favoriteRouter.get('/user/:id', favoriteController.getByUser);

export default favoriteRouter;