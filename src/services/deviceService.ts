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
  },

  scanQr: (deviceId: string) => {
    return axiosClient.post(ENDPOINTS.DEVICES.SCAN_QR, { device_id: deviceId });
  },

  endSession: (deviceId: string) => {
    return axiosClient.post(ENDPOINTS.DEVICES.END_SESSION, { device_id: deviceId });
  },

  getAllDevices: () => {
    return axiosClient.get(ENDPOINTS.DEVICES.BASE);
  },

  updateDevice: (deviceId: string, data: { assigned_patient_id?: number | null; device_type?: string; status?: string }) => {
    return axiosClient.patch(ENDPOINTS.DEVICES.DETAIL(deviceId), data);
  }
};
