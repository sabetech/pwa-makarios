export type FellowshipServiceFormFields = {
    attendance: number;
    fellowship_service_image: File;
    foreign_offering: string;
    offering: number;
    service_date: string
}

export type TFellowshipService = {
    id: number;
    attendance: number;
    offering: number;
    service_date: string;
    foreign_offering: number;
    image_url: string;
    cancel_service_reason: string;
}

export type TCancelFellowshipService = {
    service_date: string;
    reason: string;
}