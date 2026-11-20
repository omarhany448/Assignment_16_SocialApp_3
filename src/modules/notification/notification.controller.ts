import type { Request, Response, NextFunction } from 'express'
import * as service from './notification.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const getMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getMyNotifications(req.user!.id)
        res.status(200).json(successResponse({ message: 'Notifications retrieved successfully', data }))
    } catch (error) { next(error) }
}

export const markRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.markNotificationAsRead(String(req.params.notificationId), req.user!.id)
        res.status(200).json(successResponse({ message: 'Notification marked as read', data }))
    } catch (error) { next(error) }
}
