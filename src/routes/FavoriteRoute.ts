import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

favoriteRouter.post('/', favoriteController.createFavorite);
favoriteRouter.delete('/:id', favoriteController.deleteFavorite);
favoriteRouter.get('/:id', favoriteController.getFavoriteById);
favoriteRouter.get('/user/:id', favoriteController.getFavoritesByUser);

export default favoriteRouter;