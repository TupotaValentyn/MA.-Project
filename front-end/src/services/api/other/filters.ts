import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const getFilters = async () => {
  return apiClient.get(`${baseUrl}/filters`).then((response) => {
    console.log(response);
    return response.data;
  });
};
