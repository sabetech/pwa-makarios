import { TChurchInfo } from "./church";
import { TRole } from "./user";

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
    service_type_id: number;
    service_photo: string;
    attendance: number;
    offering: number;
    foreign_currency?: string;
    treasurer_photo: string;
    service_type: TServiceType;
    treasurers: string;

}