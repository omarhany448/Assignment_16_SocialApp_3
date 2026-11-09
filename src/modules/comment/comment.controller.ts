import type { Request, Response, NextFunction } from 'express'
import * as commentService from './comment.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await commentService.createComment(
            String(req.params.postId),
            req.user!.id,
            req.body
        )

        res.status(201).json(
            successResponse({
                message: 'Comment created successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await commentService.getPostComments(
            String(req.params.postId)
        )

        res.status(200).json(
            successResponse({
                message: 'Comments retrieved successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await commentService.getCommentById(
            String(req.params.id)
        )

        res.status(200).json(
            successResponse({
                message: 'Comment retrieved successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await commentService.updateComment(
            String(req.params.id),
            req.user!.id,
            req.body
        )

        res.status(200).json(
            successResponse({
                message: 'Comment updated successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await commentService.deleteComment(
            String(req.params.id),
            req.user!.id
        )

        res.status(200).json(
            successResponse({
                message: 'Comment deleted successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}
