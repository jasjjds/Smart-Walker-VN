"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { patientService } from "@/services/patientService";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  
  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Doctor in charge state
  const [doctorName, setDoctorName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.patient_id) {
      const fetchPatientDetail = async () => {
        try {
          const res = await patientService.getPatientDetail(user.patient_id as number) as any;
          const patientData = res.data || res;
          if (patientData) {
            setDoctorName(patientData.doctor_name || patientData.doctor?.full_name || null);
          }
        } catch (err) {
          console.error("Lỗi lấy thông tin bác sĩ phụ trách:", err);
        }
      };
      fetchPatientDetail();
    }
  }, [isOpen, user?.patient_id]);

  // Reset editing mode when profile drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setEditError(null);
    }
  }, [isOpen]);

  const handleStartEdit = () => {
    setEditFullName(user?.full_name || "");
    setEditPhoneNumber(user?.phone_number || "");
    setEditGender(user?.gender || "Khác");
    if (user?.date_of_birth) {
      try {
        const d = new Date(user.date_of_birth);
        if (!isNaN(d.getTime())) {
          setEditDateOfBirth(d.toISOString().split('T')[0]);
        } else {
          setEditDateOfBirth("");
        }
      } catch (e) {
        setEditDateOfBirth("");
      }
    } else {
      setEditDateOfBirth("");
    }
    setEditError(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: editFullName,
        phone_number: editPhoneNumber,
        gender: editGender,
        date_of_birth: editDateOfBirth || null
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      setEditError(err.response?.data?.message || err.message || "Cập nhật hồ sơ thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (roleId?: number) => {
    if (roleId === 1) return "Quản trị viên";
    if (roleId === 3) return "Bác sĩ";
    if (roleId === 2) return "Bệnh nhân";
    return "Người dùng";
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer panel */}
      <aside className={`absolute top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} text-[#0c4a6e]`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold">Thông tin tài khoản</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          {/* Avatar block */}
          <div className="w-24 h-24 rounded-full bg-[#0ea5e9]/10 border-4 border-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] text-3xl font-black mb-4 shrink-0">
            {getInitials(user?.full_name)}
          </div>
          
          <span className="px-3 py-1 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-full text-xs font-bold uppercase tracking-wider mb-2 shrink-0">
            {getRoleLabel(user?.role_id)}
          </span>

          <div className="flex flex-col items-center gap-0.5 mb-4 shrink-0 text-slate-500 font-mono text-[10px] sm:text-xs">
            <span>ID Người dùng: {user?.id || 'N/A'}</span>
            {user?.patient_id && (
              <span className="font-bold text-[#0ea5e9]">Mã HSBN: {user.patient_id}</span>
            )}
          </div>

          <h4 className="text-xl font-bold mb-6 text-center w-full truncate">{user?.full_name || 'Unknown'}</h4>
          
          {/* Info details list / Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="w-full flex flex-col gap-4 border-t border-slate-100 pt-6">
              {editError && (
                <div className="text-xs text-red-600 font-semibold p-2 bg-red-50 rounded-lg border border-red-100">
                  ⚠️ {editError}
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0c4a6e]/50 uppercase tracking-wider font-sans">Họ và tên</label>
                <input 
                  type="text" 
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-200 focus:outline-none focus:border-[#0ea5e9] bg-slate-50 text-[#0c4a6e] font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0c4a6e]/50 uppercase tracking-wider font-sans">Email đăng nhập</label>
                <input 
                  type="email" 
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0c4a6e]/50 uppercase tracking-wider font-sans">Số điện thoại</label>
                <input 
                  type="text" 
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-200 focus:outline-none focus:border-[#0ea5e9] bg-slate-50 text-[#0c4a6e] font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0c4a6e]/50 uppercase tracking-wider font-sans">Giới tính</label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-200 focus:outline-none focus:border-[#0ea5e9] bg-slate-50 text-[#0c4a6e] font-semibold"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#0c4a6e]/50 uppercase tracking-wider font-sans">Ngày sinh</label>
                <input 
                  type="date" 
                  value={editDateOfBirth}
                  onChange={(e) => setEditDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-slate-200 focus:outline-none focus:border-[#0ea5e9] bg-slate-50 text-[#0c4a6e] font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-50 cursor-pointer text-center"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors text-sm cursor-pointer text-center"
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full flex flex-col gap-5 border-t border-slate-100 pt-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Họ và tên</span>
                <span className="text-sm font-semibold">{user?.full_name || 'Unknown'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Email đăng nhập</span>
                <span className="text-sm font-semibold break-all">{user?.email || 'N/A'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Số điện thoại</span>
                <span className="text-sm font-semibold">{user?.phone_number || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Giới tính</span>
                <span className="text-sm font-semibold">{user?.gender || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ngày sinh</span>
                <span className="text-sm font-semibold">
                  {user?.date_of_birth 
                    ? new Date(user.date_of_birth).toLocaleDateString('vi-VN') 
                    : 'Chưa cập nhật'}
                </span>
              </div>

              {user?.patient_id && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Bác sĩ phụ trách</span>
                  <span className="text-sm font-semibold text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 w-fit">
                    {doctorName ? `BS. ${doctorName}` : 'Chưa gán bác sĩ'}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleStartEdit}
                  className="w-full py-2.5 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa hồ sơ
                </button>
                
                <button
                  onClick={() => {
                    onClose();
                    router.push('/auth/change-password');
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất tài khoản
          </button>
        </div>
      </aside>
    </div>
  );
}
