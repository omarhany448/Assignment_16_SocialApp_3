import { Types } from 'mongoose'
import { LoginSessionModel } from '../../DB/model/login-session.model.js'
import { NotFoundException, BadRequestException } from '../../common/exceptions/error.exception.js'

export const storeSession = async (userId: string, data: { fcmToken?: string; deviceId?: string }) =>
    LoginSessionModel.create({
        userId: new Types.ObjectId(userId),
        fcmToken: data.fcmToken ?? null,
        deviceId: data.deviceId ?? null,
        isActive: true,
        lastSeenAt: new Date()
    })

export const updateFcmToken = async (sessionId: string, userId: string, fcmToken: string) => {
    if (!Types.ObjectId.isValid(sessionId)) throw new BadRequestException('Invalid session id')
    const session = await LoginSessionModel.findOneAndUpdate(
        { _id: sessionId, userId: new Types.ObjectId(userId), isActive: true },
        { $set: { fcmToken, lastSeenAt: new Date() } },
        { new: true }
    )
    if (!session) throw new NotFoundException('Active session not found')
    return session
}

export const closeSession = async (sessionId: string, userId: string) => {
    if (!Types.ObjectId.isValid(sessionId)) throw new BadRequestException('Invalid session id')
    const session = await LoginSessionModel.findOneAndUpdate(
        { _id: sessionId, userId: new Types.ObjectId(userId), isActive: true },
        { $set: { isActive: false } },
        { new: true }
    )
    if (!session) throw new NotFoundException('Active session not found')
    return session
}

export const getMySessions = async (userId: string) =>
    LoginSessionModel.find({ userId: new Types.ObjectId(userId), isActive: true })
        .select('-fcmToken').sort({ lastSeenAt: -1 }).lean()
