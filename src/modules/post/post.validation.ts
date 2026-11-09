import { z } from 'zod'

const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)

export const createPostSchema = z.object({
    body: z.object({
        content: z.string().trim().min(1).max(5000)
    })
})

export const updatePostSchema = z.object({
    params: z.object({
        id: idSchema
    }),
    body: z.object({
        content: z.string().trim().min(1).max(5000)
    })
})

export const postIdSchema = z.object({
    params: z.object({
        id: idSchema
    })
})
