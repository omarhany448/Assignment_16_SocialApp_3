import type { RequestHandler } from 'express'
import { UnauthorizedException } from '../common/exceptions/error.exception.js'
import { verifyAccessToken } from '../common/security/token.security.js'

export const authenticationMiddleware: RequestHandler = (
    req,
    res,
    next
) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Access token is required')
        }

        const token = authorization.slice(7)
        const payload = verifyAccessToken(token)

        req.user = {
            id: payload.sub
        }

        next()
    } catch (error) {
        next(error)
    }
}
