import type { Request, Response, NextFunction } from 'express'
import * as authenticationService from './authentication.service.js'
import { successResponse } from '../../common/utils/success.response.js'

export const test = (
    req: Request,
    res: Response
): void => {
    res.status(200).json({
        message: 'Authentication module is working'
    })
}

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await authenticationService.signup(req.body)

        res.status(201).json(
            successResponse({
                message: 'Account created successfully. Check your email for the verification code.',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}

export const confirmEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await authenticationService.confirmEmail(req.body)

        res.status(200).json(
            successResponse({
                message: 'Email verified successfully',
                data: result
            })
        )
    } catch (error) {
        next(error)
    }
}
