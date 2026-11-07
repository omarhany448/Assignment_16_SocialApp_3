interface SuccessResponseOptions<T> {
    message: string
    data?: T
}

export const successResponse = <T>({
    message,
    data
}: SuccessResponseOptions<T>) => {
    return {
        success: true,
        message,
        ...(data !== undefined && { data })
    }
}
