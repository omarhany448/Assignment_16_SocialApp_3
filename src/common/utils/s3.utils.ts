import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    HeadObjectCommand
} from '@aws-sdk/client-s3'
interface S3UploadFile {
    buffer: Buffer
    originalname: string
    mimetype: string
}
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { s3Client, S3_BUCKET } from '../../config/s3.config.js'

export const uploadAsset = async ({
    file,
    folder = 'assets'
}: {
    file: S3UploadFile
    folder?: string
}) => {
    const key = `${folder}/${randomUUID()}-${file.originalname}`

    await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }))

    return {
        key,
        bucket: S3_BUCKET
    }
}

export const uploadLargeAsset = async ({
    file,
    folder = 'assets'
}: {
    file: S3UploadFile
    folder?: string
}) => {
    const key = `${folder}/${randomUUID()}-${file.originalname}`

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }
    })

    await upload.done()

    return {
        key,
        bucket: S3_BUCKET
    }
}

export const uploadAssets = async ({
    files,
    folder = 'assets'
}: {
    files: S3UploadFile[]
    folder?: string
}) => {
    return await Promise.all(
        files.map(file => uploadAsset({ file, folder }))
    )
}

export const getAsset = async (key: string) => {
    return await s3Client.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    }))
}

export const downloadAsset = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ResponseContentDisposition: 'attachment'
    })

    return await s3Client.send(command)
}

export const getAssetMetadata = async (key: string) => {
    return await s3Client.send(new HeadObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    }))
}

export const deleteAsset = async (key: string) => {
    return await s3Client.send(new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    }))
}

export const deleteAssets = async (keys: string[]) => {
    return await s3Client.send(new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: {
            Objects: keys.map(Key => ({ Key })),
            Quiet: false
        }
    }))
}

export const getPreSignedUploadUrl = async ({
    key,
    contentType,
    expiresIn = 900
}: {
    key: string
    contentType: string
    expiresIn?: number
}) => {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: contentType
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
}

export const getPreSignedDownloadUrl = async ({
    key,
    expiresIn = 900
}: {
    key: string
    expiresIn?: number
}) => {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
}
