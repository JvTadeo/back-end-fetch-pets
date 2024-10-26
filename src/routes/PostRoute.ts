import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const postRouter = Router();
const postController = new PostController();

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getAllPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.patch('/:id', postController.updatePost)
postRouter.delete('/:id', postController.deletePost);
postRouter.get('/user/:id', postController.getPostsByUser);

export default postRouter;