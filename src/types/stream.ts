import { TChurchInfo } from "./church";
import { TUser } from "./user";

export type TStream = {
    id?: number,
    name: string,
    meeting_day: string,
    meeting_time?: string,
    is_active: boolean,
    church: TChurchInfo,
    stream_overseer_id?: TUser,
    stream_admin_id?: TUser,
}