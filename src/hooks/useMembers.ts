import { useQuery } from 'react-query';
import { fetchMembers, fetchMemberById, Member } from '../api/members';

export const useMembers = () => {
    return useQuery<Member[], Error>('members', fetchMembers);
};

export const useMember = (id: string) => {
    return useQuery<Member, Error>(['member', id], () => fetchMemberById(id), {
        enabled: !!id,
    });
};
