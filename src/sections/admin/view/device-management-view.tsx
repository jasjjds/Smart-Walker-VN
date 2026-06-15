"use client";

import React, { useState, useEffect } from "react";
import { deviceService } from "@/services/deviceService";
import { patientService } from "@/services/patientService";
import { BRAND_CONFIG } from "@/config/brand";

export function DeviceManagementView() {
  const [devices, setDevices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal gán bệnh nhân
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [assignedPatientId, setAssignedPatientId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Tải danh sách thiết bị từ database
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await deviceService.getAllDevices() as any;
      if (res.success && res.data) {
        setDevices(res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách thiết bị:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách bệnh nhân để gán
  const fetchPatients = async () => {
    try {
      const res = await patientService.getPatients() as any;
      const patientList = res.data || res || [];
      if (Array.isArray(patientList)) {
        setPatients(patientList);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách bệnh nhân:", err);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchPatients();
  }, []);

  // Thay đổi loại thiết bị (Hospital / Personal)
  const handleToggleType = async (deviceId: string, currentType: string) => {
    const nextType = currentType === "hospital" ? "personal" : "hospital";
    try {
      const res = await deviceService.updateDevice(deviceId, { device_type: nextType }) as any;
      if (res.success) {
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, device_type: nextType } : d)
        );
      }
    } catch (err) {
      console.error("Lỗi đổi loại thiết bị:", err);
      alert("Không thể thay đổi loại thiết bị.");
    }
  };

  // Giải phóng gán thiết bị (Bỏ gán bệnh nhân)
  const handleRelease = async (deviceId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn bỏ gán bệnh nhân khỏi thiết bị này?")) return;
    try {
      const res = await deviceService.updateDevice(deviceId, { assigned_patient_id: null }) as any;
      if (res.success) {
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, assigned_patient_id: null, patients: null } : d)
        );
      }
    } catch (err) {
      console.error("Lỗi giải phóng thiết bị:", err);
      alert("Không thể gỡ gán bệnh nhân.");
    }
  };

  // Mở modal gán bệnh nhân
  const handleOpenAssignModal = (device: any) => {
    setSelectedDevice(device);
    setAssignedPatientId(device.assigned_patient_id ? String(device.assigned_patient_id) : "");
    setIsAssignModalOpen(true);
  };

  // Submit gán bệnh nhân
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;

    setSubmitting(true);
    try {
      const patientIdVal = assignedPatientId ? parseInt(assignedPatientId) : null;
      const res = await deviceService.updateDevice(selectedDevice.id, { 
        assigned_patient_id: patientIdVal 
      }) as any;

      if (res.success) {
        setIsAssignModalOpen(false);
        fetchDevices(); // Reload để lấy thông tin bệnh nhân kèm theo
      }
    } catch (err: any) {
      console.error("Lỗi gán thiết bị:", err);
      alert(err.response?.data?.message || "Không thể thực hiện gán thiết bị.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{BRAND_CONFIG.admin.deviceManagementDesc}</p>
        </div>
        <button
          onClick={fetchDevices}
          className="px-4 py-2 bg-primary-50 border border-primary-200 hover:bg-primary-200 text-primary-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
        >
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {/* DEVICES TABLE/CARD AREA */}
      <div className="flex-1 bg-white rounded-3xl border border-primary-200 p-5 sm:p-6 shadow-sm flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs font-bold">Đang truy vấn danh sách thiết bị...</span>
          </div>
        ) : devices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-16 gap-3">
            <svg className="w-12 h-12 opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <p className="text-sm font-bold">Chưa có thiết bị nào được đăng ký.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-primary-200 text-primary-900/50 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  <th className="py-3 px-4">Địa chỉ MAC (ID)</th>
                  <th className="py-3 px-4">Loại thiết bị</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Bệnh nhân sử dụng</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200/50">
                {devices.map((device) => {
                  const isAssigned = !!device.assigned_patient_id;
                  const patientName = device.patients?.user?.full_name || "N/A";
                  const bookletNo = device.patients?.booklet_number || "";
                  
                  // Xác định màu trạng thái
                  const isOnline = device.status === "online";
                  const isBusy = isOnline && isAssigned; // Có bệnh nhân dùng và đang online
                  
                  let statusLabel = "Ngoại tuyến";
                  let statusClass = "bg-gray-400";
                  
                  if (isOnline) {
                    if (isAssigned) {
                      statusLabel = "Đang tập luyện";
                      statusClass = "bg-amber-500 animate-pulse";
                    } else {
                      statusLabel = "Trực tuyến (Rảnh)";
                      statusClass = "bg-emerald-500 animate-pulse";
                    }
                  }

                  return (
                    <tr key={device.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-primary-500">
                        {device.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black inline-block uppercase ${
                          device.device_type === "hospital" 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}>
                          {device.device_type === "hospital" ? "Bệnh viện" : "Cá nhân"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span className={`w-2.5 h-2.5 rounded-full ${statusClass}`}></span>
                          <span>{statusLabel}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {isAssigned ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{patientName}</span>
                            {bookletNo && (
                              <span className="text-[10px] text-slate-400 font-semibold font-mono">Sổ y tế: {bookletNo}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-semibold italic">Chưa gán</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleToggleType(device.id, device.device_type)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-all"
                            title="Đổi loại thiết bị"
                          >
                            Đổi loại
                          </button>
                          
                          {isAssigned ? (
                            <button
                              onClick={() => handleRelease(device.id)}
                              className="px-3 py-1.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all"
                            >
                              Gỡ gán
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignModal(device)}
                              className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-900 text-xs font-bold rounded-lg transition-all shadow-2xs"
                            >
                              Gán bệnh nhân
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL GÁN THIẾT BỊ CHO BỆNH NHÂN */}
      {isAssignModalOpen && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsAssignModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 border border-primary-200 animate-fade-in flex flex-col gap-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-primary-900/10">
              <div>
                <h3 className="text-lg font-black text-primary-900">Gán thiết bị cho bệnh nhân</h3>
                <p className="text-[10px] text-slate-400 font-bold font-mono uppercase mt-1">
                  Thiết bị: {selectedDevice.id}
                </p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-primary-900/50 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Chọn bệnh nhân điều trị</label>
                <select
                  value={assignedPatientId}
                  onChange={(e) => setAssignedPatientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Chọn bệnh nhân để gán --</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || p.user?.full_name} ({p.booklet_number || "Chưa cấp sổ y tế"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận gán"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
