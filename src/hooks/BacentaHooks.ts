import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Bacenta';
import * as queryKeys from '../constants/QueryKeys';
import { TStream } from '../types/stream';
import { TCouncil } from '../types/council';
import { TBacenta } from '../types/bacenta';


// const _addBacenta = async (council: TCouncil) => {
    
//     const { data } = await apiClient.addCouncil(council)
//     return data;
//   };

const _getBacentas = async () => {

    const { data } = await apiClient.getBacentas()
    return data.data
}

// export const useAddBacenta = () => {
    
//     return useMutation(async (council: TCouncil) => _addBacenta(council), {
//         onSuccess: (councilResponse) => {
//             // invalidate the query cache for 'churches'

//             console.log("response ", councilResponse)

//             // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
//         },
//         onError: (error) => {
//             // handle error
//         },
//     });
// }

export const useGetBacentas = () => {
    return  useQuery<TBacenta[]>( 
        { 
            queryKey: [queryKeys.BACENTA_LIST_KEY],
            queryFn: async () => {
                return await _getBacentas()
            },
        })
}