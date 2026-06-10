import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/endpoints';

export interface AnalyticsParams {
  patient_id: string | number;
  interval?: 'minute' | 'hour' | 'day' | 'month' | 'custom';
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const analyticsService = {
  getDistance: (params: AnalyticsParams) => {
    return axiosClient.get(ENDPOINTS.ANALYTICS.DISTANCE, { params });
  },

  getForce: (params: AnalyticsParams) => {
    return axiosClient.get(ENDPOINTS.ANALYTICS.FORCE, { params });
  },

  getVelocity: (params: AnalyticsParams) => {
    return axiosClient.get(ENDPOINTS.ANALYTICS.VELOCITY, { params });
  }
};