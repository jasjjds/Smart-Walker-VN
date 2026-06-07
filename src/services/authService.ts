import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const authService = {
  register: (data: any) => {
    return axiosClient.post(ENDPOINTS.AUTH.REGISTER, data);
  },

  login: (data: any) => {
    return axiosClient.post(ENDPOINTS.AUTH.LOGIN, data);
  },

  googleLogin: (idToken: string) => {
    return axiosClient.post(ENDPOINTS.AUTH.GOOGLE_LOGIN, { id_token: idToken });
  },

  refresh: () => {
    return axiosClient.post(ENDPOINTS.AUTH.REFRESH);
  },

  logout: () => {
    return axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  updateProfile: (data: any) => {
    return axiosClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  changePassword: (data: any) => {
    return axiosClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  ping: () => {
    return axiosClient.post(ENDPOINTS.AUTH.PING);
  }
};
