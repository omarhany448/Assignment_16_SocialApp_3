import mongoose, { Schema, model, Types, type HydratedDocument, type Model } from 'mongoose'

export enum FriendRequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    CANCELLED = 'CANCELLED'
}

export interface IFriendRequest {
    senderId: Types.ObjectId
    recipientId: Types.ObjectId
    status: FriendRequestStatus
    createdAt?: Date
    updatedAt?: Date
}

const friendRequestSchema = new Schema<IFriendRequest>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(FriendRequestStatus), default: FriendRequestStatus.PENDING, required: true }
}, { timestamps: true })

friendRequestSchema.index({ senderId: 1, recipientId: 1, status: 1 })
friendRequestSchema.index({ recipientId: 1, status: 1 })

export type FriendRequestDocument = HydratedDocument<IFriendRequest>
export const FriendRequestModel: Model<IFriendRequest> = (mongoose.models.FriendRequest as Model<IFriendRequest> | undefined) ?? model<IFriendRequest>('FriendRequest', friendRequestSchema)

