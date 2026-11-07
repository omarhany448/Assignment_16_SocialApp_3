import { Router } from 'express'
import * as authenticationController from './authentication.controller.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import {
    signupSchema,
    confirmEmailSchema
} from './authentication.validation.js'

const router = Router()

router.get('/', authenticationController.test)

router.post(
    '/signup',
    validationMiddleware(signupSchema),
    authenticationController.signup
)

router.patch(
    '/confirm-email',
    validationMiddleware(confirmEmailSchema),
    authenticationController.confirmEmail
)

export default router
