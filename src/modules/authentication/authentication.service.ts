import { randomInt } from 'node:crypto'
import { BaseRepository } from '../../common/repository/index.js'
import { hashPassword, comparePassword } from '../../common/security/index.js'
import { generateAccessToken } from '../../common/security/token.security.js'
import { sendEmail } from '../../common/utils/email.utils.js'
import { redis } from '../../common/redis/redis.client.js'
import {
    ConflictException,
    BadRequestException,
    NotFoundException,
    UnauthorizedException
} from '../../common/exceptions/error.exception.js'
import { UserModel } from '../../DB/model/user.model.js'
import type {
    SignupDTO,
    ConfirmEmailDTO,
    LoginDTO
} from './authentication.dto.js'

const userRepository = new BaseRepository(UserModel)

export const signup = async (data: SignupDTO) => {
    const email = data.email.toLowerCase()

    const existingUser = await userRepository.findOne({ email })

    if (existingUser) {
        throw new ConflictException('Email already exists')
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await userRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        password: hashedPassword,
        isVerified: false
    })

    const code = randomInt(100000, 1000000).toString()

    await redis.set(`email-verification:${email}`, code, 'EX', 300)

    await sendEmail(
        email,
        'Email Verification',
        `Your verification code is ${code}. It expires in 5 minutes.`
    )

    return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified
    }
}

export const confirmEmail = async (data: ConfirmEmailDTO) => {
    const email = data.email.toLowerCase()

    const user = await userRepository.findOne({ email })

    if (!user) {
        throw new NotFoundException('User not found')
    }

    if (user.isVerified) {
        throw new BadRequestException('Email is already verified')
    }

    const savedCode = await redis.get(`email-verification:${email}`)

    if (!savedCode || savedCode !== data.code) {
        throw new BadRequestException('Invalid or expired verification code')
    }

    await userRepository.updateOne(
        { email },
        { $set: { isVerified: true } }
    )

    await redis.del(`email-verification:${email}`)

    return {
        email,
        isVerified: true
    }
}

export const login = async (data: LoginDTO) => {
    const email = data.email.toLowerCase()

    const user = await userRepository.findOne({ email })

    if (!user) {
        throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordCorrect = await comparePassword(
        data.password,
        user.password
    )

    if (!isPasswordCorrect) {
        throw new UnauthorizedException('Invalid email or password')
    }

    if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email first')
    }

    const accessToken = generateAccessToken(user._id.toString())

    return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    }
}
