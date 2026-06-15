// src/config/icons.tsx
import React from 'react';
import {
  // Navigation / Dashboard
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  DashboardOutlined,
  CompassOutlined,
  HistoryOutlined,
  ClusterOutlined,
  AppstoreOutlined,
  
  // Actions
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  FilterOutlined,
  
  // Status / Feedback
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  WifiOutlined,
  PoweroffOutlined,
  BellOutlined,
  
  // Directional / Arrows
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  
  // Analytics / Charts
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  
  // Custom / Hardware (for Smart Walker)
  BulbOutlined,
  AlertOutlined,
  AimOutlined,
  SyncOutlined
} from '@ant-design/icons';

/**
 * Danh sách Icon hệ thống tập trung (Centralized Icons)
 * Dùng để thống nhất các icon có cùng chức năng, tránh mỗi màn hình dùng một kiểu icon khác nhau.
 * 
 * Cách sử dụng:
 * 1. Import hệ thống icons: `import { Icons } from '@/config/icons'`
 * 2. Sử dụng Component trực tiếp: `<Icons.Dashboard className="w-5 h-5" />` hoặc `<Icons.Action.Add />`
 */
export const Icons = {
  // Navigation & General Pages
  Dashboard: DashboardOutlined,
  Home: HomeOutlined,
  Setting: SettingOutlined,
  User: UserOutlined,
  History: HistoryOutlined,
  Map: CompassOutlined,
  Devices: ClusterOutlined,
  Apps: AppstoreOutlined,
  Notification: BellOutlined,

  // Common Action Icons
  Action: {
    Add: PlusOutlined,
    Edit: EditOutlined,
    Delete: DeleteOutlined,
    Save: SaveOutlined,
    Cancel: CloseOutlined,
    Confirm: CheckOutlined,
    Search: SearchOutlined,
    Refresh: ReloadOutlined,
    Download: DownloadOutlined,
    Upload: UploadOutlined,
    Filter: FilterOutlined,
    TogglePower: PoweroffOutlined,
  },

  // Status & Feedback Icons
  Status: {
    Info: InfoCircleOutlined,
    Success: CheckCircleOutlined,
    Warning: WarningOutlined,
    Error: CloseCircleOutlined,
    Question: QuestionCircleOutlined,
    Lock: LockOutlined,
    Unlock: UnlockOutlined,
    Online: WifiOutlined,
    Alert: AlertOutlined,
  },

  // Directional & Navigation UI Icons
  UI: {
    Menu: MenuOutlined,
    Back: LeftOutlined,
    Next: RightOutlined,
    Up: UpOutlined,
    Down: DownOutlined,
    Ascending: CaretUpOutlined,
    Descending: CaretDownOutlined,
  },

  // Charts & Analytics
  Chart: {
    Line: LineChartOutlined,
    Bar: BarChartOutlined,
    Pie: PieChartOutlined,
  },

  // IoT / Hardware / Device features
  Device: {
    Sensor: BulbOutlined,
    Tracking: AimOutlined,
    Sync: SyncOutlined,
  }
} as const;

export type SystemIcons = typeof Icons;
