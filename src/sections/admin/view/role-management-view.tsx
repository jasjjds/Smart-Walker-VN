"use client";

import React, { useState, useEffect } from 'react';
import CustomDataTable, { ColumnDefinition } from '@/components/custom/custom_data_table';
import { roleService } from '@/services/roleService';
import { CustomInput } from '@/components/custom/custom-input';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, CloseIcon } from '@/components/common/icons';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  user_count: number;
  permissions: Permission[];
}

export function RoleManagementView() {
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

  // Active items
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [] as number[],
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    if (!isPolling) setError(null);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);

      const res1 = rolesRes as any;
      const res2 = permissionsRes as any;

      if (res1?.success) {
        setRoles(res1.data);
      }
      if (res2?.success) {
        setPermissions(res2.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách vai trò.');
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open add modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      permissionIds: [],
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (role: Role) => {
    // Admin role (id=1) is protected
    if (role.id === 1) {
      alert('Không thể chỉnh sửa vai trò Admin hệ thống mặc định!');
      return;
    }
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissionIds: role.permissions.map(p => p.id),
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const handleOpenDeleteModal = (role: Role) => {
    // Default system roles are protected
    if ([1, 2, 3, 4].includes(role.id)) {
      alert('Không thể xóa các vai trò hệ thống mặc định!');
      return;
    }
    // Roles with users are protected
    if (role.user_count > 0) {
      alert('Không thể xóa vai trò này vì hiện tại đang có tài khoản sử dụng vai trò này!');
      return;
    }
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  // Handle Form Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle permission checkbox
  const handlePermissionToggle = (permId: number) => {
    setFormData(prev => {
      const perms = prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter(id => id !== permId)
        : [...prev.permissionIds, permId];
      return { ...prev, permissionIds: perms };
    });
  };

  // Submit add role
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await roleService.createRole({
        name: formData.name,
        description: formData.description,
        permission_ids: formData.permissionIds,
      });

      if ((res as any)?.success) {
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo vai trò.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit edit role
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await roleService.updateRole(selectedRole.id, {
        name: formData.name,
        description: formData.description,
        permission_ids: formData.permissionIds,
      });

      if ((res as any)?.success) {
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit delete role
  const handleDeleteSubmit = async () => {
    if (!selectedRole) return;
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await roleService.deleteRole(selectedRole.id);
      if ((res as any)?.success) {
        setIsDeleteModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Không thể xóa vai trò này.');
    } finally {
      setFormSubmitting(false);
      setSelectedRole(null);
    }
  };

  // Filter roles based on search query
  const filteredRoles = roles.filter(role => {
    const query = searchQuery.toLowerCase().trim();
    return role.name.toLowerCase().includes(query) || role.description.toLowerCase().includes(query);
  });

  // Table columns definition
  const roleColumns: ColumnDefinition<Role>[] = [
    {
      header: 'Tên vai trò',
      cell: (role) => (
        <div className="flex flex-col gap-1 font-semibold">
          <span className="text-primary-900 font-bold text-sm">{role.name}</span>
          <span className="text-xs text-primary-900/70 truncate max-w-[200px]" title={role.description}>
            {role.description || 'Không có mô tả'}
          </span>
        </div>
      )
    },
    {
      header: 'Số người dùng',
      cell: (role) => (
        <span className="font-bold bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs">
          {role.user_count} thành viên
        </span>
      )
    },
    {
      header: 'Quyền hạn hạn định',
      cell: (role) => (
        <div className="flex flex-wrap gap-1 max-w-[400px] py-1">
          {role.permissions.length === 0 ? (
            <span className="text-xs italic text-primary-900/50">Không có quyền hạn nào</span>
          ) : (
            role.permissions.map(p => (
              <span
                key={p.id}
                className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                title={p.description}
              >
                {p.name}
              </span>
            ))
          )}
        </div>
      )
    },
    {
      header: 'Thao tác',
      cell: (role) => {
        const isSystem = [1, 2, 3, 4].includes(role.id);
        const hasUsers = role.user_count > 0;

        return (
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleOpenEditModal(role)}
              disabled={role.id === 1}
              className={`p-1.5 rounded-lg transition-colors ${
                role.id === 1
                  ? 'opacity-30 cursor-not-allowed text-gray-400'
                  : 'hover:bg-primary-200 text-primary-900'
              }`}
              title={role.id === 1 ? 'Không thể sửa Admin hệ thống' : 'Chỉnh sửa vai trò'}
            >
              <EditIcon className="w-5 h-5" />
            </button>
            {!isSystem && (
              <button
                onClick={() => handleOpenDeleteModal(role)}
                disabled={hasUsers}
                className={`p-1.5 rounded-lg transition-colors ${
                  hasUsers
                    ? 'opacity-30 cursor-not-allowed text-gray-400'
                    : 'hover:bg-red-100 text-red-600'
                }`}
                title={
                  hasUsers
                    ? 'Không thể xóa vì vai trò đã được gán cho người dùng'
                    : 'Xóa vai trò'
                }
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <CustomInput
          placeholder="Tìm kiếm theo vai trò..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchIcon className="w-4 h-4 text-primary-900/50" />}
          variant="search"
          className="w-full sm:w-72"
        />

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm vai trò mới
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* DATA TABLE */}
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
            columns={roleColumns}
            data={filteredRoles}
            onRefresh={() => fetchData(true)}
            refreshInterval={60000}
          />
        )}
      </div>

      {/* =========================================
          MODAL THÊM VAI TRÒ MỚI
          ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-900">Thêm vai trò mới</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-primary-900/50 hover:text-red-500 transition-colors p-1"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Tên vai trò</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Bác sĩ trưởng khoa, Kỹ thuật viên..."
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Mô tả vai trò</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chức năng hoặc phạm vi của vai trò này"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium resize-none"
                />
              </div>

              {/* PERMISSIONS SELECT CHECKBOXES */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-bold text-primary-900">Chọn quyền hạn định cho vai trò</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-primary-200 rounded-xl p-3 bg-primary-50/30 max-h-48 overflow-y-auto">
                  {permissions.map(p => (
                    <label key={p.id} className="flex items-start gap-2 cursor-pointer p-1 hover:bg-primary-200/20 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permissionIds.includes(p.id)}
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
                  Tạo vai trò
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL CHỈNH SỬA VAI TRÒ
          ========================================= */}
      {isEditModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-900">Chỉnh sửa vai trò</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-primary-900/50 hover:text-red-500 transition-colors p-1"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Tên vai trò</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên vai trò"
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary-900">Mô tả vai trò</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium resize-none"
                />
              </div>

              {/* PERMISSIONS SELECT CHECKBOXES */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-bold text-primary-900">Điều chỉnh các quyền hạn</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-primary-200 rounded-xl p-3 bg-primary-50/30 max-h-48 overflow-y-auto">
                  {permissions.map(p => (
                    <label key={p.id} className="flex items-start gap-2 cursor-pointer p-1 hover:bg-primary-200/20 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.permissionIds.includes(p.id)}
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
          MODAL XÓA VAI TRÒ CONFIRMATION
          ========================================= */}
      {isDeleteModalOpen && selectedRole && (
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

            <h3 className="text-xl font-bold text-primary-900 mb-2">Xác nhận xóa vai trò</h3>
            <p className="text-sm text-primary-900/85 mb-6">
              Bạn có chắc chắn muốn xóa vai trò <strong>{selectedRole.name}</strong>? Hành động này sẽ xóa vĩnh viễn vai trò khỏi hệ thống. Không thể hoàn tác!
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
