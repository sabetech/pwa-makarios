import api from './axios';

export interface Leader {
    id: number;
    name: string;
    img_url: string | null;
    role: string;
    leading?: {
        name: string;
        type: string;
    };
    /** Streams this leader's assignments fall under (may be several). */
    streams?: { id: number; name: string }[];
}

export interface LeadersResponse {
    success: boolean;
    data: Leader[];
}

export const fetchLeaders = async (): Promise<Leader[]> => {
    const response = await api.get<LeadersResponse>('/v2/leaders');
    return response.data.data;
};

export const deleteLeader = async (id: number): Promise<void> => {
    await api.delete(`/v2/leaders/${id}`);
};

export const updateLeader = async (id: number, data: Partial<Leader>): Promise<Leader> => {
    const response = await api.put<{ success: boolean; data: Leader }>(`/v2/leaders/${id}`, data);
    return response.data.data;
};

export type LeaderEntityType = 'stream' | 'region' | 'zone' | 'bacenta';

export interface LeaderEntity {
    type: LeaderEntityType;
    id: number;
    name: string;
    /** Parent shown for context: a region's stream, a zone's or bacenta's region. */
    context: string | null;
}

export interface AssignableEntity extends LeaderEntity {
    leader: { id: number; name: string } | null;
}

export interface LeaderProfile {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    img_url: string | null;
    role: string | null;
    /** Entity type that goes with the leader's role, if any. */
    role_entity_type: LeaderEntityType | null;
    leading: LeaderEntity[];
    /** Present after a role change: how many entities of each type were unassigned. */
    unassigned?: Partial<Record<LeaderEntityType, number>>;
}

export const fetchLeaderProfile = async (id: number): Promise<LeaderProfile> => {
    const response = await api.get<{ success: boolean; data: LeaderProfile }>(`/v2/leaders/${id}`);
    return response.data.data;
};

/** Update name and/or role. `role: null` removes the role. */
export const updateLeaderProfile = async (
    id: number,
    data: { name?: string; role?: string | null }
): Promise<LeaderProfile> => {
    const response = await api.put<{ success: boolean; data: LeaderProfile }>(`/v2/leaders/${id}`, data);
    return response.data.data;
};

export const uploadLeaderPicture = async (id: number, file: File): Promise<LeaderProfile> => {
    const form = new FormData();
    form.append('image', file);
    const response = await api.post<{ success: boolean; data: LeaderProfile }>(`/v2/leaders/${id}/picture`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
};

export const fetchAssignableEntities = async (type: LeaderEntityType): Promise<AssignableEntity[]> => {
    const response = await api.get<{ success: boolean; data: AssignableEntity[] }>(`/v2/leaders/assignable/${type}`);
    return response.data.data;
};

/** Assign the leader to an entity, or move them there from `from_id`. */
export const assignLeader = async (
    id: number,
    data: { type: LeaderEntityType; entity_id: number; from_id?: number }
): Promise<LeaderProfile> => {
    const response = await api.post<{ success: boolean; data: LeaderProfile }>(`/v2/leaders/${id}/assignments`, data);
    return response.data.data;
};

export const unassignLeader = async (id: number, type: LeaderEntityType, entityId: number): Promise<LeaderProfile> => {
    const response = await api.delete<{ success: boolean; data: LeaderProfile }>(
        `/v2/leaders/${id}/assignments/${type}/${entityId}`
    );
    return response.data.data;
};
