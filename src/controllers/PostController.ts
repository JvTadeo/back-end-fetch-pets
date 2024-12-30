import { PostService } from "../services/PostService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import multer from "multer";
import {BaseController} from "./BaseController";
import { Post } from "../interfaces/PostInterface";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export class PostController extends BaseController {
    protected loggerContext = "PostController";
    private postService: PostService;

    constructor() {
        super();
        this.postService = new PostService();
        this.getPostById = this.getPostById.bind(this);
        this.getPostsByUser = this.getPostsByUser.bind(this);
        this.getAllPosts = this.getAllPosts.bind(this);
        this.getAdoptedPosts = this.getAdoptedPosts.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.createPost = this.createPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    public async getPostById(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching post by id: ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.postService.getById(id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Post retrieved successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching post: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getPostsByUser(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Fetching posts by user id: ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.postService.getByUserId(id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Posts retrieved successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching posts: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Fetching all posts');
            const token = await this.getToken(req);
            const { data, error } = await this.postService.getAll(token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Posts retrieved successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching posts: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async getAdoptedPosts(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Fetching all adopted posts');
            const token = await this.getToken(req);
            const { id } = req.params;
            const { data, error } = await this.postService.getAdoptedPosts(token, id);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Adopted Posts retrieved successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while fetching posts: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Deleting post by id: ${req.params.id}`);
            const { id } = req.params;
            const token = await this.getToken(req);
            const { data, error } = await this.postService.delete(id, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 404 } : undefined,
                message: 'Post deleted successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while deleting post: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }

    public async createPost(req: Request, res: Response): Promise<void> {
        const token = await this.getToken(req);

        const post : Post = {
            pet_name: req.body.petName,
            sex: req.body.sex,
            species: req.body.species,
            breed: req.body.breed,
            age: req.body.age,
            weight_kg: req.body.weight,
            health_status: req.body.healthStatus,
            behavior: req.body.behavior,
            special_preferences: req.body.specialPreferences,
            opt_in: req.body.isConfirmed,
            image: req.body.image,
            userId: req.body.userId
        }
        const { error} = await this.postService.create(post, token);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        
        res.status(201).json({ message: "Post created successfully"});
    }


    public async updatePost(req: Request, res: Response): Promise<void> {
        try {
            logger.info(`Updating post by id: ${req.params.id}`);
            const post = req.body;
            post.id = req.params.id;
            const token = await this.getToken(req);
            const { data, error } = await this.postService.update(post, token);
            await this.handleResponse(res, {
                data,
                success: !!data && !error,
                error: error ? { message: error.message, status: error.status || 400 } : undefined,
                message: 'Post updated successfully',
                entity: 'Post',
            })
        } catch (err) {
            logger.error(`Unexpected error while updating post: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
    }
}