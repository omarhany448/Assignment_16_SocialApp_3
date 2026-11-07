import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { env } from '../../config/env.js'

const algorithm = 'aes-256-gcm'

const getEncryptionKey = (): Buffer => {
    const key = Buffer.from(env.ENCRYPTION_KEY, 'hex')

    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hexadecimal value')
    }

    return key
}

export const encrypt = (value: string): string => {
    const iv = randomBytes(12)
    const cipher = createCipheriv(algorithm, getEncryptionKey(), iv)

    const encrypted = Buffer.concat([
        cipher.update(value, 'utf8'),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return [
        iv.toString('hex'),
        authTag.toString('hex'),
        encrypted.toString('hex')
    ].join(':')
}

export const decrypt = (encryptedValue: string): string => {
    const [ivValue, authTagValue, encryptedText] = encryptedValue.split(':')

    if (!ivValue || !authTagValue || !encryptedText) {
        throw new Error('Invalid encrypted value')
    }

    const decipher = createDecipheriv(
        algorithm,
        getEncryptionKey(),
        Buffer.from(ivValue, 'hex')
    )

    decipher.setAuthTag(Buffer.from(authTagValue, 'hex'))

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedText, 'hex')),
        decipher.final()
    ])

    return decrypted.toString('utf8')
}
