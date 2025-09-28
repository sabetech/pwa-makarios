import { TMember } from "./member";
import { TRegion } from "./Region";
import { TServiceInfo } from "./service";
import { TStream } from "./stream";
import { TUser } from "./user";

export type TMicrochurch = {
    id?: number;
    name: string;
    leader: TUser;
    stream: TStream;
    region: TRegion;
    members?: TMember[];
    services?: TServiceInfo[];
}

export type TMicrochurchFormValues = {
    name: string;
    leader: {id: string | number, name: string} | null; // Leader's ID and name
    stream_and_region: Array<number>
};