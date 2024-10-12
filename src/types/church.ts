import { TUser } from "./user";

export type TChurchInfo = {
    id?: number,
    name: string,
    description: string,
    lat_lng?: string,
    address?: string,
    image_url?: string,
    header_pastor?: TUser,
}