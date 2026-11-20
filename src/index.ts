import express from 'express'
import authenticationRouter from './modules/authentication/index.js'
import postRouter from './modules/post/index.js'
import postAdvancedRouter from './modules/post/post-advanced.routes.js'
import commentRouter from './modules/comment/index.js'
import friendRouter from './modules/friend/index.js'
import notificationRouter from './modules/notification/index.js'
import sessionRouter from './modules/session/index.js'
import mediaRouter from './modules/media/index.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app: express.Application = express()
app.use(express.json({ limit: '2mb' }))

app.use('/auth', authenticationRouter)
app.use('/posts', postRouter)
app.use('/posts', postAdvancedRouter)
app.use('/', commentRouter)
app.use('/friends', friendRouter)
app.use('/notifications', notificationRouter)
app.use('/sessions', sessionRouter)
app.use('/media', mediaRouter)

app.use(errorMiddleware)
export default app

