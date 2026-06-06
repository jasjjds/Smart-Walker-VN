// File: types/analytics.ts

export interface ChartDataItem {
  date_bucket: string;
  total_distance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  meta?: {
    device_id: string;
    interval: string;
    time_from?: string;
    time_to?: string;
  };
  chartData: T; // T là kiểu dữ liệu linh hoạt (Generic)
}