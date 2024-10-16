import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Stream';
import * as queryKeys from '../constants/QueryKeys';
import { TChurchInfo } from '../types/church';
import { TStream } from '../types/stream';


const _addStream = async (stream: TStream) => {
    
    const { data } = await apiClient.addStream(stream)
    return data;
  };

const _getStreams = async () => {

    const { data } = await apiClient.getStreams()
    return data
}

const _getStream = async (stream_id: number): Promise<TStream> => {

    const { data } = await apiClient.getStream(stream_id)
    return data.data
}

export const useAddStream = () => {
    
    return useMutation(async (stream: TStream) => _addStream(stream), {
        onSuccess: (streamResponse) => {
            // invalidate the query cache for 'churches'

            console.log("response ", streamResponse)

            // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
        },
        onError: (error) => {
            // handle error
        },
    });
}

export const useGetStreams = () => {
    return  useQuery( 
        { 
            queryKey: [queryKeys.STREAM_LIST_KEY],
            queryFn: async () => {
                return await _getStreams()
            },
        })
}

export const useGetStream = (stream_id: number) => {
    return  useQuery<TStream>(
        { 
            queryKey: [queryKeys.STREAM_ITEM_KEY, stream_id],
            queryFn: async () => {
                return await _getStream(stream_id)
            },
        }
    )
}