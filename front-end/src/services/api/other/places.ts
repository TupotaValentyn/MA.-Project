import { apiClient } from '../index';

const baseUrl = process.env.REACT_APP_API_URL as string;

export const getPlaces = async () => {
  return apiClient.get(`${baseUrl}/places`).then((response) => {
    console.log(response);
    return response.data;
  });
};
