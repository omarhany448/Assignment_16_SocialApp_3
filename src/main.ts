import app from './index.js'
import { env } from './config/env.js'
import { connectDB } from './DB/connection.db.js'
import { connectRedis } from './common/redis/redis.client.js'

const bootstrap = async (): Promise<void> => {
    await connectDB()
    await connectRedis()

    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`)
    })
}

bootstrap().catch((error: unknown) => {
    console.error('Application failed to start:', error)
    process.exit(1)
})
