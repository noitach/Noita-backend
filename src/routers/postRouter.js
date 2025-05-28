import express from 'express';
import postController, { createPostController } from '../controllers/postController.js';
import { auth } from '../middleware/auth.js';

export function createPostRouter(controller = postController) {
    const router = express.Router();
    router.get('/', controller.getAllPosts);
    router.get('/:id', auth, controller.getPost);
    router.post('/', auth, controller.createPost);
    router.put('/:id', auth, controller.updatePost);
    router.delete('/:id', auth, controller.deletePost);
    return router;
}

export default createPostRouter();
