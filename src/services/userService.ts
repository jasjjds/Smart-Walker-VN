import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const userService = {
  getUsers: () => {
    return axiosClient.get(ENDPOINTS.USERS.BASE);
  },

  updateUserRole: (id: string | number, roleId: number) => {
    return axiosClient.patch(ENDPOINTS.USERS.ROLE(id), { role_id: roleId });
  }
};
