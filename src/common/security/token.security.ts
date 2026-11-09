import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '../../config/env.js'
import { UnauthorizedException } from '../exceptions/error.exception.js'

interface TokenPayload {
    sub: string
    exp: number
}

const getSecret = (): string => {
    if (!env.ACCESS_TOKEN_SECRET || env.ACCESS_TOKEN_SECRET.length < 32) {
        throw new Error('ACCESS_TOKEN_SECRET must contain at least 32 characters')
    }

    return env.ACCESS_TOKEN_SECRET
}

export const generateAccessToken = (userId: string): string => {
    const header = Buffer.from(
        JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ).toString('base64url')

    const payload: TokenPayload = {
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + 3600
    }

    const encodedPayload = Buffer.from(
        JSON.stringify(payload)
    ).toString('base64url')

    const data = `${header}.${encodedPayload}`

    const signature = createHmac('sha256', getSecret())
        .update(data)
        .digest('base64url')

    return `${data}.${signature}`
}

export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const parts = token.split('.')

        if (parts.length !== 3) {
            throw new Error()
        }

        const [header, payload, signature] = parts

        if (!header || !payload || !signature) {
            throw new Error()
        }

        const decodedHeader = JSON.parse(
            Buffer.from(header, 'base64url').toString('utf8')
        )

        if (decodedHeader.alg !== 'HS256' || decodedHeader.typ !== 'JWT') {
            throw new Error()
        }

        const data = `${header}.${payload}`

        const expectedSignature = createHmac('sha256', getSecret())
            .update(data)
            .digest()

        const actualSignature = Buffer.from(signature, 'base64url')

        if (
            expectedSignature.length !== actualSignature.length ||
            !timingSafeEqual(expectedSignature, actualSignature)
        ) {
            throw new Error()
        }

        const decodedPayload = JSON.parse(
            Buffer.from(payload, 'base64url').toString('utf8')
        ) as TokenPayload

        if (
            typeof decodedPayload.sub !== 'string' ||
            typeof decodedPayload.exp !== 'number' ||
            decodedPayload.exp <= Math.floor(Date.now() / 1000)
        ) {
            throw new Error()
        }

        return decodedPayload
    } catch {
        throw new UnauthorizedException('Invalid or expired access token')
    }
}
