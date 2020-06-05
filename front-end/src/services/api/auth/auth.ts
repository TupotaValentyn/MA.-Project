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

export const checkEmailVerification = async (data: any) => {
  return apiClient
    .get(`${baseUrl}/auth/check_verification/${data.userHash}`)
    .then((response) => {
      return response.data;
    });
};

export const resendEmail = async (data: any) => {
  return apiClient
    .post(`${baseUrl}/auth/resend_confirmation/${data.userHash}`)
    .then((response) => {
      return response.data;
    });
};

export const loginWithGoogle = async (data: any) => {
  return apiClient.post(`${baseUrl}/auth/google`, data).then((response) => {
    return response.data;
  });
};

export const loginWithFacebook = async (data: any) => {
  return apiClient.post(`${baseUrl}/auth/facebook`, data).then((response) => {
    return response.data;
  });
};
