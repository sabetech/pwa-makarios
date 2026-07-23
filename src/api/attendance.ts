import api from './axios';

export interface Severity {
    label: string;
    color: string;
}

export interface MemberWithSeverity {
    id: number;
    name: string;
    bacenta?: { id: number; name: string } | null;
    region?: { id: number; name: string } | null;
    zone?: { id: number; name: string } | null;
    consecutive_absences: number;
    severity: Severity | null;
}

export interface AttendanceRecord {
    id: number;
    member_id: number;
    service_id: number;
    status: 'present' | 'absent';
    consecutive_absences: number;
    service?: {
        id: number;
        date: string;
        [key: string]: any;
    };
}

export interface MemberAttendanceHistory {
    member: {
        id: number;
        name: string;
        consecutive_absences: number;
        severity: Severity | null;
    };
    history: AttendanceRecord[];
}

export interface AttendanceThreshold {
    id: number;
    min_absences: number;
    max_absences: number | null;
    label: string;
    color: string;
}

export const fetchMembersWithSeverity = async (params?: { bacenta_id?: number; region_id?: number; sort?: string }): Promise<MemberWithSeverity[]> => {
    const response = await api.get<{ success: boolean; data: MemberWithSeverity[] }>('/attendance/members', { params });
    return response.data.data;
};

export const fetchMemberAttendanceHistory = async (memberId: string, params?: { from?: string; to?: string }): Promise<MemberAttendanceHistory> => {
    const response = await api.get<{ success: boolean; data: MemberAttendanceHistory }>(`/attendance/member/${memberId}`, { params });
    return response.data.data;
};

export const markAttendance = async (serviceId: number, attendances: { member_id: number; status: 'present' | 'absent' }[]): Promise<void> => {
    await api.post('/attendance', { service_id: serviceId, attendances });
};

export const fetchAttendanceThresholds = async (): Promise<AttendanceThreshold[]> => {
    const response = await api.get<{ success: boolean; data: AttendanceThreshold[] }>('/attendance/thresholds');
    return response.data.data;
};
