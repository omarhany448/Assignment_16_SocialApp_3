import { Types } from 'mongoose'
import { BaseRepository } from '../../common/repository/index.js'
import {
    NotFoundException,
    UnauthorizedException
} from '../../common/exceptions/error.exception.js'
import { PostModel } from '../../DB/model/post.model.js'
import { CommentModel } from '../../DB/model/comment.model.js'
import type {
    CreateCommentDTO,
    UpdateCommentDTO
} from './comment.dto.js'

const postRepository = new BaseRepository(PostModel)
const commentRepository = new BaseRepository(CommentModel)

export const createComment = async (
    postId: string,
    userId: string,
    data: CreateCommentDTO
) => {
    const post = await postRepository.findOne({
        _id: new Types.ObjectId(postId),
        isDeleted: false
    })

    if (!post) {
        throw new NotFoundException('Post not found')
    }

    return await commentRepository.create({
        content: data.content,
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId)
    })
}

export const getPostComments = async (postId: string) => {
    const post = await postRepository.findOne({
        _id: new Types.ObjectId(postId),
        isDeleted: false
    })

    if (!post) {
        throw new NotFoundException('Post not found')
    }

    return await commentRepository.findMany({
        postId: new Types.ObjectId(postId),
        isDeleted: false
    })
}

export const getCommentById = async (commentId: string) => {
    const comment = await commentRepository.findOne({
        _id: new Types.ObjectId(commentId),
        isDeleted: false
    })

    if (!comment) {
        throw new NotFoundException('Comment not found')
    }

    return comment
}

export const updateComment = async (
    commentId: string,
    userId: string,
    data: UpdateCommentDTO
) => {
    const comment = await commentRepository.findOneAndUpdate(
        {
            _id: new Types.ObjectId(commentId),
            userId: new Types.ObjectId(userId),
            isDeleted: false
        },
        {
            $set: {
                content: data.content
            }
        }
    )

    if (!comment) {
        throw new NotFoundException('Comment not found or you are not the owner')
    }

    return comment
}

export const deleteComment = async (
    commentId: string,
    userId: string
) => {
    const comment = await commentRepository.findOne({
        _id: new Types.ObjectId(commentId),
        isDeleted: false
    })

    if (!comment) {
        throw new NotFoundException('Comment not found')
    }

    const isCommentOwner = comment.userId.toString() === userId

    if (!isCommentOwner) {
        const post = await postRepository.findById(comment.postId.toString())

        if (!post || post.userId.toString() !== userId) {
            throw new UnauthorizedException(
                'Only the comment owner or post owner can delete this comment'
            )
        }
    }

    await commentRepository.findOneAndUpdate(
        {
            _id: comment._id,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }
    )

    return {
        id: comment._id.toString(),
        isDeleted: true
    }
}
