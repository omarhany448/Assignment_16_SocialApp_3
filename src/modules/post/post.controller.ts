import type { Request, Response, NextFunction } from 'express'
import * as postService from './post.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await postService.createPost(req.body, req.user!.id)

        res.status(201).json(
            successResponse({
                message: 'Post created successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await postService.getAllPosts(req.user!.id)

        res.status(200).json(
            successResponse({
                message: 'Posts retrieved successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await postService.getPostById(String(req.params.id))

        res.status(200).json(
            successResponse({
                message: 'Post retrieved successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await postService.updatePost(
            String(req.params.id),
            req.user!.id,
            req.body
        )

        res.status(200).json(
            successResponse({
                message: 'Post updated successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await postService.deletePost(
            String(req.params.id),
            req.user!.id
        )

        res.status(200).json(
            successResponse({
                message: 'Post deleted successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}
