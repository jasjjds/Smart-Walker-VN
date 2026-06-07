import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const userService = {
  getUsers: () => {
    return axiosClient.get(ENDPOINTS.USERS.BASE);
  },

  createUser: (data: any) => {
    return axiosClient.post(ENDPOINTS.USERS.BASE, data);
  },

  updateUser: (id: string | number, data: any) => {
    return axiosClient.patch(ENDPOINTS.USERS.DETAIL(id), data);
  },

  deleteUser: (id: string | number) => {
    return axiosClient.delete(ENDPOINTS.USERS.DETAIL(id));
  },

  updateUserRole: (id: string | number, roleId: number) => {
    return axiosClient.patch(ENDPOINTS.USERS.ROLE(id), { role_id: roleId });
  }
};
