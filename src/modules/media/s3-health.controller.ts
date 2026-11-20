import type { Request, Response, NextFunction } from 'express'
import { HeadBucketCommand } from '@aws-sdk/client-s3'
import { s3Client, S3_BUCKET } from '../../config/s3.config.js'
import { successResponse } from '../../common/utils/success.response.js'
import { ErrorException } from '../../common/exceptions/error.exception.js'

export const checkS3 = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!S3_BUCKET) throw new ErrorException('AWS_S3_BUCKET is not configured', 503)
        await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
        res.status(200).json(successResponse({ message: 'S3 bucket connection successful' }))
    } catch (error) { next(error) }
}
