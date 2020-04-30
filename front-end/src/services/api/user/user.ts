import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const user = async (token: any) => {
  return apiClient.get(`${baseUrl}/user/${token}`).then((response) => {
    return response.data;
  });
};
