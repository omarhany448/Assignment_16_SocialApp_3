import { Types } from 'mongoose'
import { BaseRepository } from '../../common/repository/index.js'
import { NotFoundException } from '../../common/exceptions/error.exception.js'
import { PostModel } from '../../DB/model/post.model.js'
import type { CreatePostDTO, UpdatePostDTO } from './post.dto.js'

const postRepository = new BaseRepository(PostModel)

export const createPost = async (
    data: CreatePostDTO,
    userId: string
) => {
    return await postRepository.create({
        content: data.content,
        userId: new Types.ObjectId(userId)
    })
}

export const getAllPosts = async (userId: string) => {
    return await postRepository.findMany({
        userId: new Types.ObjectId(userId),
        isDeleted: false
    })
}

export const getPostById = async (postId: string) => {
    const post = await postRepository.findOne({
        _id: new Types.ObjectId(postId),
        isDeleted: false
    })

    if (!post) {
        throw new NotFoundException('Post not found')
    }

    return post
}

export const updatePost = async (
    postId: string,
    userId: string,
    data: UpdatePostDTO
) => {
    const post = await postRepository.findOneAndUpdate(
        {
            _id: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
            isDeleted: false
        },
        {
            $set: {
                content: data.content
            }
        }
    )

    if (!post) {
        throw new NotFoundException('Post not found or you are not the owner')
    }

    return post
}

export const deletePost = async (
    postId: string,
    userId: string
) => {
    const post = await postRepository.findOneAndUpdate(
        {
            _id: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }
    )

    if (!post) {
        throw new NotFoundException('Post not found or you are not the owner')
    }

    return {
        id: post._id.toString(),
        isDeleted: true
    }
}
