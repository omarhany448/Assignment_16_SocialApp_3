import mongoose, { Schema, model, Types, type HydratedDocument } from 'mongoose'

export interface IComment {
    content: string
    postId: Types.ObjectId
    userId: Types.ObjectId
    isDeleted: boolean
    deletedAt?: Date | null
    createdAt?: Date
    updatedAt?: Date
}

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 3000
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
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

commentSchema.index({ postId: 1, createdAt: -1 })
commentSchema.index({ userId: 1 })

export type CommentDocument = HydratedDocument<IComment>

export const CommentModel = mongoose.models.Comment || model<IComment>('Comment', commentSchema)
