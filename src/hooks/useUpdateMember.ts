import { useMutation, useQueryClient } from 'react-query';
import { updateMember, Member } from '../api/members';

export const useUpdateMember = () => {
    const queryClient = useQueryClient();

    return useMutation<Member, Error, { id: string; data: Partial<Member> }>(
        ({ id, data }) => updateMember(id, data),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries(['member', variables.id]);
                queryClient.invalidateQueries('members');
            },
        }
    );
};
