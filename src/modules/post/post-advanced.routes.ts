import { Router } from 'express'
import multer from 'multer'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import * as controller from './post-advanced.controller.js'

const router = Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024, files: 10 }
})

router.use(authenticationMiddleware)
router.post('/with-attachments', upload.array('attachments', 10), controller.createWithAttachments)
router.get('/feed', controller.feed)
router.get('/mine', controller.mine)
router.get('/:postId/details', controller.byId)
router.patch('/:postId/content', controller.update)
router.delete('/:postId/attachments', controller.removeAttachment)
router.delete('/:postId/soft', controller.remove)

export default router
