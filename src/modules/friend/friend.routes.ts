import { Router } from 'express'
import { authenticationMiddleware } from '../../middleware/authentication.middleware.js'
import * as controller from './friend.controller.js'

const router = Router()
router.use(authenticationMiddleware)
router.post('/requests', controller.sendRequest)
router.get('/requests', controller.getRequests)
router.patch('/requests/:requestId/accept', controller.acceptRequest)
router.patch('/requests/:requestId/cancel', controller.cancelRequest)
router.get('/', controller.getFriends)
export default router
