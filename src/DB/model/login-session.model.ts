import mongoose, { Schema, model, Types, type HydratedDocument, type Model } from 'mongoose'

export interface ILoginSession {
    userId: Types.ObjectId
    fcmToken?: string | null
    deviceId?: string | null
    isActive: boolean
    lastSeenAt: Date
    createdAt?: Date
    updatedAt?: Date
}

const loginSessionSchema = new Schema<ILoginSession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fcmToken: { type: String, default: null },
    deviceId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: Date.now }
}, { timestamps: true })

loginSessionSchema.index({ userId: 1, isActive: 1 })

export type LoginSessionDocument = HydratedDocument<ILoginSession>
export const LoginSessionModel: Model<ILoginSession> = (mongoose.models.LoginSession as Model<ILoginSession> | undefined) ?? model<ILoginSession>('LoginSession', loginSessionSchema)

