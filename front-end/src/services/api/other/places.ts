import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const getPlaces = async (params: any) => {
  return apiClient
    .get(`${baseUrl}/places`, {
      params
    })
    .then((response) => {
      return response.data;
    });
};
