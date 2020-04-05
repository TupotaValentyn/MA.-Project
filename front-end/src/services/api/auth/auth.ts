import { apiClient } from '../index';
const baseUrl = process.env.REACT_API_URL as string;

export const login = async (data: any) => {
  return apiClient.post(`${baseUrl}/auth/local`, data).then((response) => {
    console.log(response);
    return response.data;
  });
};
