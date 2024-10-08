export type TUser = {
    name: string
    email: string
    img_url?: string
    roles: TRole[]
    id?: number
    created_at?: string
}

export type TRole = {
    name: string
}

export type TUserResponse = {
    data: {
        token: string,
        user: TUser
    }
    message: string
    success: boolean
}