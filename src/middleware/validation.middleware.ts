import type { RequestHandler } from 'express'
import { z } from 'zod'
import { BadRequestException } from '../common/exceptions/error.exception.js'

export const validationMiddleware = (
    schema: z.ZodType
): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        })

        if (!result.success) {
            return next(
                new BadRequestException(
                    'Validation Error',
                    result.error.issues
                )
            )
        }

        next()
    }
}
