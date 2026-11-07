import type {
    QueryFilter,
    HydratedDocument,
    Model,
    UpdateQuery
} from 'mongoose'

export class BaseRepository<T extends {}> {
    constructor(private readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        return await this.model.create(data)
    }

    findOne(filter: QueryFilter<T>): Promise<HydratedDocument<T> | null>
    findOne(filter: QueryFilter<T>, options: { lean: true }): Promise<T | null>
    async findOne(
        filter: QueryFilter<T>,
        options?: { lean: true }
    ): Promise<HydratedDocument<T> | T | null> {
        const query = this.model.findOne(filter)

        if (options?.lean) {
            return await query.lean().exec() as T | null
        }

        return await query.exec()
    }

    async findById(id: string): Promise<HydratedDocument<T> | null> {
        return await this.model.findById(id).exec()
    }

    async findMany(filter: QueryFilter<T> = {}): Promise<HydratedDocument<T>[]> {
        return await this.model.find(filter).exec()
    }

    async updateOne(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>
    ) {
        return await this.model.updateOne(filter, update).exec()
    }

    async findOneAndUpdate(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>
    ): Promise<HydratedDocument<T> | null> {
        return await this.model.findOneAndUpdate(
            filter,
            update,
            { new: true }
        ).exec()
    }

    async deleteOne(filter: QueryFilter<T>) {
        return await this.model.deleteOne(filter).exec()
    }

    async findOneAndDelete(
        filter: QueryFilter<T>
    ): Promise<HydratedDocument<T> | null> {
        return await this.model.findOneAndDelete(filter).exec()
    }
}
