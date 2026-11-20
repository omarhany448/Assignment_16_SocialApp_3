import { Types } from 'mongoose'
import { BaseRepository } from '../../common/repository/index.js'
import { BadRequestException, ConflictException, NotFoundException } from '../../common/exceptions/error.exception.js'
import { FriendRequestModel, FriendRequestStatus } from '../../DB/model/friend-request.model.js'
import { UserModel } from '../../DB/model/user.model.js'
import { NotificationType } from '../../DB/model/notification.model.js'
import { createNotification } from '../notification/notification.service.js'

const requests = new BaseRepository(FriendRequestModel)
const users = new BaseRepository(UserModel)

export const sendFriendRequest = async (senderId: string, recipientId: string) => {
    if (!Types.ObjectId.isValid(recipientId)) throw new BadRequestException('Invalid recipient id')
    if (senderId === recipientId) throw new BadRequestException('You cannot send a friend request to yourself')
    const recipient = await users.findById(recipientId)
    if (!recipient) throw new NotFoundException('User not found')

    const existing = await FriendRequestModel.findOne({
        $or: [
            { senderId: new Types.ObjectId(senderId), recipientId: new Types.ObjectId(recipientId) },
            { senderId: new Types.ObjectId(recipientId), recipientId: new Types.ObjectId(senderId) }
        ],
        status: { $in: [FriendRequestStatus.PENDING, FriendRequestStatus.ACCEPTED] }
    })

    if (existing?.status === FriendRequestStatus.ACCEPTED) throw new ConflictException('You are already friends')
    if (existing) throw new ConflictException('A friend request is already pending')

    const request = await requests.create({
        senderId: new Types.ObjectId(senderId),
        recipientId: new Types.ObjectId(recipientId),
        status: FriendRequestStatus.PENDING
    })
    await createNotification({
        recipientId,
        senderId,
        type: NotificationType.FRIEND_REQUEST,
        targetId: request._id.toString()
    })
    return request
}

export const acceptFriendRequest = async (requestId: string, recipientId: string) => {
    if (!Types.ObjectId.isValid(requestId)) throw new BadRequestException('Invalid request id')
    const request = await requests.findOneAndUpdate({
        _id: new Types.ObjectId(requestId),
        recipientId: new Types.ObjectId(recipientId),
        status: FriendRequestStatus.PENDING
    } as never, { $set: { status: FriendRequestStatus.ACCEPTED } })
    if (!request) throw new NotFoundException('Pending friend request not found')
    await createNotification({
        recipientId: request.senderId.toString(),
        senderId: recipientId,
        type: NotificationType.FRIEND_ACCEPTED,
        targetId: request._id.toString()
    })
    return request
}

export const cancelFriendRequest = async (requestId: string, senderId: string) => {
    if (!Types.ObjectId.isValid(requestId)) throw new BadRequestException('Invalid request id')
    const request = await requests.findOneAndUpdate({
        _id: new Types.ObjectId(requestId),
        senderId: new Types.ObjectId(senderId),
        status: FriendRequestStatus.PENDING
    } as never, { $set: { status: FriendRequestStatus.CANCELLED } })
    if (!request) throw new NotFoundException('Pending friend request not found')
    return request
}

export const getMyFriendRequests = async (userId: string) =>
    FriendRequestModel.find({
        $or: [
            { senderId: new Types.ObjectId(userId) },
            { recipientId: new Types.ObjectId(userId) }
        ]
    }).sort({ createdAt: -1 }).populate('senderId', 'firstName lastName email')
        .populate('recipientId', 'firstName lastName email').lean()

export const getMyFriends = async (userId: string) => {
    const accepted = await FriendRequestModel.find({
        status: FriendRequestStatus.ACCEPTED,
        $or: [
            { senderId: new Types.ObjectId(userId) },
            { recipientId: new Types.ObjectId(userId) }
        ]
    }).populate('senderId', 'firstName lastName email')
      .populate('recipientId', 'firstName lastName email')
      .sort({ updatedAt: -1 }).lean()

    return accepted.map(item =>
        item.senderId.toString() === userId ? item.recipientId : item.senderId
    )
}
