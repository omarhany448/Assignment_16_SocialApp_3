
import { Redis } from 'ioredis'
import { env } from '../../config/env.js'

export const redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
})

export const connectRedis = async (): Promise<void> => {
    if (redis.status === 'wait') {
        await redis.connect()
    }

    await redis.ping()

    console.log('Redis connected successfully')
}
