import apiClient from "./client";

export async function loginByInn(inn: string) {
    const response = await apiClient.post('/auth/login', {inn});
    return response.data;
}