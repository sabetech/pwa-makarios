import api from './axios';

export interface Member {
    id: number;
    name: string;
    phone: string | null;
    img_url: string | null;
    email?: string | null;
    whatsapp?: string | null;
    dob?: string | null;
    gender?: string | null;
    marital_status?: string | null;
    occupation?: string | null;
    address?: string | null;
    gps_location?: string | null;
    bacenta?: string | null;
    basonta?: string | null;
}

export interface MembersResponse {
    success: boolean;
    data: Member[];
}

export interface MemberResponse {
    success: boolean;
    data: Member;
}

export const fetchMembers = async (): Promise<Member[]> => {
    const response = await api.get<MembersResponse>('/members');
    return response.data.data;
};

export const fetchMemberById = async (id: string): Promise<Member> => {
    const response = await api.get<MemberResponse>(`/members/${id}`);
    return response.data.data;
};

export const updateMember = async (id: string, data: Partial<Member>): Promise<Member> => {
    const response = await api.put<MemberResponse>(`/members/${id}`, data);
    return response.data.data;
};
