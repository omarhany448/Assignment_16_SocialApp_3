import { Router } from 'express'
import * as commentController from './comment.controller.js'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import {
    createCommentSchema,
    postCommentsSchema,
    commentIdSchema,
    updateCommentSchema
} from './comment.validation.js'

const router = Router()

router.use(authenticationMiddleware)

router.post(
    '/posts/:postId/comments',
    validationMiddleware(createCommentSchema),
    commentController.createComment
)

router.get(
    '/posts/:postId/comments',
    validationMiddleware(postCommentsSchema),
    commentController.getPostComments
)

router.get(
    '/comments/:id',
    validationMiddleware(commentIdSchema),
    commentController.getCommentById
)

router.patch(
    '/comments/:id',
    validationMiddleware(updateCommentSchema),
    commentController.updateComment
)

router.delete(
    '/comments/:id',
    validationMiddleware(commentIdSchema),
    commentController.deleteComment
)

export default router
