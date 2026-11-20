import type { Request, Response, NextFunction } from 'express'
import {
    uploadAsset,
    uploadLargeAsset,
    uploadAssets,
    getAssetMetadata,
    downloadAsset,
    deleteAsset,
    deleteAssets,
    getPreSignedUploadUrl,
    getPreSignedDownloadUrl
} from '../../common/utils/s3.utils.js'
import { successResponse } from '../../common/utils/success.response.js'
import { BadRequestException } from '../../common/exceptions/error.exception.js'

export const uploadSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) throw new BadRequestException('File is required')
        const data = await uploadAsset({ file: req.file, folder: 'uploads' })
        res.status(201).json(successResponse({ message: 'Asset uploaded', data }))
    } catch (error) { next(error) }
}

export const uploadLarge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) throw new BadRequestException('File is required')
        const data = await uploadLargeAsset({ file: req.file, folder: 'large-assets' })
        res.status(201).json(successResponse({ message: 'Large asset uploaded', data }))
    } catch (error) { next(error) }
}

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[] | undefined
        if (!files?.length) throw new BadRequestException('At least one file is required')
        const data = await uploadAssets({ files, folder: 'multiple' })
        res.status(201).json(successResponse({ message: 'Assets uploaded', data }))
    } catch (error) { next(error) }
}

export const metadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getAssetMetadata(String(req.params.key))
        res.status(200).json(successResponse({ message: 'Asset metadata retrieved', data }))
    } catch (error) { next(error) }
}

export const download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await downloadAsset(String(req.params.key))
        if (!result.Body) throw new BadRequestException('Asset body is empty')
        res.setHeader('Content-Type', result.ContentType || 'application/octet-stream')
        if (result.ContentLength !== undefined) res.setHeader('Content-Length', result.ContentLength)
        res.setHeader('Content-Disposition', 'attachment')
        const stream = result.Body as NodeJS.ReadableStream
        stream.pipe(res)
    } catch (error) { next(error) }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await deleteAsset(String(req.params.key))
        res.status(200).json(successResponse({ message: 'Asset deleted', data }))
    } catch (error) { next(error) }
}

export const removeMany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await deleteAssets(req.body.keys)
        res.status(200).json(successResponse({ message: 'Assets deleted', data }))
    } catch (error) { next(error) }
}

export const presignUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getPreSignedUploadUrl({
            key: `presigned/${req.user!.id}/${Date.now()}-${req.body.fileName}`,
            contentType: req.body.contentType
        })
        res.status(200).json(successResponse({ message: 'Pre-signed upload URL generated', data }))
    } catch (error) { next(error) }
}

export const presignDownload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getPreSignedDownloadUrl({ key: String(req.params.key) })
        res.status(200).json(successResponse({ message: 'Pre-signed download URL generated', data }))
    } catch (error) { next(error) }
}
