"use client";

import React from 'react';

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

  return (
    <div className="bg-[#e0f2fe] rounded-2xl shadow-sm border border-[#bae6fd] flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">

          <thead>
            <tr className="bg-[#e0f2fe] text-[#0c4a6e] text-sm md:text-base border-b border-[#0c4a6e]/20">
              {columns.map((col, index) => (
                <th
                  key={index}
                  // KIỂM TRA: Nếu tên cột là "Thao tác" thì căn giữa tiêu đề
                  className={`py-4 px-6 font-bold whitespace-nowrap ${col.header === 'Thao tác' ? 'text-center' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-[#0c4a6e]/60 font-medium italic">
                  Không có dữ liệu để hiển thị.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-[#f0f9ff]/50 hover:bg-[#bae6fd]/30 transition-colors">

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      // KIỂM TRA: Nếu tên cột là "Thao tác" thì căn giữa nội dung
                      className={`py-4 px-6 font-medium text-[#0c4a6e] ${col.header === 'Thao tác' ? 'text-center' : ''}`}
                    >
                      {col.cell
                        ? col.cell(row)
                        : (col.accessorKey ? String(row[col.accessorKey]) : '')}
                    </td>
                  ))}

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}