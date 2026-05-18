"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data: Sau này bạn thay bằng dữ liệu fetch từ API
const mockPatients = [
  { id: 'BN-001', name: 'Nguyễn Văn A', deviceId: '14:33:5C:02:39:98', age: 65, gender: 'Nam', status: 'Active' },
];

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách bệnh nhân theo từ khóa tìm kiếm
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm render màu sắc trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Đang tập</>;
      case 'Inactive':
        return <><span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> Nghỉ ngơi</>;
      case 'Busy':
        return <><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Cần chú ý</>;
      default:
        return <><span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> {status}</>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] overflow-y-auto p-2">

      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#0c4a6e]">Danh sách bệnh nhân</h1>
        <button className="bg-[#4aa0e4] hover:bg-[#3b82f6] text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm bệnh nhân mới
        </button>
      </div>

      {/* TABLE CONTAINER (Nền xanh nhạt giống ảnh) */}
      <div className="flex-1 bg-[#f0f7fb] rounded-xl border border-[#d1e5f0] shadow-sm flex flex-col overflow-hidden">

        {/* BỘ LỌC & TÌM KIẾM TRONG BẢNG */}
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

        {/* BẢNG DỮ LIỆU */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#0c4a6e]">
            <thead className="border-b border-[#d1e5f0] bg-[#f0f7fb]">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Tên bệnh nhân</th>
                <th className="px-6 py-4 font-bold text-slate-600">Mã BN / Thiết bị</th>
                <th className="px-6 py-4 font-bold text-slate-600">Tuổi & Giới tính</th>
                <th className="px-6 py-4 font-bold text-slate-600">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1e5f0] bg-transparent">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                    Không tìm thấy bệnh nhân nào.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-white/60 transition-colors">

                    {/* CỘT TÊN & AVATAR */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#d1e5f0] flex items-center justify-center font-bold text-slate-600 shadow-sm shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{patient.name}</span>
                    </td>

                    {/* CỘT THÔNG TIN THIẾT BỊ */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{patient.id}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{patient.deviceId}</span>
                      </div>
                    </td>

                    {/* CỘT TUỔI & GIỚI TÍNH */}
                    <td className="px-6 py-4 text-slate-600">
                      {patient.age} tuổi • {patient.gender}
                    </td>

                    {/* CỘT TRẠNG THÁI */}
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center">
                      {getStatusBadge(patient.status)}
                    </td>

                    {/* CỘT THAO TÁC */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Nút Chỉnh sửa (Giống ảnh) */}
                        <button className="text-slate-400 hover:text-[#4aa0e4] transition-colors" title="Chỉnh sửa thông tin">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>

                        {/* Nút Xem Biểu Đồ (Liên kết sang các trang Force/Distance của bạn) */}
                        <Link href={`/dashboard/doctor/force?device_id=${patient.deviceId}`} className="text-slate-400 hover:text-emerald-500 transition-colors" title="Xem biểu đồ lực tỳ tay">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG (Tùy chọn, thêm cho giống app xịn) */}
        <div className="p-4 border-t border-[#d1e5f0] bg-white/50 flex justify-end">
          <span className="text-sm text-slate-500">Hiển thị {filteredPatients.length} / {mockPatients.length} kết quả</span>
        </div>
      </div>
    </div>
  );
}