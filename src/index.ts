import express from 'express'
import authenticationRouter from './modules/authentication/index.js'
import postRouter from './modules/post/index.js'
import commentRouter from './modules/comment/index.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app: express.Application = express()

app.use(express.json())

app.use('/auth', authenticationRouter)
app.use('/posts', postRouter)
app.use('/', commentRouter)

app.use(errorMiddleware)

export default app
