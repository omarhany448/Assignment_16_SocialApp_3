export interface SignupDTO {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface ConfirmEmailDTO {
    email: string
    code: string
}

export interface LoginDTO {
    email: string
    password: string
}
