import { PostService } from "../services/PostService";
import { Request, Response } from "express-serve-static-core";
import logger from "../util/logger";

export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
        this.getPostById = this.getPostById.bind(this);
        this.getPostsByUser = this.getPostsByUser.bind(this);
        this.getAllPosts = this.getAllPosts.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.createPost = this.createPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    private handleResponse(res: Response, success: boolean, error: any, successMessage: string): void {
        if (error) {
            logger.error(`Error: ${error.message}`);
            res.status(400).json({ error: error.message });
        } else if (!success) {
            logger.warn(`${successMessage} not found`);
            res.status(404).json({ error: `${successMessage} not found` });
        } else {
            logger.info(successMessage);
            res.status(200).json({ message: successMessage });
        }
    }

    private getToken(req: Request): string {
        const authorization = req.headers.authorization;
        if (!authorization) {
            logger.error("Authorization header is missing");
            throw new Error("Authorization header is missing");
        }
        return authorization.split(' ')[1];
    }

    public async getPostById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.postService.getById(id, token);
        this.handleResponse(res, !!data, error, 'Post');
    }

    public async getPostsByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching posts by user id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.postService.getByUserId(id, token);
        this.handleResponse(res, !!data, error, 'Posts by User');
    }

    public async getAllPosts(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all posts');
        const token = this.getToken(req);
        const { data, error } = await this.postService.getAll(token);
        this.handleResponse(res, !!data, error, 'Posts');
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.postService.delete(id, token);
        this.handleResponse(res, success, error, 'Post deleted successfully');
    }

    public async createPost(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new post');
        const post = req.body;
        const token = this.getToken(req);
        const { success, error } = await this.postService.create(post, token);
        this.handleResponse(res, success, error, 'Post created successfully');
    }

    public async updatePost(req: Request, res: Response): Promise<void> {
        logger.info(`Updating post by id: ${req.params.id}`);
        const post = req.body;
        post.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.postService.update(post, token);
        this.handleResponse(res, success, error, 'Post updated successfully');
    }
}