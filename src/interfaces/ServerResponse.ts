import { TUser } from "../types/user";

export interface ServerResponse<T = any> {
    status: number;
    data: T;
}

export interface ResponseError {
    message: string;
    code: string;
    response?: ServerResponse;
}


export interface IUserManager {
    user: TUser | null;
    storeUser(user: TUser): void;
}

interface Pivot {
    points: number;
}

export interface IPastoralPoint {
    id: number;
    parameter: string;
    weight: number;
    point_category: string;
    pivot: Pivot;
}

export interface IBussing {
    id?: number;
    date: string;
    number_bussed: number;
}