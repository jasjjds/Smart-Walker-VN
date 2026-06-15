"use client";

import React, { useState, useEffect } from 'react';
import CustomDataTable, { ColumnDefinition } from '@/components/custom/custom_data_table';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';

interface UserPermission {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  full_name: string | null;
  email: string;
  role: {
    id: number;
    name: string;
    description: string;
  } | null;
  patient_id: number | null;
  patient_status: string | null;
  extra_permissions: UserPermission[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

export function UserManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for edit/delete
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: '',
    extraPermissions: [] as number[],
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    if (!isPolling) setError(null);
    try {
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);

      const res1 = usersRes as any;
      const res2 = rolesRes as any;
      const res3 = permissionsRes as any;

      if (res1?.success) {
        setUsers(res1.data);
      }
      if (res2?.success) {
        setRoles(res2.data);
      }
      if (res3?.success) {
        setPermissions(res3.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu từ máy chủ.');
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open add user modal
  const handleOpenAddModal = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      roleId: roles[0]?.id.toString() || '',
      extraPermissions: [],
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open edit user modal
  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.full_name || '',
      email: user.email,
      password: '', // Để trống nếu không muốn đổi mật khẩu
      roleId: user.role?.id?.toString() || '',
      extraPermissions: user.extra_permissions?.map(up => up.id) || [],
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle Form Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle permission checkbox
  const handlePermissionToggle = (permId: number) => {
    setFormData(prev => {
      const perms = prev.extraPermissions.includes(permId)
        ? prev.extraPermissions.filter(id => id !== permId)
        : [...prev.extraPermissions, permId];
      return { ...prev, extraPermissions: perms };
    });
  };

  // Submit add user
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await userService.createUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName || null,
        role_id: parseInt(formData.roleId),
        extra_permissions: formData.extraPermissions,
      });

      if ((res as any)?.success) {
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit edit user
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);
    setFormSubmitting(true);

    try {
      const payload: any = {
        email: formData.email,
        role_id: parseInt(formData.roleId),
        extra_permissions: formData.extraPermissions,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await userService.updateUser(selectedUser.id, payload);

      if ((res as any)?.success) {
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit delete user
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await userService.deleteUser(selectedUser.id);
      if ((res as any)?.success) {
        setIsDeleteModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Không thể xóa người dùng này.');
    } finally {
      setFormSubmitting(false);
      setSelectedUser(null);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = user.full_name?.toLowerCase().includes(query) || false;
    const emailMatch = user.email.toLowerCase().includes(query);
    const roleMatch = user.role?.name?.toLowerCase().includes(query) || false;
    return nameMatch || emailMatch || roleMatch;
  });

  // Data Table Column Definitions
  const userColumns: ColumnDefinition<User>[] = [
    {
      header: 'Tên người dùng',
      cell: (user) => {
        const displayName = user.full_name || 'Chưa cập nhật';
        const letter = displayName.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-3 font-semibold">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-900 shadow-sm border border-primary-200 shrink-0 font-bold">
              {letter}
            </div>
            <span className="truncate">{displayName}</span>
          </div>
        );
      }
    },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Vai trò',
      cell: (user) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md text-xs inline-block w-fit">
            {user.role?.name || 'Chưa gán'}
          </span>
          {user.role?.description && (
            <span className="text-xs text-sky-600/75 truncate max-w-[200px]" title={user.role.description}>
              {user.role.description}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Trạng thái',
      cell: (user) => {
        const isOnline = user.patient_status === 'online';
        const statusText = isOnline ? 'Trực tuyến' : 'Ngoại tuyến';

        return (
          <div className="flex items-center gap-2 font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isOnline ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-gray-400'
            }`}></span>
            <span>{statusText}</span>
          </div>
        );
      }
    },
    {
      header: 'Thao tác',
      cell: (user) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => handleOpenEditModal(user)}
            className="p-1.5 hover:bg-primary-200 rounded-lg transition-colors text-primary-900"
            title="Chỉnh sửa tài khoản"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => handleOpenDeleteModal(user)}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600"
            title="Xóa tài khoản"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900 relative">
      {/* HEADER SECTION - NO TITLE SHOWN FOR CONCISE INTEGRATED LOOK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, vai trò..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-sm"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-900/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm người dùng mới
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* DATA TABLE AREA */}
      <div className="flex-1 min-h-[300px] overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-primary-900/60">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-semibold text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <CustomDataTable
            columns={userColumns}
            data={filteredUsers}
            onRefresh={() => fetchData(true)}
            refreshInterval={60000}
          />
        )}
      </div>

      {/* =========================================
          MODAL THÊM NGƯỜI DÙNG
          ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-900">Thêm người dùng mới</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-primary-900/50 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Họ và tên (Tùy chọn)</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên đầy đủ"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Email đăng nhập</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary-900">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary-900">Vai trò (Role)</label>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* EXTRA PERMISSIONS CHECKBOXES */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-bold text-primary-900">Cấp thêm quyền riêng biệt (Tùy chọn)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-primary-200 rounded-xl p-3 bg-primary-50/30 max-h-40 overflow-y-auto">
                  {permissions.map(p => (
                    <label key={p.id} className="flex items-start gap-2 cursor-pointer p-1 hover:bg-primary-200/20 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.extraPermissions.includes(p.id)}
                        onChange={() => handlePermissionToggle(p.id)}
                        className="mt-1 rounded border-primary-200 text-primary-500 focus:ring-primary-500 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-primary-900 text-xs">{p.name}</span>
                        <span className="text-[10px] text-primary-900/70 leading-snug">{p.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-900/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formSubmitting}
                  className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-primary-900 bg-primary-50 hover:bg-primary-200 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-900 shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting && (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL CHỈNH SỬA NGƯỜI DÙNG
          ========================================= */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-900">Cập nhật người dùng</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-primary-900/50 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5 bg-gray-50 p-3 rounded-xl border border-gray-150 mb-2">
                <span className="text-xs text-primary-900/70 font-semibold uppercase tracking-wider">Thông tin cá nhân (Đọc)</span>
                <span className="font-bold text-primary-900 text-base mt-1">{selectedUser.full_name || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Email đăng nhập</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary-900">Mật khẩu mới (Để trống nếu giữ nguyên)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary-900">Vai trò (Role)</label>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* EXTRA PERMISSIONS CHECKBOXES */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-bold text-primary-900">Quyền hạn riêng biệt bổ sung</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-primary-200 rounded-xl p-3 bg-primary-50/30 max-h-40 overflow-y-auto">
                  {permissions.map(p => (
                    <label key={p.id} className="flex items-start gap-2 cursor-pointer p-1 hover:bg-primary-200/20 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.extraPermissions.includes(p.id)}
                        onChange={() => handlePermissionToggle(p.id)}
                        className="mt-1 rounded border-primary-200 text-primary-500 focus:ring-primary-500 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-primary-900 text-xs">{p.name}</span>
                        <span className="text-[10px] text-primary-900/70 leading-snug">{p.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-900/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={formSubmitting}
                  className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-primary-900 bg-primary-50 hover:bg-primary-200 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-900 shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting && (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL XÓA NGƯỜI DÙNG CONFIRMATION
          ========================================= */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-primary-900 mb-2">Xác nhận xóa tài khoản</h3>
            <p className="text-sm text-primary-900/85 mb-6">
              Bạn có chắc chắn muốn xóa tài khoản <strong>{selectedUser.full_name || selectedUser.email}</strong>? Hành động này sẽ xóa vĩnh viễn tài khoản và các dữ liệu liên quan. Không thể hoàn tác!
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={formSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-primary-900 bg-primary-50 hover:bg-primary-200 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={formSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {formSubmitting && (
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
