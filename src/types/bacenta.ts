import { TUser } from "./user";
import { TRegion } from "./Region";
import { TServiceResponse } from "./service";

export type TBacenta = {
    id: number;
    name: string;
    region: TRegion;
    leader: TUser;
}

export type TBacentaServicesData = {
    id: number;
    name: string;
    leader: TUser;
    services: TServiceResponse[];
}