import { Router } from 'express'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import * as controller from './notification.controller.js'

const router = Router()
router.use(authenticationMiddleware)
router.get('/', controller.getMine)
router.patch('/:notificationId/read', controller.markRead)
export default router
