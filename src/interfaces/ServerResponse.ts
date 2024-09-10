export interface ServerResponse<T = any> {
    status: number;
    data: T;
}

export interface ResponseError {
    message: string;
    code: string;
    response?: ServerResponse;
}

export interface User {
    id? : number;
    index_number: number;
    name: string;
    phone: string;
    class: string;
    country: string;
    email_address?: string;
    date_of_birth?: string;
    already_exists?: boolean;
    passcode?: number; //this is illegal. Rewrite the whole auth system
}

export interface IUserManager {
    user: User | null;
    storeUser(user: User): void;
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