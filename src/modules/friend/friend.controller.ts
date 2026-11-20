import type { Request, Response, NextFunction } from 'express'
import * as service from './friend.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const sendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.sendFriendRequest(req.user!.id, req.body.recipientId)
        res.status(201).json(successResponse({ message: 'Friend request sent', data }))
    } catch (error) { next(error) }
}

export const acceptRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.acceptFriendRequest(String(req.params.requestId), req.user!.id)
        res.status(200).json(successResponse({ message: 'Friend request accepted', data }))
    } catch (error) { next(error) }
}

export const cancelRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.cancelFriendRequest(String(req.params.requestId), req.user!.id)
        res.status(200).json(successResponse({ message: 'Friend request cancelled', data }))
    } catch (error) { next(error) }
}

export const getRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getMyFriendRequests(req.user!.id)
        res.status(200).json(successResponse({ message: 'Friend requests retrieved', data }))
    } catch (error) { next(error) }
}

export const getFriends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getMyFriends(req.user!.id)
        res.status(200).json(successResponse({ message: 'Friends retrieved', data }))
    } catch (error) { next(error) }
}
