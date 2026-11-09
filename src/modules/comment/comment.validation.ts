import { z } from 'zod'

const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)

export const createCommentSchema = z.object({
    params: z.object({
        postId: idSchema
    }),
    body: z.object({
        content: z.string().trim().min(1).max(3000)
    })
})

export const postCommentsSchema = z.object({
    params: z.object({
        postId: idSchema
    })
})

export const commentIdSchema = z.object({
    params: z.object({
        id: idSchema
    })
})

export const updateCommentSchema = z.object({
    params: z.object({
        id: idSchema
    }),
    body: z.object({
        content: z.string().trim().min(1).max(3000)
    })
})
