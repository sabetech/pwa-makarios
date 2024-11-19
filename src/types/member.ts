export type TMember = {
    id: number
    name: string
    date_of_birth: string
    phone: string
    whatsapp: string
    gender: string
    email: string
    address: string
    occupation: string
    marital_status: string
    img_url: string
}

export type TMemberRequest = {
    id: number
    member_name: string
    date_of_birth: string
    email: string
    phone: string
    gender: string
    marital_status: string
    occupation: string
    address: string
    location: string
    picture: File
    whatsapp: string
}

export type TFilterType = {
    [key: string]: string | number
}