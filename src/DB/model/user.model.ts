import mongoose, { Schema, model, type HydratedDocument } from 'mongoose'

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    isVerified: boolean
    createdAt?: Date
    updatedAt?: Date
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export type UserDocument = HydratedDocument<IUser>

export const UserModel = mongoose.models.User || model<IUser>('User', userSchema)
