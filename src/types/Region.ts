import { TBacenta } from "./bacenta";
import { TMember } from "./member";
import { TStream } from "./stream";
import { TUser } from "./user";
import { TZone } from "./zone";

export type TRegion = {
    id: number,
    region: string,
    description: string,
    leader?: TUser,
    stream: TStream,
    members?: TMember[],
    zones?: TZone[],
    bacentas?: TBacenta[],
}