import { Router } from 'express'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import * as controller from './session.controller.js'

const router = Router()
router.use(authenticationMiddleware)
router.post('/', controller.create)
router.get('/', controller.mine)
router.patch('/:sessionId/fcm-token', controller.updateToken)
router.patch('/:sessionId/close', controller.close)
export default router
