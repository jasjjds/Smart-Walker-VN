"use client";

import React from 'react';
import { Table } from 'antd';

export interface ColumnDefinition<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  onRefresh?: () => void;
  refreshInterval?: number; // milliseconds
}

export default function CustomDataTable<T extends { id: string | number }>({
  columns,
  data,
  onRefresh,
  refreshInterval
}: DataTableProps<T>) {

  React.useEffect(() => {
    if (onRefresh && refreshInterval && refreshInterval > 0) {
      let intervalId: NodeJS.Timeout | null = null;

      const startInterval = () => {
        if (!intervalId) {
          intervalId = setInterval(onRefresh, refreshInterval);
        }
      };

      const stopInterval = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          onRefresh(); // Refresh once immediately when returning
          startInterval();
        } else {
          stopInterval();
        }
      };

      // Start initially if visible
      if (document.visibilityState === 'visible') {
        startInterval();
      }

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        stopInterval();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [onRefresh, refreshInterval]);

  const antdColumns = columns.map((col, index) => ({
    title: col.header,
    dataIndex: col.accessorKey as string,
    key: col.accessorKey ? String(col.accessorKey) : `col-${index}`,
    align: col.header === 'Thao tác' ? ('center' as const) : undefined,
    render: col.cell 
      ? (_: any, record: T) => col.cell!(record)
      : (value: any) => (value !== undefined && value !== null ? String(value) : ''),
  }));

  const tableClasses = "w-full [&_.ant-table]:!bg-transparent [&_.ant-table-container]:!bg-transparent [&_.ant-table-content]:!bg-transparent [&_.ant-table-thead_tr_th]:!bg-primary-100 [&_.ant-table-thead_tr_th]:!text-primary-900 [&_.ant-table-thead_tr_th]:!font-bold [&_.ant-table-thead_tr_th]:!border-b [&_.ant-table-thead_tr_th]:!border-primary-900/20 [&_.ant-table-thead_tr_th]:!py-4 [&_.ant-table-thead_tr_th]:!px-6 [&_.ant-table-tbody_tr_td]:!py-4 [&_.ant-table-tbody_tr_td]:!px-6 [&_.ant-table-tbody_tr_td]:!font-medium [&_.ant-table-tbody_tr_td]:!text-primary-900 [&_.ant-table-tbody_tr]:!bg-transparent [&_.ant-table-tbody_tr]:!text-primary-900 [&_.ant-table-tbody_tr]:!transition-colors [&_.ant-table-row:hover_td]:!bg-primary-200/20 [&_.ant-table-cell-row-hover]:!bg-primary-200/20 [&_.ant-table-tbody_tr_td]:!border-b [&_.ant-table-tbody_tr_td]:!border-primary-50/50 [&_.ant-table-placeholder_.ant-empty-description]:!text-primary-900/60 [&_.ant-table-placeholder]:!bg-transparent [&_.ant-table-placeholder_tr_td]:!border-none [&_.ant-pagination-item-active]:!border-primary-500 [&_.ant-pagination-item-active_a]:!text-primary-500";

  return (
    <div className="bg-primary-100 rounded-2xl shadow-sm border border-primary-200 flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto">
        <Table
          columns={antdColumns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            showSizeChanger: false,
            className: "!px-6 !my-4",
          }}
          rowKey="id"
          locale={{ emptyText: "Không có dữ liệu để hiển thị." }}
          className={tableClasses}
        />
      </div>
    </div>
  );
}