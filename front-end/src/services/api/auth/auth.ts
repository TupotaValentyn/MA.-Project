import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const login = async (data: any) => {
  return apiClient.post(`${baseUrl}/auth/local`, data).then((response) => {
    return response.data;
  });
};

export const register = async (data: any) => {
  return apiClient.post(`${baseUrl}/auth/register`, data).then((response) => {
    return response.data;
  });
};
