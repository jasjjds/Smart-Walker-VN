"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import CustomDataTable, { ColumnDefinition } from '@/components/custom/custom_data_table'; // Nhớ trỏ đúng thư mục components

interface Patient {
  id: string;      // ID hiển thị (BN-001)
  rawId: number;   // ID thực trong DB (Dùng làm key)
  name: string;
  deviceId: string;
  age: number | string;
  gender: string;
  status: string;
}

const API_URL = 'https://breeze-fencing-elaborate.ngrok-free.dev';

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // Đổi thành number vì dùng rawId

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/patients`, {
        headers: { 'ngrok-skip-browser-warning': 'true', 'Accept': 'application/json' }
      });
      const result = response.data;

      if (result.success) {
        const formattedData = result.data.map((p: any) => ({
          id: `BN-${String(p.id).padStart(3, '0')}`,
          rawId: p.id,
          name: p.full_name || 'Chưa cập nhật tên',
          deviceId: p.device_id || 'Chưa gán thiết bị',
          age: calculateAge(p.date_of_birth),
          gender: p.gender || 'N/A',
          status: p.status || 'Active',
        }));
        setPatients(formattedData);
      } else {
        setError(result.error || 'Không thể lấy dữ liệu');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Lỗi kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const ageDate = new Date(Date.now() - dob.getTime());
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (rawId: number) => {
    setOpenDropdownId(prev => prev === rawId ? null : rawId);
  };

  // ==========================================
  // ĐỊNH NGHĨA CÁC CỘT CHO DATATABLE
  // ==========================================
  const patientColumns: ColumnDefinition<Patient>[] = [
    {
      header: 'Tên bệnh nhân',
      accessorKey: 'name',
      cell: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white border border-[#d1e5f0] flex items-center justify-center font-bold text-slate-600 shadow-sm shrink-0">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-800">{patient.name}</span>
        </div>
      )
    },
    {
      header: 'Mã BN / Thiết bị',
      accessorKey: 'id',
      cell: (patient) => (
        <div className="flex flex-col">
          <span className="font-medium">{patient.id}</span>
          <span className="text-[11px] text-slate-500 font-mono">{patient.deviceId}</span>
        </div>
      )
    },
    {
      header: 'Tuổi & Giới tính',
      accessorKey: 'age',
      cell: (patient) => (
        <span className="text-slate-600">{patient.age} tuổi • {patient.gender}</span>
      )
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: (patient) => {
        const statusColors = {
          Active: 'bg-emerald-500',
          Inactive: 'bg-slate-400',
          Busy: 'bg-red-500'
        } as Record<string, string>;
        const statusLabels = {
          Active: 'Đang tập',
          Inactive: 'Nghỉ ngơi',
          Busy: 'Cần chú ý'
        } as Record<string, string>;

        const color = statusColors[patient.status] || 'bg-slate-400';
        const label = statusLabels[patient.status] || patient.status;

        return (
          <div className="font-medium text-slate-700 flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${color}`}></span> {label}
          </div>
        );
      }
    },
    {
      header: 'Thao tác',
      accessorKey: 'rawId',
      cell: (patient) => (
        <div className="flex items-center justify-center gap-3">
          {/* Nút Xem Biểu Đồ */}
          <Link
            href={`/dashboard/doctor/patients/${patient.rawId}`}
            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
            title="Xem hồ sơ bệnh án"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
          </Link>

          {/* Nút 3 chấm & Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown(patient.rawId)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {openDropdownId === patient.rawId && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-xl z-20 py-1 overflow-hidden transform origin-top-right transition-all">
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4aa0e4] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Chỉnh sửa
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Xóa hồ sơ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] overflow-y-auto p-2">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#0c4a6e]">Danh sách bệnh nhân</h1>
        <button className="bg-[#4aa0e4] hover:bg-[#3b82f6] text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm bệnh nhân mới
        </button>
      </div>

      <div className="flex-1 bg-[#f0f7fb] rounded-xl border border-[#d1e5f0] shadow-sm flex flex-col overflow-hidden">

        <div className="flex justify-between items-center p-4 border-b border-[#d1e5f0] bg-white/50">
          <h2 className="text-lg font-bold text-[#0c4a6e]">Danh sách bệnh nhân</h2>
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1e5f0] rounded-full text-sm outline-none focus:border-[#4aa0e4] focus:ring-1 focus:ring-[#4aa0e4] transition-all bg-white"
            />
          </div>
        </div>

        <div className="relative flex-1 min-h-[300px] overflow-hidden flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <div className="w-8 h-8 border-4 border-[#4aa0e4] border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-2 text-sm font-medium text-[#0c4a6e]">Đang tải dữ liệu...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-200">
                Lỗi: {error}
              </div>
            </div>
          )}

          <CustomDataTable
            columns={patientColumns}
            data={filteredPatients}
          />
        </div>

        <div className="p-4 border-t border-[#d1e5f0] bg-white/50 flex justify-end shrink-0">
          <span className="text-sm text-slate-500">Hiển thị {filteredPatients.length} / {patients.length} kết quả</span>
        </div>
      </div>
    </div>
  );
}