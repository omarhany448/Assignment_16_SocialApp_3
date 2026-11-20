import { randomUUID } from 'node:crypto'
import { Types } from 'mongoose'
import { NotificationModel, NotificationType } from '../../DB/model/notification.model.js'
import { NotFoundException, BadRequestException } from '../../common/exceptions/error.exception.js'

export const createNotification = async (data: {
    recipientId: string
    senderId: string
    type: NotificationType
    targetId: string
}) => NotificationModel.create({
    notification_id: randomUUID(),
    recipient_id: new Types.ObjectId(data.recipientId),
    sender_id: new Types.ObjectId(data.senderId),
    type: data.type,
    target_id: data.targetId,
    is_read: false,
    created_at: new Date()
})

export const getMyNotifications = async (userId: string) =>
    NotificationModel.find({ recipient_id: new Types.ObjectId(userId) })
        .sort({ created_at: -1 })
        .populate('sender_id', 'firstName lastName')
        .lean()

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
    if (!notificationId) throw new BadRequestException('Notification id is required')
    const notification = await NotificationModel.findOneAndUpdate(
        { notification_id: notificationId, recipient_id: new Types.ObjectId(userId) },
        { $set: { is_read: true } },
        { new: true }
    )
    if (!notification) throw new NotFoundException('Notification not found')
    return notification
}
