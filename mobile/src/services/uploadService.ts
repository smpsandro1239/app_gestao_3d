import { Platform } from 'react-native';
import api from './api';

export const uploadImage = async (uri: string): Promise<string> => {
    const formData = new FormData();

    // Extract file name and type
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    if (Platform.OS === 'web') {
        // In Web, we need to convert the URI to a Blob/File
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('file', blob, filename);
    } else {
        // In Native, we use the object format that the native bridge understands
        // @ts-ignore
        formData.append('file', {
            uri,
            name: filename,
            type,
        });
    }

    const response = await api.post('/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (response.data.error) {
        throw new Error(response.data.error);
    }

    return response.data.url;
};
