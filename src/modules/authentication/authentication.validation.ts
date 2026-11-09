import { z } from 'zod'

export const signupSchema = z.object({
    body: z.object({
        firstName: z.string().min(2).max(30),
        lastName: z.string().min(2).max(30),
        email: z.string().email(),
        password: z.string().min(8)
    })
})

export const confirmEmailSchema = z.object({
    body: z.object({
        email: z.string().email(),
        code: z.string().length(6)
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8)
    })
})
