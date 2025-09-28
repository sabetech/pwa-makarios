import { TBacenta } from "./bacenta";
import { TChurchInfo } from "./church";
import { TStream } from "./stream";
import { TRole, TUser } from "./user";
import { TBacentaServicesData } from "./bacenta";

export type TServiceType = {
    id: number;
    service_type: string;
    role: TRole;
    church: TChurchInfo;
    created_at: string;
    updated_at: string;
    };

export type TServiceInfo = {
    id?: number;
    date: string;
    service_type_id: number;
    attendance: number;
    offering: number;
    foreign_currency?: string;
    service_image: File;
    treasurers_picture: File;
    treasurers: string;
}

export type TServiceResponse = {
    id?: number;
    date: string;
    service_type_id?: number;
    bacenta: TBacenta;
    service_photo: string;
    attendance: number;
    offering: number;
    foreign_currency?: string;
    treasurer_photo: string;
    service_type: TServiceType;
    treasurers: string;
}

export type TRegionServiceData = {
    id: number;
    name: string;
    bacentas: TBacentaServicesData[];
    leader: TUser;
    stream: TStream;
    attendance_weekly_summary: {
        week_start: string;
        week_end: string;
        total_attendance: number;
    }[];
}