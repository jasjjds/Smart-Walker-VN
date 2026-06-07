"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomDataTable, { ColumnDefinition } from '@/components/custom/custom_data_table';
import { patientService } from '@/services/patientService';
import { useAuth } from '@/lib/auth-context';

interface Patient {
  id: string; // BN-xxx
  rawId: number;
  name: string;
  deviceId: string;
  age: number | string;
  gender: string;
  status: string;
  doctorId: number | null;
  doctorName: string | null;
}

export function PatientListView() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMyPatients, setShowOnlyMyPatients] = useState(false);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    patientIdToAssign: '', // for the assign modal
    medicalHistory: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchPatients = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      if (!isPolling) setError(null);

      const params = showOnlyMyPatients && user?.id ? { doctor_id: user.id } : {};

      const [patientsRes, statusRes] = await Promise.all([
        patientService.getPatients(params),
        patientService.getStatuses(100)
      ]) as any[];

      if (patientsRes.success || Array.isArray(patientsRes)) {
        const statusMap: Record<number, string> = {};
        const statusList = statusRes.data || statusRes;
        if (Array.isArray(statusList)) {
          statusList.forEach((item: any) => {
            statusMap[item.id] = item.status;
          });
        }

        const patientDataList = patientsRes.data || patientsRes;

        const formattedData = patientDataList.map((p: any) => ({
          id: `BN-${String(p.id).padStart(3, '0')}`,
          rawId: p.id,
          name: p.full_name || 'Chưa cập nhật tên',
          deviceId: p.device_id || 'Chưa gán',
          age: calculateAge(p.date_of_birth),
          gender: p.gender || 'N/A',
          status: statusMap[p.id] || p.status || 'offline',
          doctorId: p.doctor_id,
          doctorName: p.doctor_name,
        }));

        setPatients(formattedData);
      } else {
        setError(patientsRes.error || 'Không thể lấy dữ liệu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi kết nối đến máy chủ');
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [showOnlyMyPatients, user?.id]);

  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const ageDate = new Date(Date.now() - dob.getTime());
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleOpenAssignModal = () => {
    setFormData({ patientIdToAssign: '', medicalHistory: '' });
    setFormError(null);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientIdToAssign) {
      setFormError('Vui lòng chọn một bệnh nhân.');
      return;
    }
    
    setFormError(null);
    setFormSubmitting(true);

    try {
      // Assign patient to current doctor
      await patientService.updatePatient(formData.patientIdToAssign, { doctor_id: user?.id });
      setIsAssignModalOpen(false);
      fetchPatients();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi gán bệnh nhân.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({ patientIdToAssign: '', medicalHistory: '' });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // NOTE: Patient details updating logic can be extended here
  // For now we just implement the Assign logic and keep Edit ready

  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase().trim();
    return patient.name.toLowerCase().includes(query) ||
           patient.id.toLowerCase().includes(query) ||
           (patient.doctorName && patient.doctorName.toLowerCase().includes(query));
  });

  const unassignedPatients = patients.filter(p => !p.doctorId);

  const patientColumns: ColumnDefinition<Patient>[] = [
    {
      header: 'Tên bệnh nhân',
      accessorKey: 'name',
      cell: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0c4a6e] shadow-sm border border-[#bae6fd] shrink-0 font-bold">
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
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[#0c4a6e]">{patient.id}</span>
          <span className="text-xs text-[#0ea5e9] font-mono">{patient.deviceId}</span>
        </div>
      )
    },
    {
      header: 'Tuổi & Giới tính',
      accessorKey: 'age',
      cell: (patient) => (
        <span className="text-slate-600 font-medium">{patient.age} tuổi • {patient.gender}</span>
      )
    },
    {
      header: 'Bác sĩ phụ trách',
      cell: (patient) => (
        <div className="flex flex-col gap-0.5">
          {patient.doctorName ? (
            <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-xs inline-block w-fit">
              BS. {patient.doctorName}
            </span>
          ) : (
            <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-xs inline-block w-fit">
              Chưa gán
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: (patient) => {
        let isOnline = patient.status === 'online';
        let statusText = isOnline ? 'Trực tuyến' : (patient.status === 'Busy' ? 'Cần chú ý' : 'Ngoại tuyến');
        let statusColor = isOnline ? 'bg-green-500 shadow-green-500/50' : (patient.status === 'Busy' ? 'bg-red-500 shadow-red-500/50' : 'bg-gray-400');

        return (
          <div className="flex items-center gap-2 font-semibold text-sm">
            <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${statusColor} ${isOnline ? 'animate-pulse' : ''}`}></span>
            <span>{statusText}</span>
          </div>
        );
      }
    },
    {
      header: 'Thao tác',
      accessorKey: 'rawId',
      cell: (patient) => (
        <div className="flex items-center justify-center gap-1.5">
          <Link
            href={`/dashboard/doctor/patients/${patient.rawId}`}
            className="p-1.5 hover:bg-[#bae6fd] rounded-lg transition-colors text-[#0ea5e9]"
            title="Xem hồ sơ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
          <button
            onClick={() => handleOpenEditModal(patient)}
            className="p-1.5 hover:bg-[#bae6fd] rounded-lg transition-colors text-[#0c4a6e]"
            title="Chỉnh sửa thông tin"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã BN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:bg-white transition-all font-medium text-sm"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0c4a6e]/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-[#bae6fd] shadow-sm hover:bg-[#f0f9ff] transition-colors">
            <input 
              type="checkbox" 
              checked={showOnlyMyPatients}
              onChange={(e) => setShowOnlyMyPatients(e.target.checked)}
              className="rounded text-[#0ea5e9] focus:ring-[#0ea5e9] border-[#bae6fd] w-4 h-4"
            />
            <span className="text-sm font-bold text-[#0c4a6e]">Chỉ hiển thị bệnh nhân của tôi</span>
          </label>
        </div>

        <button
          onClick={handleOpenAssignModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Gán bệnh nhân
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-[300px] overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[#0c4a6e]/60">
            <svg className="w-8 h-8 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-semibold text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <CustomDataTable
            columns={patientColumns}
            data={filteredPatients}
            onRefresh={() => fetchPatients(true)}
            refreshInterval={30000}
          />
        )}
      </div>

      {/* MODAL GÁN BỆNH NHÂN */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-xs transition-opacity" onClick={() => setIsAssignModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0c4a6e]">Nhận quản lý bệnh nhân</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-[#0c4a6e]/50 hover:text-red-500 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#0c4a6e]">Chọn bệnh nhân (Chưa gán bác sĩ)</label>
                <select
                  value={formData.patientIdToAssign}
                  onChange={(e) => setFormData({ ...formData, patientIdToAssign: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                >
                  <option value="">-- Chọn bệnh nhân --</option>
                  {unassignedPatients.map(p => (
                    <option key={p.rawId} value={p.rawId}>{p.id} - {p.name}</option>
                  ))}
                </select>
                {unassignedPatients.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Hiện không có bệnh nhân nào chưa được gán bác sĩ trong danh sách hiện tại.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#0c4a6e]/10">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} disabled={formSubmitting} className="px-5 py-2.5 rounded-xl font-bold text-[#0c4a6e] bg-[#f0f9ff] hover:bg-[#bae6fd]">
                  Hủy bỏ
                </button>
                <button type="submit" disabled={formSubmitting || unassignedPatients.length === 0} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#0ea5e9] hover:bg-[#0c4a6e] shadow-md disabled:opacity-50 flex items-center gap-2">
                  {formSubmitting ? 'Đang xử lý...' : 'Xác nhận gán'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA BỆNH NHÂN (Placeholder) */}
      {isEditModalOpen && selectedPatient && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-xs transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0c4a6e]">Chỉnh sửa hồ sơ</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#0c4a6e]/50 hover:text-red-500 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-[#0c4a6e]/70 mb-4">Tính năng cập nhật bệnh án chi tiết đang được phát triển.</p>
            <div className="flex justify-end">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-[#0c4a6e] bg-[#f0f9ff] hover:bg-[#bae6fd]">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
