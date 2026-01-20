import api from './api';

export const crudService = {
    get: async (endpoint: string) => {
        const response = await api.get(`/cms/${endpoint}`);
        return response.data.data;
    },

    create: async (endpoint: string, data: any) => {
        const response = await api.post(`/cms/${endpoint}`, data);
        return response.data;
    },

    update: async (endpoint: string, id: number, data: any) => {
        const response = await api.put(`/cms/${endpoint}/${id}`, data);
        return response.data;
    },

    delete: async (endpoint: string, id: number) => {
        const response = await api.delete(`/cms/${endpoint}/${id}`);
        return response.data;
    }
};
