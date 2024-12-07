import { TRegion } from "./Region";
import { TStream } from "./stream";
import { TUser } from "./user";

export type TZone = {
    id: number;
    name: string;
    region: TRegion;
    zone: TUser;
    leader: TUser;
    stream: TStream;
}