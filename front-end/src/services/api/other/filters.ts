import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const getFilters = async (params: any) => {
  return apiClient
    .get(`${baseUrl}/filters`, {
      params
    })
    .then((response) => {
      return response.data;
    });
};
