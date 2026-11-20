import mongoose, { Schema, model, Types, type HydratedDocument, type Model } from 'mongoose'

export interface IPostAttachment {
    key: string
    url?: string
    originalName: string
    mimeType: string
    size: number
}

export interface IPost {
    content: string
    userId: Types.ObjectId
    attachments: IPostAttachment[]
    isDeleted: boolean
    deletedAt: Date | null
    createdAt?: Date
    updatedAt?: Date
}

const attachmentSchema = new Schema<IPostAttachment>({
    key: { type: String, required: true },
    url: { type: String },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }
}, { _id: false })

const postSchema = new Schema<IPost>({
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attachments: { type: [attachmentSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true })

postSchema.index({ userId: 1, createdAt: -1 })
postSchema.index({ createdAt: -1 })

export type PostDocument = HydratedDocument<IPost>
export const PostModel: Model<IPost> = (mongoose.models.Post as Model<IPost> | undefined) ?? model<IPost>('Post', postSchema)

