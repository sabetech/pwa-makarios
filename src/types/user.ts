export type TUser = {
    name: string
    email: string
    img_url?: string
    roles: TRole[]
}

export type TRole = {
    name: string
}