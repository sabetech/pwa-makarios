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

export interface ServiceType {
    id: string;
    service_type: string;
    description: string;
}

export interface ServiceTypesResponse {
    success: boolean;
    data: ServiceType[];
}

export const fetchServices = async (): Promise<Service[]> => {
    const response = await api.get<ServicesResponse>('/v2/services');
    return response.data.data;
};

export const fetchServiceTypes = async (): Promise<ServiceType[]> => {
    const response = await api.get<ServiceTypesResponse>('/v2/services/types');
    return response.data.data;
};

export const fetchBacentaServices = async (from: string, to: string): Promise<any[]> => {
    const response = await api.get<ServicesResponse>('/v2/services', {
        params: {
            from,
            to,
            service_type_id: 3
        }
    });
    return response.data.data;
};
