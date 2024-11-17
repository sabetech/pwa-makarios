import { TRegion } from "./Region";
import { TUser } from "./user";

export type TZone = {
    id: number;
    name: string;
    region: TRegion;
    zone: TUser;
}