import api from './axios';

export interface Service {
    id: number;
    title: string;
    amount: string;
    date: string;
    attendance: string;
    image: string;
    service_photo: string;
    service_type: {
        service_type: string;
    };
    offering: number | string;
}

export interface ServicesResponse {
    success: boolean;
    data: Service[];
}

export const fetchServices = async (): Promise<Service[]> => {
    const response = await api.get<ServicesResponse>('/v2/services');
    return response.data.data;
};
