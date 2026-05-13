// File: services/analyticsService.ts
import axiosClient from '@/lib/axios';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, ChartDataItem } from '@/types/analytics';

export const fetchDistanceData = async (
  deviceId: string,
  interval: 'minute' | 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<ChartDataItem[]> => {
  try {
    // Gọi API với kiểu trả về mong muốn là ApiResponse chứa mảng ChartDataItem
    const response = await axiosClient.get<any, ApiResponse<ChartDataItem[]>>(
      ENDPOINTS.DISTANCE,
      {
        params: {
          device_id: deviceId,
          interval: interval
        },
        // 👇 THÊM HEADER VƯỢT NGROK VÀO ĐÂY 👇
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json'
        }
      }
    );

    return response.success ? response.chartData : [];
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu quãng đường:', error);
    return [];
  }
};