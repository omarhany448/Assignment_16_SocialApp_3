import { Router } from 'express'
import * as postController from './post.controller.js'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import {
    createPostSchema,
    updatePostSchema,
    postIdSchema
} from './post.validation.js'

const router = Router()

router.use(authenticationMiddleware)

router.post(
    '/',
    validationMiddleware(createPostSchema),
    postController.createPost
)

router.get('/', postController.getAllPosts)

router.get(
    '/:id',
    validationMiddleware(postIdSchema),
    postController.getPostById
)

router.patch(
    '/:id',
    validationMiddleware(updatePostSchema),
    postController.updatePost
)

router.delete(
    '/:id',
    validationMiddleware(postIdSchema),
    postController.deletePost
)

export default router
