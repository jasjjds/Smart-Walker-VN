import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const roleService = {
  getRoles: () => {
    return axiosClient.get(ENDPOINTS.ROLES.BASE);
  },

  createRole: (data: { name: string; description: string; permission_ids: number[] }) => {
    return axiosClient.post(ENDPOINTS.ROLES.BASE, data);
  },

  updateRole: (id: string | number, data: { name?: string; description?: string; permission_ids?: number[] }) => {
    return axiosClient.patch(ENDPOINTS.ROLES.DETAIL(id), data);
  },

  deleteRole: (id: string | number) => {
    return axiosClient.delete(ENDPOINTS.ROLES.DETAIL(id));
  },

  getPermissions: () => {
    return axiosClient.get(ENDPOINTS.PERMISSIONS.BASE);
  }
};
