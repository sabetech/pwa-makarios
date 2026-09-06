import { useQuery } from 'react-query';
import { fetchMembersWithSeverity, fetchMemberAttendanceHistory, MemberWithSeverity, MemberAttendanceHistory } from '../api/attendance';

export const useMembersWithSeverity = (params?: { bacenta_id?: number; region_id?: number; sort?: string }) => {
    return useQuery<MemberWithSeverity[], Error>(
        ['membersWithSeverity', params],
        () => fetchMembersWithSeverity(params),
        { staleTime: 30000 }
    );
};

export const useMemberAttendanceHistory = (memberId: string, params?: { from?: string; to?: string }) => {
    return useQuery<MemberAttendanceHistory, Error>(
        ['memberAttendanceHistory', memberId, params],
        () => fetchMemberAttendanceHistory(memberId, params),
        { enabled: !!memberId }
    );
};
