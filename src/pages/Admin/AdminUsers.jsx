import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Shield, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './AdminUsers.scss';

// TODO: Mật khẩu mặc định cần được xử lý từ backend khi nối API
const DEFAULT_PASSWORD = '123456';
const EMPTY_USER = {
    name: '',
    email: '',
    role: 'worker',
    farmId: '',
    htxId: '',
    password: DEFAULT_PASSWORD,
    phone: '',
    status: 'active',
};

const roleLabelsMap = {
    admin: 'Admin',
    htx_manager: 'QL Hợp tác xã',
    farm_manager: 'Chủ Farm',
    approver: 'Duyệt viên',
    worker: 'Nhân viên',
};

const filterConfigs = [
    {
        key: 'role',
        label: 'Vai trò',
        options: Object.entries(roleLabelsMap).map(([k, v]) => ({ value: k, label: v })),
    },
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'active', label: 'Hoạt động' },
            { value: 'inactive', label: 'Ngừng' },
        ],
    },
];

const AdminUsers = () => {
    const { users, farms, cooperatives, addUser, updateUser, deleteUser, isLoading } = useData();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_USER);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filtered = useMemo(() => {
        let list = users;
        if (search) {
            const s = search.toLowerCase();
            list = list.filter((u) => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
        }
        if (filters.role) list = list.filter((u) => u.role === filters.role);
        if (filters.status) list = list.filter((u) => u.status === filters.status);
        return list;
    }, [users, search, filters]);

    const roleSummary = useMemo(() => {
        const counts = {};
        users.forEach((u) => {
            counts[u.role] = (counts[u.role] || 0) + 1;
        });
        return Object.entries(roleLabelsMap).map(([key, label]) => ({
            key,
            label,
            count: counts[key] || 0,
        }));
    }, [users]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            email: item.email,
            role: item.role,
            farmId: item.farmId || '',
            htxId: item.htxId || '',
            password: '',
            phone: item.phone || '',
            status: item.status,
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'name', label: 'Họ tên', sortable: true },
            { key: 'email', label: 'Email', sortable: true, hideOnMobile: true },
            {
                key: 'role',
                label: 'Vai trò',
                render: (v) => (
                    <StatusBadge status={roleLabelsMap[v] || v} variant="info" label={roleLabelsMap[v] || v} />
                ),
            },
            {
                key: 'status',
                label: 'TT',
                render: (v) => (
                    <StatusBadge
                        status={v === 'active' ? 'Active' : 'Closed'}
                        label={v === 'active' ? 'HĐ' : 'Ngừng'}
                    />
                ),
            },
            {
                key: '_actions',
                label: '',
                width: '120px',
                render: (_, row) => (
                    <div className="table-actions">
                        <button className="btn-icon" title="Sửa" onClick={() => openEdit(row)}>
                            <Edit size={14} />
                        </button>
                        <button
                            className="btn-icon"
                            title="Reset mật khẩu"
                            onClick={() => {
                                addToast(`Đã reset mật khẩu cho ${row.name}`, 'success');
                            }}
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button className="btn-icon btn-icon--danger" title="Xóa" onClick={() => setDeleteConfirm(row)}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [addToast, openEdit],
    );

    const handleSave = useCallback(async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            addToast('Nhập đủ họ tên và email', 'error');
            return;
        }
        if (editItem) {
            const updates = { ...formData };
            if (!updates.password) delete updates.password;
            await updateUser(editItem.id, updates);
            addToast('Đã cập nhật người dùng', 'success');
        } else {
            const newId = `U${String(users.length + 1).padStart(2, '0')}`;
            await addUser({ id: newId, ...formData, password: formData.password || DEFAULT_PASSWORD });
            addToast('Đã thêm người dùng', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_USER);
    }, [formData, editItem, users.length, addUser, updateUser, addToast]);

    const handleDelete = useCallback(async () => {
        await deleteUser(deleteConfirm.id);
        addToast('Đã xóa người dùng', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteUser, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Quản trị người dùng"
                subtitle={`${users.length} người dùng`}
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_USER);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Thêm người dùng
                    </button>
                }
            />

            {/* Role Summary */}
            <div className="admin-role-grid">
                {roleSummary.map((r) => (
                    <div key={r.key} className="card">
                        <div className="card__body admin-role-card">
                            <div className="admin-role-card__icon">
                                <Shield size={20} />
                            </div>
                            <div>
                                <span className="admin-role-card__label">{r.label}</span>
                                <p className="admin-role-card__count">{r.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <FilterBar
                onSearch={setSearch}
                searchPlaceholder="Tìm người dùng..."
                filters={filterConfigs}
                onFilterChange={setFilters}
            />
            <div className="card">
                <DataTable columns={columns} data={filtered} pageSize={10} />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Sửa người dùng' : 'Thêm người dùng'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> {editItem ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Họ tên *</label>
                        <input
                            className="form-field__input"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Email *</label>
                        <input
                            className="form-field__input"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Vai trò</label>
                        <select
                            className="form-field__input"
                            value={formData.role}
                            onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                        >
                            {Object.entries(roleLabelsMap).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">HTX</label>
                        <select
                            className="form-field__input"
                            value={formData.htxId}
                            onChange={(e) => setFormData((p) => ({ ...p, htxId: e.target.value }))}
                        >
                            <option value="">-- Không --</option>
                            {cooperatives.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Farm</label>
                        <select
                            className="form-field__input"
                            value={formData.farmId}
                            onChange={(e) => setFormData((p) => ({ ...p, farmId: e.target.value }))}
                        >
                            <option value="">-- Không --</option>
                            {farms.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">SĐT</label>
                        <input
                            className="form-field__input"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">{editItem ? 'Đổi mật khẩu' : 'Mật khẩu'}</label>
                        <input
                            className="form-field__input"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                            placeholder={editItem ? 'Để trống nếu không đổi' : '123456'}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Trạng thái</label>
                        <select
                            className="form-field__input"
                            value={formData.status}
                            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Ngừng</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xác nhận xóa"
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setDeleteConfirm(null)}>
                            Hủy
                        </button>
                        <button className="btn btn--danger" onClick={handleDelete} disabled={isLoading}>
                            <Trash2 size={16} /> Xóa
                        </button>
                    </div>
                }
            >
                <p>
                    Xóa tài khoản <strong>{deleteConfirm?.name}</strong> ({deleteConfirm?.email})?
                </p>
            </Modal>
        </div>
    );
};

export default AdminUsers;
