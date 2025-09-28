import { TChurchInfo } from "./church";
import { TRegion } from "./Region";
import { TUser } from "./user";

export type TStream = {
    id?: number,
    name: string,
    meeting_day?: string,
    meeting_time?: string,
    is_active?: boolean,
    church?: TChurchInfo,
    overseer?: TUser,
    stream_admin_id?: TUser,
    regions?: TRegion[],
    regionalInfo?: TRegion[],
}

export type TStreamRegion = {
    stream: TStream,
    regions: TRegion[]
}