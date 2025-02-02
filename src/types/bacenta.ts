import { TUser } from "./user";
import { TRegion } from "./Region";

export type TBacenta = {
    id: number;
    name: string;
    region: TRegion;
    leader: TUser;
}