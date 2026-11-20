import type { Request, Response, NextFunction } from 'express'
import * as service from './session.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.storeSession(req.user!.id, req.body)
        res.status(201).json(successResponse({ message: 'Login session stored', data }))
    } catch (error) { next(error) }
}

export const updateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.updateFcmToken(String(req.params.sessionId), req.user!.id, req.body.fcmToken)
        res.status(200).json(successResponse({ message: 'FCM token updated', data }))
    } catch (error) { next(error) }
}

export const close = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.closeSession(String(req.params.sessionId), req.user!.id)
        res.status(200).json(successResponse({ message: 'Session closed', data }))
    } catch (error) { next(error) }
}

export const mine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await service.getMySessions(req.user!.id)
        res.status(200).json(successResponse({ message: 'Sessions retrieved', data }))
    } catch (error) { next(error) }
}
