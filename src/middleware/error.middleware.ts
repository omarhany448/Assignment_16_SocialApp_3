import type { ErrorRequestHandler } from 'express'
import { ErrorException } from '../common/exceptions/error.exception.js'

export const errorMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode =
        error instanceof ErrorException ? error.statusCode : 500

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error'
    })
}