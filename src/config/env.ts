import dotenv from 'dotenv'

dotenv.config({ path: '.env.development' })

export const env = {
    PORT: Number(process.env.PORT) || 3000,
    MONGO_URI: process.env.DB_URI!,
    REDIS_URL: process.env.REDIS_URI!,
    EMAIL_USER: process.env.APP_EMAIL!,
    EMAIL_PASS: process.env.APP_PASSWORD!,
    ENCRYPTION_KEY: process.env.ENC_KEY!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    AWS_REGION: process.env.AWS_REGION!,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET!
}

