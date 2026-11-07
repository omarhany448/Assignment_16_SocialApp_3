import nodemailer from 'nodemailer'
import { env } from '../../config/env.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
})

export const sendEmail = async (
    to: string,
    subject: string,
    text: string
): Promise<void> => {
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
        throw new Error('Email credentials are missing from the .env file')
    }

    await transporter.sendMail({
        from: env.EMAIL_USER,
        to,
        subject,
        text
    })
}
