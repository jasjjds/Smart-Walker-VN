import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export const deviceService = {
  ping: (deviceId: string) => {
    return axiosClient.post(ENDPOINTS.DEVICES.PING, { device_id: deviceId });
  },

  submitMetrics: (data: {
    device_id: string;
    f1: number;
    f2: number;
    coord_x?: number;
    coord_y?: number;
    distance?: number;
  }) => {
    return axiosClient.post(ENDPOINTS.METRICS.BASE, data);
  }
};
