"use client"; // Chú ý: Bắt buộc phải có dòng này vì chúng ta dùng useState

import React, { useState } from 'react';

const mockUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", role: "Quản trị viên", status: "Active" },
  { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", role: "Bác sĩ", status: "Inactive" },
  { id: 3, name: "Lê Văn C", email: "levanc@gmail.com", role: "Kỹ thuật viên", status: "Busy" },
  { id: 4, name: "Phạm Thị D", email: "phamthid@gmail.com", role: "Y tá", status: "Active" },
  { id: 5, name: "Hoàng Văn E", email: "hoangvane@gmail.com", role: "Bác sĩ", status: "Active" },
];

export default function UserManagementPage() {
  // State quản lý việc đóng/mở Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] relative">

      {/* HEADER TRANG */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Quản lý người dùng
        </h1>

        {/* Nút kích hoạt Modal */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm người dùng mới
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-[#e0f2fe] rounded-2xl shadow-sm border border-[#bae6fd] flex flex-col flex-1 overflow-hidden">
        {/* Tiêu đề & Search */}
        <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#0c4a6e]/10">
          <h2 className="text-xl md:text-2xl font-bold">Danh sách người dùng</h2>
          <div className="relative w-full md:w-72">
            <input type="text" placeholder="Tìm kiếm..." className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#bae6fd] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#0c4a6e] placeholder-[#0c4a6e]/50 font-medium" />
            <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0c4a6e]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Khối Table (Giữ nguyên như cũ) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#e0f2fe] text-[#0c4a6e] text-sm md:text-base border-b border-[#0c4a6e]/20">
                <th className="py-4 px-6 font-bold whitespace-nowrap">Tên người dùng</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Email</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Vai trò</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Trạng thái</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#f0f9ff]/50 hover:bg-[#bae6fd]/30 transition-colors">
                  <td className="py-4 px-6 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
                      {/* Avatar Placeholder: Lấy chữ cái đầu */}
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#0c4a6e]/80">{user.email}</td>
                  <td className="py-4 px-6 font-medium">{user.role}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className={`w-2.5 h-2.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Inactive' ? 'bg-gray-400' : 'bg-red-500'}`}></span>
                      {user.status}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-1.5 hover:bg-[#bae6fd] rounded-lg transition-colors text-[#0c4a6e]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODAL THÊM NGƯỜI DÙNG (POPUP)
          ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Lớp màng đen mờ (Backdrop). Click vào đây cũng sẽ đóng Modal */}
          <div
            className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          ></div>

          {/* Khối nội dung Modal (Căn giữa) */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 z-10 transform transition-all">

            {/* Header của Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#0c4a6e]">Thêm người dùng</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#0c4a6e]/50 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form nhập liệu */}
            <form className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#0c4a6e]">Họ và tên</label>
                <input type="text" placeholder="Nhập họ tên" className="w-full px-4 py-3 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:bg-white transition-all font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#0c4a6e]">Email đăng nhập</label>
                <input type="email" placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:bg-white transition-all font-medium" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#0c4a6e]">Mật khẩu</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:bg-white transition-all font-medium" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#0c4a6e]">Vai trò (Role)</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#bae6fd] bg-[#f0f9ff]/50 text-[#0c4a6e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:bg-white transition-all font-medium cursor-pointer">
                    <option value="doctor">Bác sĩ</option>
                    <option value="nurse">Y tá</option>
                    <option value="technician">Kỹ thuật viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#0c4a6e]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-[#0c4a6e] bg-[#f0f9ff] hover:bg-[#bae6fd] transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0ea5e9] hover:bg-[#0c4a6e] shadow-md transition-colors"
                >
                  Tạo tài khoản
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}