import type { Request, Response, NextFunction } from 'express'
import * as service from './post-advanced.service.js'
import { successResponse } from '../../common/utils/success.response.js'
import { BadRequestException } from '../../common/exceptions/error.exception.js'

export const createWithAttachments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = (req.files as Express.Multer.File[] | undefined) ?? []
        const content = typeof req.body.content === 'string' ? req.body.content : ''
        const data = await service.createPostWithAttachments(req.user!.id, content, files)
        res.status(201).json(successResponse({ message: 'Post created successfully', data }))
    } catch (error) { next(error) }
}

export const feed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getFriendsFeed(
            req.user!.id,
            Number(req.query.page) || 1,
            Number(req.query.limit) || 20
        )
        res.status(200).json(successResponse({ message: 'Feed retrieved successfully', data }))
    } catch (error) { next(error) }
}

export const mine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getMyPosts(req.user!.id)
        res.status(200).json(successResponse({ message: 'Your posts retrieved successfully', data }))
    } catch (error) { next(error) }
}

export const byId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getPostById(String(req.params.postId))
        res.status(200).json(successResponse({ message: 'Post retrieved successfully', data }))
    } catch (error) { next(error) }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.updatePostContent(String(req.params.postId), req.user!.id, req.body.content)
        res.status(200).json(successResponse({ message: 'Post updated successfully', data }))
    } catch (error) { next(error) }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.softDeletePost(String(req.params.postId), req.user!.id)
        res.status(200).json(successResponse({ message: 'Post deleted successfully', data }))
    } catch (error) { next(error) }
}

export const removeAttachment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const key = typeof req.body.key === 'string' ? req.body.key : ''
        if (!key) throw new BadRequestException('Attachment key is required')
        const data = await service.removePostAttachment(String(req.params.postId), req.user!.id, key)
        res.status(200).json(successResponse({ message: 'Attachment removed successfully', data }))
    } catch (error) { next(error) }
}
