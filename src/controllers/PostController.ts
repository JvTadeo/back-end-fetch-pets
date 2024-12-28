import { PostService } from "../services/PostService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import multer from "multer";
import { determineFilePath } from "../services/imageService"
import {BaseController} from "./BaseController";

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
        try {
            logger.info('Creating a new post');
            const token = await this.getToken(req);

            // Usa `upload.single` para capturar um único arquivo no campo `file`
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    logger.error(`Error uploading file: ${err.message}`);
                    return res.status(400).json({ error: err.message });
                }

                const post = req.body;
                const file = req.file;

                if (file) {
                    const { buffer, originalname, mimetype } = file;

                    try {
                        const { isImage, filePath } = determineFilePath(mimetype);
                        const { data, error } = await this.postService.uploadFile(buffer, filePath, mimetype, isImage, token);

                        if (error) {
                            logger.error(`Error: ${error.message}`);
                            return res.status(400).json({ error: error.message });
                        }

                        post.file = data.path;
                    } catch (e) {
                        logger.error(`Error uploading file to Supabase: ${e.message}`);
                        return res.status(500).json({ error: 'Error uploading file to storage.' });
                    }
                }

                const { data, error } = await this.postService.create(post, token);

                await this.handleResponse(res, {
                    data,
                    success: !!data && !error,
                    error: error ? { message: error.message, status: error.status || 400 } : undefined,
                    message: 'Post created successfully',
                    entity: 'Post',
                })
            });
        } catch (err) {
            logger.error(`Unexpected error while creating post: ${err.message}`);
            res.status(err.status).json({ error: err.message });
        }
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