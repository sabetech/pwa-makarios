export type TUser = {
    name: string
    email: string
    img_url?: string
    roles: TRole[]
    permissions: TPermission[]
    id?: number
    created_at?: string
    hasPermission?: (permission: TPermission) => boolean
    hasRole?: (role: TRole) => boolean
}

export type TRole = {
    name: string
}

export type TPermission = {
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

// function hasPermission(permission: TPermission): boolean {
//     return  permissions.map((p: TPermission) => p.name).includes(permission.name);
// }