export class ErrorException extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message)

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequestException extends ErrorException {
    constructor(message: string, details?: unknown) {
        super(message, 400)

        if (details !== undefined) {
            Object.assign(this, { details })
        }
    }
}

export class NotFoundException extends ErrorException {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}

export class UnauthorizedException extends ErrorException {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class ConflictException extends ErrorException {
    constructor(message = 'Conflict') {
        super(message, 409)
    }
}