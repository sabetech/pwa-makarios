import { TMember } from "./member";
import { TRegion } from "./Region";
import { TStream } from "./stream";
import { TUser } from "./user";
import { TBacenta } from "./bacenta";

export type TZone = {
    id: number;
    name: string;
    region: TRegion;
    zone: TUser;
    leader: TUser;
    stream: TStream;
    members?: TMember[];
    bacentas?: TBacenta[];
}