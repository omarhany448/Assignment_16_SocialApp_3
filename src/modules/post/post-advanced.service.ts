import { Types } from 'mongoose'
import { PostModel } from '../../DB/model/post.model.js'
import { FriendRequestModel, FriendRequestStatus } from '../../DB/model/friend-request.model.js'
import { BadRequestException, NotFoundException, UnauthorizedException } from '../../common/exceptions/error.exception.js'
import { uploadAsset, deleteAssets } from '../../common/utils/s3.utils.js'

interface UploadFile {
    buffer: Buffer
    originalname: string
    mimetype: string
    size: number
}

export const createPostWithAttachments = async (
    userId: string,
    content: string,
    files: UploadFile[] = []
) => {
    if (!content?.trim() && files.length === 0) {
        throw new BadRequestException('Post must contain text or at least one attachment')
    }

    const uploaded: Array<{ key: string; url?: string; originalName: string; mimeType: string; size: number }> = []

    try {
        for (const file of files) {
            const result = await uploadAsset({ file, folder: `posts/${userId}` })
            uploaded.push({
                key: result.key,
                
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size
            })
        }

        return await PostModel.create({
            content: content?.trim() || ' ',
            userId: new Types.ObjectId(userId),
            attachments: uploaded
        })
    } catch (error) {
        if (uploaded.length) {
            try { await deleteAssets(uploaded.map(item => item.key)) } catch { }
        }
        throw error
    }
}

export const getMyPosts = async (userId: string) =>
    PostModel.find({ userId: new Types.ObjectId(userId), isDeleted: false })
        .sort({ createdAt: -1 })
        .populate('userId', 'firstName lastName email')
        .lean()

export const getPostById = async (postId: string) => {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id')
    const post = await PostModel.findOne({ _id: postId, isDeleted: false })
        .populate('userId', 'firstName lastName')
        .lean()
    if (!post) throw new NotFoundException('Post not found')
    return post
}

export const updatePostContent = async (postId: string, userId: string, content: string) => {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id')
    if (!content?.trim()) throw new BadRequestException('Post content is required')
    const post = await PostModel.findOneAndUpdate(
        { _id: postId, userId: new Types.ObjectId(userId), isDeleted: false },
        { $set: { content: content.trim() } },
        { new: true, runValidators: true }
    )
    if (!post) throw new NotFoundException('Post not found or you are not its owner')
    return post
}

export const softDeletePost = async (postId: string, userId: string) => {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id')
    const post = await PostModel.findOneAndUpdate(
        { _id: postId, userId: new Types.ObjectId(userId), isDeleted: false },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
    )
    if (!post) throw new NotFoundException('Post not found or you are not its owner')
    return post
}

export const getFriendsFeed = async (userId: string, page = 1, limit = 20) => {
    const safePage = Math.max(1, Number(page) || 1)
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 20))

    const friendships = await FriendRequestModel.find({
        status: FriendRequestStatus.ACCEPTED,
        $or: [
            { senderId: new Types.ObjectId(userId) },
            { recipientId: new Types.ObjectId(userId) }
        ]
    }).lean()

    const friendIds = friendships.map(item =>
        item.senderId.toString() === userId ? item.recipientId : item.senderId
    )

    const authorIds = [new Types.ObjectId(userId), ...friendIds]
    const [posts, total] = await Promise.all([
        PostModel.find({ userId: { $in: authorIds }, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .populate('userId', 'firstName lastName')
            .lean(),
        PostModel.countDocuments({ userId: { $in: authorIds }, isDeleted: false })
    ])

    return {
        posts,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            pages: Math.ceil(total / safeLimit)
        }
    }
}

export const removePostAttachment = async (postId: string, userId: string, key: string) => {
    if (!Types.ObjectId.isValid(postId)) throw new BadRequestException('Invalid post id')
    const post = await PostModel.findOne({
        _id: postId,
        userId: new Types.ObjectId(userId),
        isDeleted: false
    })
    if (!post) throw new NotFoundException('Post not found or you are not its owner')

    const attachment = post.attachments.find(item => item.key === key)
    if (!attachment) throw new NotFoundException('Attachment not found')

    await deleteAssets([key])
    post.attachments = post.attachments.filter(item => item.key !== key) as typeof post.attachments
    await post.save()
    return post
}

