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
        this.deletePost = this.deletePost.bind(this);
        this.createPost = this.createPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    public async getPostById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.postService.getById(id, token);
        await this.handleResponse(res, data, !!data, error, "Post retrieved successfully");
    }

    public async getPostsByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching posts by user id: ${req.params.id}`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.postService.getByUserId(id, token);
        await this.handleResponse(res, data, !!data, error, 'User Posts retrieved successfully');
    }

    public async getAllPosts(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all posts');
        const token = await this.getToken(req);
        const { data, error } = await this.postService.getAll(token);
        await this.handleResponse(res, data, !!data, error, 'Posts retrieved successfully');
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = await this.getToken(req);
        const { data, error } = await this.postService.delete(id, token);
        await this.handleResponse(res, data, !!data, error, 'Post deleted successfully');
    }

    public async createPost(req: Request, res: Response): Promise<void> {
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
            await this.handleResponse(res, data, !!data, error, 'Post created successfully');
        });
    }


    public async updatePost(req: Request, res: Response): Promise<void> {
        logger.info(`Updating post by id: ${req.params.id}`);
        const post = req.body;
        post.id = req.params.id;
        const token = await this.getToken(req);
        const { data, error } = await this.postService.update(post, token);
        await this.handleResponse(res, data, !!data, error, 'Post updated successfully');
    }
}