import mongoose, { Schema, model, Types, type HydratedDocument } from 'mongoose'

export interface IPost {
    content: string
    userId: Types.ObjectId
    isDeleted: boolean
    deletedAt?: Date | null
    createdAt?: Date
    updatedAt?: Date
}

const postSchema = new Schema<IPost>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 5000
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

postSchema.index({ userId: 1, createdAt: -1 })

export type PostDocument = HydratedDocument<IPost>

export const PostModel = mongoose.models.Post || model<IPost>('Post', postSchema)
