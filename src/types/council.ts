import { TStream } from "./stream";
import { TUser } from "./user";

export type TCouncil = {
    id: number,
    name: string,
    description: string,
    leader?: TUser,
    streams: TStream,
}