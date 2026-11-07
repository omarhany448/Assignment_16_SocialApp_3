import { z } from 'zod'

export const generalValidationFields = {
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid ID'
    }),

    email: z.string().email({
        message: 'Invalid Email'
    }),

    password: z.string().min(8, {
        message: 'Password must be at least 8 characters'
    }),

    firstName: z.string().min(2).max(30),

    lastName: z.string().min(2).max(30)
}