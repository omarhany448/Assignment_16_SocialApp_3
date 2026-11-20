import { Router } from 'express'
import multer from 'multer'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import * as controller from './media.controller.js'
import { checkS3 } from './s3-health.controller.js'

const router = Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024, files: 10 }
})

router.use(authenticationMiddleware)
router.get('/health/s3', checkS3)
router.post('/upload', upload.single('file'), controller.uploadSingle)
router.post('/upload-large', upload.single('file'), controller.uploadLarge)
router.post('/upload-multiple', upload.array('files', 10), controller.uploadMultiple)
router.get('/:key/metadata', controller.metadata)
router.get('/:key/download', controller.download)
router.delete('/:key', controller.remove)
router.delete('/', controller.removeMany)
router.post('/presigned/upload', controller.presignUpload)
router.get('/presigned/download/:key', controller.presignDownload)
export default router

