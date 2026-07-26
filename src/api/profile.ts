import api from './axios';

export interface ProfilePictureResponse {
    success: boolean;
    data: {
        user: {
            id: number;
            name: string;
            email: string;
            img_url: string;
        };
    };
}

export const updateProfilePicture = async (imageFile: File): Promise<ProfilePictureResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post<ProfilePictureResponse>('/v2/users/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
