import mongoose, { Schema, model, Types, type HydratedDocument, type Model } from 'mongoose'

export enum NotificationType {
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    FRIEND_ACCEPTED = 'FRIEND_ACCEPTED',
    POST = 'POST',
    COMMENT = 'COMMENT'
}

export interface INotification {
    notification_id: string
    recipient_id: Types.ObjectId
    sender_id: Types.ObjectId
    type: NotificationType
    target_id: string
    is_read: boolean
    created_at: Date
}

const notificationSchema = new Schema<INotification>({
    notification_id: { type: String, required: true, unique: true, index: true },
    recipient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    target_id: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false })

notificationSchema.index({ recipient_id: 1, created_at: -1 })

export type NotificationDocument = HydratedDocument<INotification>
export const NotificationModel: Model<INotification> = (mongoose.models.Notification as Model<INotification> | undefined) ?? model<INotification>('Notification', notificationSchema)

